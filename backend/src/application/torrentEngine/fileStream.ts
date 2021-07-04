import { TorrentFile } from 'application/torrentEngine/file';
import { Readable } from 'stream';

export class FileStream extends Readable {
	startPiece: number;
	startOffset: number;
	endPiece: number;
	endLength: number;
	length: number;
	currentPiece: number;
	file: TorrentFile;

	constructor(file: TorrentFile, start: number, end: number) {
		super();

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
		const piecesToQueue = Math.min(4, this.endPiece - this.currentPiece + 1);
		this.file.instance.prioritize(this.currentPiece, piecesToQueue);
		const opts = { offset: 0, length: this.file.options.chunkLength };
		if (this.currentPiece === this.startPiece && this.startOffset) {
			opts.offset = this.startOffset;
		}
		if (this.currentPiece === this.endPiece && this.endLength) {
			opts.length = this.endLength;
		}
		const readPiece = () => {
			this.file.store.get(this.currentPiece, opts, (err, buffer) => {
				if (err) {
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
