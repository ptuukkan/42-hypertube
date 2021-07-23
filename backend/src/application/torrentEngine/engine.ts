import { TorrentDiscovery } from 'application/torrentEngine/discovery';
import { EventEmitter } from 'stream';
import ParseTorrentFile from 'parse-torrent-file';
import { IMetadata, TorrentInstance } from 'application/torrentEngine/instance';
import Debug from 'debug';
import Path from 'path';
import { BadRequest } from 'http-errors';

interface IOptions {
	path: string;
	supportedTypes: string[];
}

export class TorrentEngine extends EventEmitter {
	options: IOptions;
	instances = new Map<string, TorrentInstance>();
	intervals = new Map<string, NodeJS.Timeout>();
	enabled = false;
	debug = Debug('engine');

	constructor(options: IOptions) {
		super();
		this.options = options;
	}

	add = (infoHash: string, imdbCode: string): Promise<TorrentInstance> =>
		new Promise<TorrentInstance>((resolve, reject) => {
			if (!this.enabled) {
				return reject(new BadRequest('Engine disabled'));
			}
			if (this.instances.size > 4) {
				return reject(new BadRequest('Too many instances'));
			}
			if (this.instances.get(infoHash)) {
				return reject(new BadRequest('Duplicate torrent'));
			}
			const discovery = new TorrentDiscovery(infoHash);
			const discoveryTimeout = setTimeout(() => {
				discovery.destroy();
				return reject(new BadRequest('No metadata'));
			}, 30000);
			if (discoveryTimeout.unref) discoveryTimeout.unref();

			discovery.once('metadata', (metadata: ParseTorrentFile.Instance) => {
				this.debug('Received metadata');
				clearTimeout(discoveryTimeout);
				const torrentMetadata = this.validateMetadata(metadata);
				if (!torrentMetadata) {
					discovery.destroy();
					return reject(new BadRequest('Metadata validation failed'));
				}
				const instance = new TorrentInstance(
					discovery,
					torrentMetadata,
					this,
					Path.resolve(this.options.path, imdbCode)
				);
				this.instances.set(infoHash, instance);
				instance.on('ready', () => {
					this.debug(`Instance ${imdbCode} ready`);
					resolve(instance);
					const interval = setInterval(() => instance.refresh(), 30000);
					this.intervals.set(infoHash, interval);
				});
			});
		});

	validateMetadata = (
		metadata: ParseTorrentFile.Instance
	): IMetadata | undefined => {
		let data: IMetadata | undefined;

		this.options.supportedTypes.forEach((type) => {
			metadata.files!.forEach((file) => {
				this.debug(file.name);
				if (file.name.endsWith(type) && !data) {
					data = {
						length: metadata.length!,
						pieces: metadata.pieces!,
						pieceLength: metadata.pieceLength!,
						lastPieceLength: metadata.lastPieceLength!,
						file: {
							name: file.name,
							offset: file.offset,
							length: file.length,
						},
					};
				}
			});
		});

		return data;
	};

	clear = (): boolean => {
		const array = Array.from(this.instances.values());
		return !array.some((i) => {
			return i.priorityPieceQueue.length;
		});
	};

	speed = (): number => {
		let speed = 0;
		this.instances.forEach((instance) => {
			instance.discovery.peers.forEach((peer) => {
				speed = speed + peer.wire.downloadSpeed();
			});
		});
		return speed;
	};

	close = (infoHash: string): void => {
		const instance = this.instances.get(infoHash);
		if (!instance) return;
		instance.discovery.destroy();
		instance.removeAllListeners();
		this.instances.delete(infoHash);
		const interval = this.intervals.get(infoHash);
		if (!interval) return;
		clearInterval(interval);
		this.intervals.delete(infoHash);
	};
}
