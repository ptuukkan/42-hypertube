import { TorrentFile } from 'application/torrentEngine/file';
import { Readable } from 'stream';
import Debug from 'debug';

export class FileStream extends Readable {
	startPiece: number;
	startOffset: number;
	endPiece: number;
	endLength: number;
	length: number;
	currentPiece: number;
	file: TorrentFile;
	debug = Debug('filestream');

	constructor(file: TorrentFile, start: number, end: number) {
		super();

		this.debug(`Filestream: new ${start}-${end}`);
		this.startPiece = Math.floor(
			(file.options.offset + start) / file.options.chunkLength
		);
		this.startOffset = (file.options.offset + start) % file.options.chunkLength;
		this.endPiece = Math.floor(
			(file.options.offset + end) / file.options.chunkLength
		);
		this.endLength = (file.options.offset + end) % file.options.chunkLength;
		this.length = end - start + 1;
		this.currentPiece = this.startPiece;
		this.file = file;
	}

	_read = (): void => {
		this.debug('Filestream: read');
		const piecesToQueue = Math.min(4, this.endPiece - this.currentPiece + 1);
		this.file.instance.prioritize(this.currentPiece, piecesToQueue);
		const opts = { offset: 0, length: this.file.options.chunkLength };
		if (this.currentPiece === this.startPiece && this.startOffset) {
			opts.offset = this.startOffset;
			opts.length = opts.length - this.startOffset;
		}
		if (this.currentPiece === this.endPiece && this.endLength) {
			opts.length = this.endLength;
		}
		const readPiece = () => {
			this.debug(`Filestream: read piece ${this.currentPiece}`);
			this.file.store.get(this.currentPiece, opts, (err, buffer) => {
				if (err) {
					this.debug(
						`Filestream: destroy`,
						err,
						opts,
						this.startPiece,
						this.endPiece
					);
					this.destroy();
				}
				this.push(buffer);
				if (this.currentPiece === this.endPiece) {
					this.debug(`Filestream: push null`);
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
