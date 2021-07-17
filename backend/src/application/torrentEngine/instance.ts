import BitField from 'bitfield';
import { TorrentDiscovery } from 'application/torrentEngine/discovery';
import { TorrentFile } from 'application/torrentEngine/file';
import { Peer } from 'application/torrentEngine/peer';
import { EventEmitter } from 'stream';
import Piece from 'torrent-piece';
import Debug from 'debug';
import sha1 from 'simple-sha1';
import hat from 'hat';

export interface IMetadata {
	length: number;
	pieces: string[];
	pieceLength: number;
	lastPieceLength: number;
	file: {
		name: string;
		offset: number;
		length: number;
	};
}

export interface ITorrentPiece {
	index: number;
	piece: Piece;
	priority: boolean;
}

export interface IPieceRequest {
	id: string;
	peer: Peer;
	reservation: number;
	piece: ITorrentPiece;
	timeout: NodeJS.Timeout | null;
	hotswapped: boolean;
}

const CONCURRENT_REQUESTS = 5;
const BLOCK_TIMEOUT = 5000;
const SPEED_THRESHOLD = 16384;

export class TorrentInstance extends EventEmitter {
	discovery: TorrentDiscovery;
	metadata: IMetadata;
	bitfield: BitField;
	file: TorrentFile;
	pieceQueue: ITorrentPiece[] = [];
	priorityPieceQueue: ITorrentPiece[] = [];
	requests: IPieceRequest[] = [];
	numOfPieces: number;
	rack = hat.rack();
	debug = Debug('instance');

	constructor(discovery: TorrentDiscovery, metadata: IMetadata, path: string) {
		super();
		this.discovery = discovery;
		this.metadata = metadata;
		this.bitfield = new BitField(this.metadata.pieces.length);
		this.file = new TorrentFile(this, {
			path,
			name: metadata.file.name,
			offset: metadata.file.offset,
			length: metadata.file.length,
			chunkLength: metadata.pieceLength,
			leftOver: metadata.length - metadata.file.length,
			lastChunkLength: metadata.lastPieceLength,
		});
		this.numOfPieces = this.metadata.pieces.length - 1;
		this.verify(0);
		this.on('verified', () => {
			this.discovery.instance = this;
			this.emit('ready');
		});
		this.on('idle', () => {
			this.discovery.peers.forEach((peer) => {
				this.updateInterest(peer);
			});
		});
	}

	getMovieHash = (): void => {
		let total = BigInt(this.file.options.length);
		let buffer = Buffer.from('');
		const startStream = this.file.stream(0, 65535);
		startStream.on(
			'data',
			(buf: Buffer) => (buffer = Buffer.concat([buffer, buf]))
		);
		startStream.on('close', () => {
			const endStream = this.file.stream(this.file.options.length - 65536);
			endStream.on(
				'data',
				(buf: Buffer) => (buffer = Buffer.concat([buffer, buf]))
			);
			endStream.on('close', () => {
				if (buffer.length !== 131072) {
					console.log('Moviehash buffer length not correct', buffer.length);
				}
				for (let i = 0; i < 131072 / 8; i++) {
					const offset = i * 8;
					total += buffer.readBigUInt64LE(offset);
				}
				const hash = BigInt.asUintN(64, total).toString(16).padStart(16, '0');
				this.debug('got moviehash', hash);
				this.emit('moviehash', hash);
			});
		});
	};

	startDownload = (): void => {
		this.buildPieces();
		this.refresh();
		this.getMovieHash();
	};

	refresh = (): void => {
		if (!this.pieceQueue.length && !this.priorityPieceQueue.length) return;
		this.debug('Refreshing');
		process.nextTick(() => {
			this.discovery.peers.forEach((peer) => {
				this.updateInterest(peer);
				this.requestBlocks(peer);
			});
		});
	};

	verify = (index: number): void => {
		if (this.file.startPiece + index > this.file.endPiece) {
			this.debug('verified');
			this.emit('verified');
			return;
		}
		this.debug(`Verifying piece ${this.file.startPiece + index}`);
		this.file.store.get(this.file.startPiece + index, undefined, (err, buf) => {
			if (!err && buf) {
				if (
					sha1.sync(buf) === this.metadata.pieces[this.file.startPiece + index]
				) {
					this.bitfield.set(this.file.startPiece + index);
					this.debug(`Piece ${this.file.startPiece + index} verified`);
				}
			}
			this.verify(index + 1);
		});
	};

