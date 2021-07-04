declare module 'torrent-piece' {
	export = Piece;
	import { Wire } from 'bittorrent-protocol';

	declare class Piece {
		constructor(length: number);
		length: number;
		missing: number;
		chunkLength(index: number): number;
		chunkLengthRemaining(index: number): number;
		chunkOffset(index: number): number;
		reserve(): number;
		reserveRemaining(): number;
		cancel(index: number): void;
		cancelRemaining(index: number): void;
		get(index: number): Buffer;
		set(index: number, data: Buffer, source: Wire): boolean;
		flush(): Buffer;
	}
}
