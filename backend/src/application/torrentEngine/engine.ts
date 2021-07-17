import { TorrentDiscovery } from 'application/torrentEngine/discovery';
import { EventEmitter } from 'stream';
import ParseTorrentFile from 'parse-torrent-file';
import { IMetadata, TorrentInstance } from 'application/torrentEngine/instance';
import Debug from 'debug';
import Path from 'path';

interface IOptions {
	path: string;
	supportedTypes: string[];
}

export class TorrentEngine extends EventEmitter {
	options: IOptions;
	instances = new Map<string, TorrentInstance>();
	intervals = new Map<string, NodeJS.Timeout>();
	debug = Debug('engine');

	constructor(options: IOptions) {
		super();
		this.options = options;
	}

	add = (infoHash: string, imdbCode: string): Promise<TorrentInstance> =>
		new Promise<TorrentInstance>((resolve, reject) => {
			if (this.instances.get(infoHash)) {
				reject('Duplicate torrent');
			}
			const discovery = new TorrentDiscovery(infoHash);
			const discoveryTimeout = setTimeout(() => {
				discovery.destroy();
				reject('No metadata');
				return;
			}, 30000);
			if (discoveryTimeout.unref) discoveryTimeout.unref();

			discovery.once('metadata', (metadata: ParseTorrentFile.Instance) => {
				this.debug('Received metadata');
				clearTimeout(discoveryTimeout);
				const torrentMetadata = this.validateMetadata(metadata);
				if (!torrentMetadata) {
					discovery.destroy();
					reject('Metadata validation failed');
					return;
				}
				const instance = new TorrentInstance(
					discovery,
					torrentMetadata,
					Path.resolve(this.options.path, imdbCode)
				);
				this.instances.set(infoHash, instance);
				instance.on('ready', () => {
					this.debug('ready');
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
