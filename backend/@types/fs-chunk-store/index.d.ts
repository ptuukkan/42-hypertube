declare module 'fs-chunk-store' {
	export = Storage;

	declare class Storage {
		constructor(chunkLength: number, opts: Storage.Options);
		put(index: number, buf: Buffer, cb: (err?: Error) => void): void;
		get(index: number, cb: (err?: Error, chunk?: Buffer) => void): void;
		close(cb: (err?: Error) => void): void;
		destroy(cb: (err?: Error) => void): void;
	}

	declare namespace Storage {
		export interface StorageFile {
			path: string;
			length: number;
			offset?: number;
		}
		export interface Options {
			files?: StorageFile[];
			path?: string;
			length?: number;
		}
	}
}
