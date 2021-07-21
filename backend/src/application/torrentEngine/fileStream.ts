import { TorrentFile } from 'application/torrentEngine/file';
import { Readable } from 'stream';
import Debug from 'debug';

interface IOpts {
	offset?: number;
	length?: number;
}

export class FileStream extends Readable {
	startPiece: number;
	startOffset: number;
	endPiece: number;
	endLength: number;
	currentPiece: number;
	file: TorrentFile;
	debug = Debug('filestream');

	constructor(file: TorrentFile, start: number, end: number) {
		super();

		// this.debug(`Filestream: new ${start}-${end}`);
		this.startPiece = Math.floor(
			(file.options.offset + start) / file.options.chunkLength
		);
		this.startOffset = (file.options.offset + start) % file.options.chunkLength;
		this.endPiece = Math.floor(
			(file.options.offset + end) / file.options.chunkLength
		);
		this.endLength =
			((file.options.offset + end) % file.options.chunkLength) + 1;
		this.currentPiece = this.startPiece;
		this.file = file;
		const piecesToQueue = Math.min(9, this.endPiece - this.currentPiece);
		this.file.instance.prioritize(this.currentPiece, piecesToQueue);
	}

	_read = (): void => {
		// this.debug('Filestream: read');
		const piecesToQueue = Math.min(9, this.endPiece - this.currentPiece);
		this.file.instance.prioritize(this.currentPiece, piecesToQueue);
		const opts: IOpts = {};
		if (this.currentPiece === this.startPiece && this.startOffset) {
			opts.offset = this.startOffset;
		}
		if (this.currentPiece === this.endPiece && this.endLength) {
			opts.length = this.endLength;
		}
		if (opts.offset && opts.length) {
			opts.length = opts.length - opts.offset;
		}
		const readPiece = () => {
			this.file.store.get(this.currentPiece, opts, (err, buffer) => {
				if (err) {
					this.debug(
						'Filestream: destroy',
						err,
						opts.offset,
						opts.length,
						this.file.options.chunkLength,
						this.file.options.lastChunkLength
					);
					this.destroy();
				}
				this.push(buffer);
				if (this.currentPiece === this.endPiece) {
					this.push(null);
				} else {
					this.currentPiece++;
				}
			});
		};
		if (this.file.instance.bitfield.get(this.currentPiece)) {
			readPiece();
		} else {
			this.file.instance.once(`piece${this.currentPiece}`, () => {
				readPiece();
			});
		}
	};
}
