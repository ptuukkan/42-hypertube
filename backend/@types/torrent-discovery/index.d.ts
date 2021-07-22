declare module "torrent-discovery" {
	import EventEmitter from 'events';

	export = Discovery;

	declare class Discovery extends EventEmitter {
		constructor(opts: Discovery.Options);
		on(event: 'peer', listener: (peer: string, source: string) => void): this;
		destroy(): void;
	}

	declare namespace Discovery {
		export interface Options {
			infoHash: string;
			peerId: string;
			port: number;
			dht: boolean;
			tracker: boolean;
			lsd: boolean;
		}
	}
}
