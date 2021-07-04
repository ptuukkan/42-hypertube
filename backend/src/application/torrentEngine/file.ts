import FsChunkStore, { StorageFile } from 'fs-chunk-store';
import ImmediateChunkStore from 'immediate-chunk-store';
import { TorrentInstance } from 'application/torrentEngine/instance';
import Path from 'path';
import Debug from 'debug';
import { FileStream } from 'application/torrentEngine/fileStream';

interface IOptions {
	path: string;
	name: string;
	offset: number;
	length: number;
	chunkLength: number;
}

export class TorrentFile {
	store: ImmediateChunkStore;
	startPiece: number;
	endPiece: number;
	options: IOptions;
	lastChunkLength: number;
	instance: TorrentInstance;
	debug = Debug('file');

	constructor(instance: TorrentInstance, options: IOptions) {
		this.options = options;
		this.instance = instance;
		this.startPiece = Math.floor(options.offset / options.chunkLength);
		this.endPiece = Math.floor(
			(options.length + options.offset) / options.chunkLength
		);
		this.lastChunkLength =
			(options.length + options.offset) % options.chunkLength;

		const files: StorageFile[] = [
			{
				path: Path.resolve(options.path, options.name),
				offset: options.offset,
				length: options.length,
			},
		];

		if (options.offset) {
			files.unshift({
				path: Path.resolve(options.path, 'dummy'),
				offset: 0,
				length: options.offset,
			});
		}

		const storage = new FsChunkStore(options.chunkLength, {
			files,
		});
		this.store = new ImmediateChunkStore(storage);
	}

	put = (index: number, buffer: Buffer, cb: (err?: Error) => void): void => {
		if (index === this.endPiece && buffer.length > this.lastChunkLength) {
			this.store.put(index, buffer.slice(0, this.lastChunkLength - 1), cb);
		} else {
			this.store.put(index, buffer, cb);
		}
	};

	get = (index: number, cb?: (err?: Error, chunk?: Buffer) => void): void => {
		if (index === this.endPiece) {
			this.store.get(index, { offset: 0, length: this.lastChunkLength }, cb);
		} else {
			this.store.get(index, undefined, cb);
		}
	};

	stream = (start?: number, end?: number): FileStream => {
		const startByte = start ?? 0;
		const endByte = end ?? this.options.length - 1;
		return new FileStream(this, startByte, endByte);
	};
}
