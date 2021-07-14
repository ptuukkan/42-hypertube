import lodash from 'lodash';
import { IMovieDocument } from 'models/movie';
import ytsService from 'services/yts';
import Debug from 'debug';
import { torrentEngine } from 'app';
import torrentStream from 'torrent-stream';
const debug = Debug('torrent');

interface ITorrent {
	title: string;
	hash: string;
	size: number;
	seeds: number;
}

const findTorrent = async (imdbCode: string): Promise<ITorrent> => {
	// prefer Yts torrents. Try to find one from there first.
	try {
		const ytsSearch = await ytsService.search(imdbCode);
		if (ytsSearch.status !== 'ok' || ytsSearch.data.movie_count !== 1) {
			throw new Error();
		}
		const ytsMovieDetails = await ytsService.details(
			ytsSearch.data.movies[0].id
		);
		const torrents = lodash(ytsMovieDetails.data.movie.torrents)
			.filter((t) => t.seeds !== 0)
			.orderBy(['seeds'], ['desc'])
			.value();
		if (torrents.length === 0) throw new Error();

		// Torrent priority: 720p bluray, 1080p bluray, most seeds.
		let selected = torrents.find(
			(t) => t.quality === '720p' && t.type === 'bluray'
		);
		if (!selected) {
			selected = torrents.find(
				(t) => t.quality === '1080p' && t.type === 'bluray'
			);
		}
		if (!selected) {
			selected = torrents[0];
		}
		return {
			title: ytsMovieDetails.data.movie.title_english,
			hash: selected.hash,
			size: selected.size_bytes,
			seeds: selected.seeds,
		};
	} catch (error) {
		debug(error);
		throw error;
	}
};

export const startMovieDownload = async (
	movieDocument: IMovieDocument
): Promise<void> => {
	const torrent = await findTorrent(movieDocument.imdbCode);
	return new Promise(async (resolve, reject) => {
		try {
			const instance = await torrentEngine.add(
				torrent.hash,
				movieDocument.imdbCode
			);
			instance.startDownload();
			movieDocument.torrentHash = torrent.hash;
			movieDocument.fileName = instance.metadata.file.name;
			movieDocument.status = 1;
			await movieDocument.save();
			const checkReady = () => {
				debug('Checking if pieces 0-4 are downloaded ');
				for (let i = 0; i < 4; i++) {
					if (!instance.bitfield.get(i)) return;
				}
				instance.removeListener('piece', checkReady);
				debug('resolving');
				resolve();
			};
			instance.on('piece', (index: number) => {
				debug(`Downloaded piece ${index} for ${movieDocument.imdbCode}`);
			});
			instance.on('idle', () => {
				debug(`${movieDocument.imdbCode} idle`);
			});
			instance.on('piece', checkReady);
			setInterval(() => {
				const peers = instance.discovery.peers.filter(
					(p) => !p.wire.peerChoking
				);
				debug(
					`Peers not choking: ${peers.length}/${instance.discovery.peers.length}`
				);
				// peers.forEach((peer) => {
				// 	debug(`${peer.address.ip}:${peer.address.port}`);
				// });
			}, 10000);
			checkReady();
			// resolve();
		} catch (error) {
			reject(error);
		}
	});
};

export const startTorrentEngine = async (
	movieDocument: IMovieDocument
): Promise<void> => {
	const torrent = await findTorrent(movieDocument.imdbCode);
	return new Promise(async (resolve, reject) => {
		const engine = torrentStream(torrent.hash, {
			uploads: 0,
			path: `public/movies/${movieDocument.imdbCode}`,
			dht: true,
			tracker: false,
		});
		engine.on('download', (index) => {
			debug(`Downloaded piece ${index} for ${movieDocument.imdbCode}`);
		});
		engine.on('idle', () => {
			debug(`${movieDocument.imdbCode} is idle`);
		});
		engine.on('upload', (index) => {
			debug(`Uploaded piece ${index} for ${movieDocument.imdbCode}`);
		});
		engine.on('torrent', () => {
			engine.files.forEach((file) => {
				if (file.name.endsWith('.mp4')) {
					movieDocument.torrentHash = torrent.hash;
					movieDocument.fileName = file.name;
					movieDocument.status = 1;
					movieDocument.save();
				}
			});
			torrentEngine.torrentStreams.set(torrent.hash, engine);
			setInterval(() => {
				const peers = engine.swarm.wires.filter((p: any) => !p.peerChoking);
				debug(
					`Peers not choking: ${peers.length}/${engine.swarm.wires.length}`
				);
				// peers.forEach((peer) => {
				// 	debug(peer.peerAddress);
				// });
			}, 10000);
			resolve();
		});
	});
};
