import BitField from 'bitfield';
import { TorrentDiscovery } from 'application/torrentEngine/discovery';
import { TorrentFile } from 'application/torrentEngine/file';
import { Peer } from 'application/torrentEngine/peer';
import { EventEmitter } from 'stream';
import Piece from 'torrent-piece';
import Debug from 'debug';
import sha1 from 'simple-sha1';

export interface IMetadata {
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
	peer: Peer;
	reservation: number;
	piece: ITorrentPiece;
}

const CONCURRENT_REQUESTS = 5;
const BLOCK_TIMEOUT = 10000;

export class TorrentInstance extends EventEmitter {
	discovery: TorrentDiscovery;
	metadata: IMetadata;
	bitfield: BitField;
	file: TorrentFile;
	pieceQueue: ITorrentPiece[] = [];
	priorityPieceQueue: ITorrentPiece[] = [];
	requestQueue: IPieceRequest[] = [];
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
		});
		this.verify();
		this.on('verified', () => {
			this.buildPieces();
			this.discovery.instance = this;
			this.discovery.peers.forEach((peer) => {
				this.updateInterest(peer);
				// this.requestBlocks(peer);
			});
			this.emit('ready');
		});
	}

	verify = (): void => {
		let callbacks = 0;
		for (let i = this.file.startPiece; i <= this.file.endPiece; i++) {
			callbacks++;
			this.file.get(i, (err, buf) => {
				if (!err && buf) {
					if (sha1.sync(buf) === this.metadata.pieces[i]) {
						this.bitfield.set(i);
					}
				}
				callbacks--;
				if (callbacks === 0) {
					this.debug('verified');
					this.emit('verified');
				}
			});
		}
	};

	updateInterest = (peer: Peer): void => {
		let shouldWeInterest = false;
		for (let i = this.file.startPiece; i <= this.file.endPiece; i++) {
			if (!this.bitfield.get(i) && peer.wire.peerPieces.get(i)) {
				shouldWeInterest = true;
				break;
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
		const numOfPieces = this.metadata.pieces.length;
		for (let i = this.file.startPiece; i <= this.file.endPiece; i++) {
			if (this.bitfield.get(i)) continue;
			const length =
				i === numOfPieces
					? this.metadata.lastPieceLength
					: this.metadata.pieceLength;
			this.pieceQueue.push({
				index: i,
				piece: new Piece(length),
				priority: false,
			});
		}
	};

	prioritize = (startPiece: number, length: number): void => {
		for (let i = 0; i <= length; i++) {
			if (this.bitfield.get(startPiece + i)) continue;
			const piece = this.pieceQueue.find((p) => p.index === startPiece + i);
			if (!piece) continue;
			this.debug(`prioritizing piece ${startPiece + i}`);
			this.pieceQueue = this.pieceQueue.filter(
				(p) => p.index !== startPiece + i
			);
			this.priorityPieceQueue.push({ ...piece, priority: true });
		}
	};

	queueRequests = (): void => {
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
			if (reservation !== -1) {
				return {
					peer,
					reservation,
					piece: pieceQueue[i],
				};
			}
		}
	};

	requestBlock = (request: IPieceRequest): void => {
		// this.debug(
		// 	`request block ${request.piece.index}:${request.reservation} from ${request.peer.address.ip}`
		// );
		const timeout = setTimeout(
			() => this.requestTimeout(request),
			BLOCK_TIMEOUT
		);
		request.peer.wire.request(
			request.piece.index,
			request.piece.piece.chunkOffset(request.reservation),
			request.piece.piece.chunkLength(request.reservation),
			(err, buffer) => {
				clearTimeout(timeout);
				if (err) {
					// this.debug(
					// 	`Error request ${request.piece.index}:${request.reservation} from ${request.peer.address.ip}`
					// );
					request.piece.piece.cancel(request.reservation);
					this.queueRequests();
				} else if (buffer) {
					// this.debug(
					// 	`Received block ${request.piece.index}:${request.reservation} from ${request.peer.address.ip}`
					// );
					this.onChunk(request, buffer);
				} else {
					this.debug(
						`No buffer for ${request.piece.index}:${request.reservation} from ${request.peer.address.ip}`
					);
					this.queueRequests();
				}
			}
		);
		this.queueRequests();
	};

	requestTimeout = (request: IPieceRequest): void => {
		// this.debug(
		// 	`Timeout request ${request.piece.index}:${request.reservation} from ${request.peer.address.ip}`
		// );
		request.peer.wire.cancel(
			request.piece.index,
			request.piece.piece.chunkOffset(request.reservation),
			request.piece.piece.chunkLength(request.reservation)
		);
		request.piece.piece.cancel(request.reservation);
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
		this.file.put(index, buffer, (err) => {
			if (err) {
				this.debug(`Error writing data piece ${index}`, err);
			}
		});
		this.debug(`Piece ${index} validated`);
		this.emit(`piece${index}`);
		this.emit('piece', index);
		this.discovery.peers.forEach((peer) => {
			peer.wire.have(index);
		});
	};
}
