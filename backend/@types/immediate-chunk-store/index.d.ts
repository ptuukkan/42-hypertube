declare module 'immediate-chunk-store' {
	export = ImmediateStore;

	declare class ImmediateStore {
		constructor(store: ImmediateStore.AbstractChunkStoreCompliant);
		get(
			index: number,
			opts?: ImmediateStore.Options,
			cb?: (err?: Error, chunk?: Buffer) => void
		): void;
		put(index: number, buf: Buffer, cb: (err?: Error) => void): void;
	}

	declare namespace ImmediateStore {
		export interface AbstractChunkStoreCompliant {
			put(index: number, buf: Buffer, cb: (err?: Error) => void): void;
			get(index: number, cb: (err?: Error, chunk?: Buffer) => void): void;
		}
		export interface Options {
			offset?: number;
			length?: number;
		}
	}
}