	updateInterest = (peer: Peer): void => {
		let shouldWeInterest = false;
		if (this.pieceQueue.length || this.priorityPieceQueue.length) {
			for (let i = this.file.startPiece; i <= this.file.endPiece; i++) {
				if (!this.bitfield.get(i) && peer.wire.peerPieces.get(i)) {
					shouldWeInterest = true;
					break;
				}
			}
		}

		if (shouldWeInterest && !peer.wire.amInterested) {
			this.debug(`Sending interested to ${peer.address.ip}`);
			peer.wire.interested();
		} else if (!shouldWeInterest && peer.wire.amInterested) {
			this.debug(`Sending uninterested to ${peer.address.ip}`);
			peer.wire.uninterested();
		}
	};

	buildPieces = (): void => {
		for (let i = this.file.startPiece; i <= this.file.endPiece; i++) {
			if (this.bitfield.get(i)) continue;
			if (i === this.numOfPieces) {
				this.pieceQueue.push({
					index: i,
					piece: new Piece(this.metadata.lastPieceLength),
					priority: false,
				});
			} else {
				this.pieceQueue.push({
					index: i,
					piece: new Piece(this.metadata.pieceLength),
					priority: false,
				});
			}
		}
	};

	prioritize = (startPiece: number, length: number): void => {
		for (let i = 0; i <= length; i++) {
			if (this.bitfield.get(startPiece + i)) continue;
			if (this.priorityPieceQueue.find((p) => p.index === startPiece + i))
				continue;
			this.debug(`prioritizing piece ${startPiece + i}`);
			const piece = this.pieceQueue.find((p) => p.index === startPiece + i);
			if (piece) {
				this.priorityPieceQueue.push({ ...piece, priority: true });
			} else {
				let pieceLength = this.metadata.pieceLength;
				if (startPiece + i === this.numOfPieces) {
					pieceLength = this.metadata.lastPieceLength;
				}
				this.priorityPieceQueue.push({
					index: startPiece + i,
					piece: new Piece(pieceLength),
					priority: true,
				});
			}
		}
	};

	queueRequests = (): void => {
		if (!this.pieceQueue.length && !this.priorityPieceQueue.length) return;
		process.nextTick(() => {
			this.discovery.peers.forEach((peer) => {
				this.requestBlocks(peer);
			});
		});
	};

	requestBlocks = (peer: Peer): IPieceRequest | undefined => {
		if (peer.wire.peerChoking) return;

		while (peer.wire.requests.length < CONCURRENT_REQUESTS) {
			let request = this.reserveBlock(peer, this.priorityPieceQueue);
			if (!request) request = this.reserveBlock(peer, this.pieceQueue);
			if (request) {
				this.requestBlock(request);
			} else {
				this.debug('No request');
				return;
			}
		}
	};

	reserveBlock = (
		peer: Peer,
		pieceQueue: ITorrentPiece[]
	): IPieceRequest | undefined => {
		let reservation = 0;
		const length = pieceQueue.length;

		for (let i = 0; i < length; i++) {
			if (!peer.wire.peerPieces.get(pieceQueue[i].index)) continue;
			reservation = pieceQueue[i].piece.reserve();
			if (reservation === -1) {
				const request = this.hotswap(peer, pieceQueue[i].index);
				if (request) return request;
			} else {
				this.debug(
					`Peer ${peer.address.ip} reserve ${pieceQueue[i].index}:${reservation}`
				);
				return {
					id: this.rack(),
					peer,
					reservation,
					piece: pieceQueue[i],
					timeout: null,
					hotswapped: false,
				};
			}
		}
	};

	hotswap = (peer: Peer, pieceIndex: number): IPieceRequest | undefined => {
		const length = this.requests.length;
		for (let i = 0; i < length; i++) {
			if (
				this.requests[i].piece.index === pieceIndex &&
				this.requests[i].peer.address.ip !== peer.address.ip &&
				this.requests[i].peer.wire.downloadSpeed() < SPEED_THRESHOLD &&
				peer.wire.downloadSpeed() > SPEED_THRESHOLD
			) {
				const r = this.requests[i];
				this.debug(
					`Peer ${peer.address.ip} hotswap ${pieceIndex}:${r.reservation}`
				);
				clearTimeout(r.timeout!);
				this.requests = this.requests.filter((req) => req.id !== r.id);
				r.hotswapped = true;
				r.peer.wire.cancel(
					pieceIndex,
					r.piece.piece.chunkOffset(r.reservation),
					r.piece.piece.chunkLength(r.reservation)
				);
				r.peer = peer;
				return r;
			}
		}
	};

