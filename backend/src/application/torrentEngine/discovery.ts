import hat from 'hat';
import { EventEmitter } from 'stream';
import Discovery from 'torrent-discovery';
import Debug from 'debug';
import { IPeerAddress, Peer } from 'application/torrentEngine/peer';
import ParseTorrentFile from 'parse-torrent-file';
import { TorrentInstance } from 'application/torrentEngine/instance';

export class TorrentDiscovery extends EventEmitter {
	discovery: Discovery;
	peerId = `-HT0001-${hat(48)}`;
	infoHash: string;
	debug = Debug('discovery');
	peerQueue: IPeerAddress[] = [];
	peers: Peer[] = [];
	metadataReceived = false;
	instance: TorrentInstance | null = null;

	constructor(infoHash: string) {
		super();

		this.infoHash = infoHash;
		this.discovery = new Discovery({
			infoHash,
			peerId: this.peerId,
			port: 6881,
			dht: true,
			tracker: false,
			lsd: false,
		});

		this.discovery.on('peer', (peer: string) => {
			const parts = peer.split(':');
			const regxp = new RegExp(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
			if (parts.length === 2) {
				const port = parseInt(parts[1]);
				if (port >= 0 && port <= 65535 && regxp.test(parts[0])) {
					this.peerQueue.push({ ip: parts[0], port });
					this.addPeer();
					return;
				}
			}
			this.debug(`Invalid peer ${peer}`);
		});
	}

	addPeer = (): void => {
		const address = this.peerQueue.shift();
		if (!address) return;
		const peer = new Peer(address, this);
		peer.once('ready', () => this.onReady(peer));
		peer.once('metadata', (metadata: ParseTorrentFile.Instance) =>
			this.onMetadata(metadata)
		);
		peer.wire.on('unchoke', () => this.onUnchoke());
		peer.once('destroy', () => this.onDestroy(peer));
		peer.wire.on('bitfield', () => this.onBitField(peer));
		peer.wire.on('have', () => this.onHave(peer));
		peer.connect();
	};

	onReady = (peer: Peer): void => {
		this.debug(`New peer ${peer.address.ip}`);
		this.peers.push(peer);
		if (this.instance) {
			peer.wire.bitfield(this.instance.bitfield);
		}
	};

	onMetadata = (metadata: ParseTorrentFile.Instance): void => {
		this.metadataReceived = true;
		this.emit('metadata', metadata);
	};

	onUnchoke = (): void => {
		if (this.instance) {
			this.instance.queueRequests();
		}
	};

	onDestroy = (peer: Peer): void => {
		this.peers = this.peers.filter((p) => p.address.ip !== peer.address.ip);
	};

	onBitField = (peer: Peer): void => {
		if (this.instance) {
			this.instance.updateInterest(peer);
		}
	};

	onHave = (peer: Peer): void => {
		if (this.instance) {
			this.instance.updateInterest(peer);
		}
	};

	destroy = (): void => {
		this.peers.forEach((peer) => peer.destroy());
		this.discovery.destroy();
	};
}
