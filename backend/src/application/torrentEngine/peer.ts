import Wire from 'bittorrent-protocol';
import { EventEmitter } from 'stream';
import net from 'net';
import Debug from 'debug';
import ut_metadata from 'ut_metadata';
import { TorrentDiscovery } from 'application/torrentEngine/discovery';
import ParseTorrent from 'parse-torrent';

export interface IPeerAddress {
	ip: string;
	port: number;
}

// const CHOKE_TIMEOUT = 20000;
const HANDSHAKE_TIMEOUT = 30000;

export class Peer extends EventEmitter {
	address: IPeerAddress;
	discovery: TorrentDiscovery;
	wire: Wire.Wire;
	handshakeSent = false;
	debug = Debug('peer');
	conn: net.Socket | null = null;
	chokeTimeout: NodeJS.Timeout | undefined;
	handshakeTimeout: NodeJS.Timeout | undefined;

	constructor(address: IPeerAddress, discovery: TorrentDiscovery) {
		super();
		this.address = address;
		this.discovery = discovery;
		this.wire = new Wire();
		this.wire.use(ut_metadata());
		this.wire.setKeepAlive(true);
		this.wire.setTimeout(30000, true);
		this.registerListeners();
	}

	registerListeners = (): void => {
		this.wire.on('handshake', () => {
			if (this.handshakeTimeout) clearTimeout(this.handshakeTimeout);
			this.handshake();
			this.emit('ready');
			if (!this.discovery.metadataReceived) {
				this.wire.ut_metadata.fetch();
			}
		});

		this.wire.on('timeout', () => {
			this.debug(`Timeout from ${this.address.ip}`);
		});

		this.wire.on('choke', () => {
			this.debug(`${this.address.ip} choked us`);
			// this.chokeTimeout = setTimeout(() => {
			// 	this.debug(`Choke timeout ${this.address.ip}`);
			// 	this.destroy();
			// }, CHOKE_TIMEOUT);
			// if (this.chokeTimeout.unref) this.chokeTimeout.unref();
		});

		this.wire.ut_metadata.on('metadata', (metadata: Buffer) => {
			if (this.discovery.metadataReceived) return;

			const parsedMetadata = ParseTorrent(metadata);
			if (
				'pieces' in parsedMetadata &&
				parsedMetadata.pieces &&
				parsedMetadata.pieceLength &&
				parsedMetadata.lastPieceLength &&
				parsedMetadata.files
			) {
				this.emit('metadata', parsedMetadata);
			}
		});
	};

	connect = (): void => {
		const conn = net.connect({
			host: this.address.ip,
			port: this.address.port,
		});
		conn.on('timeout', () => {
			this.debug(`TCP to ${this.address.ip} timeout`);
		});
		conn.on('error', (err) => {
			this.debug(`TCP to ${this.address.ip} error`, err);
		});
		conn.on('connect', () => {
			this.conn = conn;
			this.conn.pipe(this.wire).pipe(this.conn);
			this.handshake();
			this.handshakeTimeout = setTimeout(this.destroy, HANDSHAKE_TIMEOUT);
		});
	};

	handshake = (): void => {
		if (!this.handshakeSent) {
			this.handshakeSent = true;
			this.wire.handshake(
				this.discovery.infoHash,
				Buffer.from(this.discovery.peerId),
				{
					dht: true,
				}
			);
		}
	};

	destroy = (): void => {
		this.emit('destroy');
		this.debug(`Peer ${this.address.ip} destroyed`);
		this.wire.destroy();
		if (this.conn) this.conn.destroy();
	};
}