	requestBlock = (request: IPieceRequest): void => {
		this.debug(
			`request block ${request.piece.index}:${request.reservation} from ${request.peer.address.ip}`
		);
		request.timeout = setTimeout(
			() => this.requestTimeout(request),
			BLOCK_TIMEOUT
		);
		request.hotswapped = false;
		this.requests.push(request);
		request.peer.wire.request(
			request.piece.index,
			request.piece.piece.chunkOffset(request.reservation),
			request.piece.piece.chunkLength(request.reservation),
			(err, buffer) => {
				this.requests = this.requests.filter((r) => r.id !== request.id);
				clearTimeout(request.timeout!);
				if (err) {
					this.debug(
						`Error request ${request.piece.index}:${request.reservation} from ${request.peer.address.ip}`
					);
					if (!request.hotswapped) {
						this.debug(
							`Peer ${request.peer.address.ip} cancel ${request.piece.index}:${request.reservation}`
						);
						request.piece.piece.cancel(request.reservation);
					}
					this.queueRequests();
				} else if (buffer) {
					this.debug(
						`Received block ${request.piece.index}:${request.reservation} from ${request.peer.address.ip}`
					);
					this.onChunk(request, buffer);
				} else {
					this.debug(
						`No buffer for ${request.piece.index}:${request.reservation} from ${request.peer.address.ip}`
					);
					this.debug(
						`Peer ${request.peer.address.ip} cancel ${request.piece.index}:${request.reservation}`
					);
					request.piece.piece.cancel(request.reservation);
					this.queueRequests();
				}
			}
		);
		this.queueRequests();
	};

	requestTimeout = (request: IPieceRequest): void => {
		this.debug(
			`Timeout request ${request.piece.index}:${request.reservation} from ${request.peer.address.ip}`
		);
		request.peer.wire.cancel(
			request.piece.index,
			request.piece.piece.chunkOffset(request.reservation),
			request.piece.piece.chunkLength(request.reservation)
		);
		this.queueRequests();
	};

	onChunk = (request: IPieceRequest, buffer: Buffer): void => {
		// If piece is not done, make new request.
		if (
			!request.piece.piece.set(request.reservation, buffer, request.peer.wire)
		) {
			this.queueRequests();
			return;
		}

		// Piece done, remove it from queue.
		this.pieceQueue = this.pieceQueue.filter(
			(p) => p.index !== request.piece.index
		);
		if (request.piece.priority) {
			this.priorityPieceQueue = this.priorityPieceQueue.filter(
				(p) => p.index !== request.piece.index
			);
		}

		const pieceBuffer = request.piece.piece.flush();
		sha1(pieceBuffer, (hash) => {
			if (hash === this.metadata.pieces[request.piece.index]) {
				this.onPieceComplete(request.piece.index, pieceBuffer);
				this.queueRequests();
			} else {
				// Piece validation failed, create a new piece and put it in queue.
				this.debug(`Validation failed for piece ${request.piece.index}`);
				const newPiece: ITorrentPiece = {
					index: request.piece.index,
					piece: new Piece(request.piece.piece.length),
					priority: request.piece.priority,
				};
				if (newPiece.priority) {
					this.priorityPieceQueue.unshift(newPiece);
				} else {
					this.pieceQueue.unshift(newPiece);
				}
			}
		});
		this.queueRequests();
	};

	onPieceComplete = (index: number, buffer: Buffer): void => {
		this.bitfield.set(index);
		this.file.store.put(index, buffer, (err?: Error) => {
			if (err) {
				this.debug(`Error writing data piece ${index}`, err, buffer.length);
			}
		});
		this.debug(`Piece ${index} validated`);
		this.emit(`piece${index}`);
		this.emit('piece', index);
		this.discovery.peers.forEach((peer) => {
			peer.wire.have(index);
		});
		if (!this.pieceQueue.length && !this.priorityPieceQueue.length) {
			this.emit('idle');
		}
	};
}
