import lodash from 'lodash';
import { IMovieDocument } from 'models/movie';
import ytsService from 'services/yts';
import bayService from 'services/bay';
import Debug from 'debug';
import { torrentEngine } from 'app';
import MovieModel from 'models/movie';
import { downloadSubtitles } from './subtitles';
import { IUserDocument } from 'models/user';
import { BadRequest } from 'http-errors';
const debug = Debug('torrent');

interface ITorrent {
	hash: string;
	seeds: number;
	quality: string;
	type: string;
}

const findYtsTorrent = async (imdbCode: string): Promise<ITorrent[]> => {
	const ytsSearch = await ytsService.search(imdbCode);
	if (ytsSearch.status !== 'ok' || ytsSearch.data.movie_count !== 1) {
		throw new Error();
	}
	const ytsMovieDetails = await ytsService.details(ytsSearch.data.movies[0].id);
	const torrents = ytsMovieDetails.data.movie.torrents.filter(
		(t) => t.seeds !== 0
	);
	return torrents.map((t) => ({
		hash: t.hash,
		seeds: t.seeds,
		quality: t.quality,
		type: t.type,
	}));
};

const findBayTorrent = async (imdbCode: string): Promise<ITorrent[]> => {
	const bayMovieList = await bayService.search(imdbCode);
	const torrents = bayMovieList.filter((t) => t.seeders !== '0');

	return torrents.map((t) => {
		const torrent: ITorrent = {
			hash: t.info_hash,
			seeds: parseInt(t.seeders),
			quality: 'unknown',
			type: 'unknown',
		};
		if (/720p/.test(t.name)) {
			torrent.quality = '720p';
		}
		if (/1080p/.test(t.name)) {
			torrent.quality = '1080p';
		}
		if (/brrip/i.test(t.name)) {
			torrent.type = 'bluray';
		}
		if (/webrip/i.test(t.name)) {
			torrent.quality = 'web';
		}

		return torrent;
	});
};

const findTorrent = async (imdbCode: string): Promise<ITorrent> => {
	try {
		let torrents: ITorrent[] = [];

		const [ytsPromiseResult, bayPromiseResult] = await Promise.allSettled([
			findYtsTorrent(imdbCode),
			findBayTorrent(imdbCode),
		]);
		if (ytsPromiseResult.status === 'fulfilled' && ytsPromiseResult.value) {
			torrents = ytsPromiseResult.value;
		}
		if (bayPromiseResult.status === 'fulfilled' && bayPromiseResult.value) {
			torrents = [...torrents, ...bayPromiseResult.value];
		}
		if (!torrents.length) throw new BadRequest('no torrents with seeders');
		torrents = lodash.orderBy(torrents, ['seeds'], ['desc']);
		const mostSeeds = torrents[0];
		const br1 = torrents.find(
			(t) => t.quality === '720p' && t.type === 'bluray'
		);
		const br2 = torrents.find(
			(t) => t.quality === '1080p' && t.type === 'bluray'
		);
		if (br1 && (mostSeeds.seeds - br1.seeds) / br1.seeds < 0.65) return br1;
		if (br2 && (mostSeeds.seeds - br2.seeds) / br2.seeds < 0.65) return br2;
		return mostSeeds;
	} catch (error) {
		debug(error);
		throw error;
	}
};

export const startMovieDownload = async (
	movieDocument: IMovieDocument,
	user: IUserDocument
): Promise<string[]> => {
	const torrent = await findTorrent(movieDocument.imdbCode);
	return new Promise(async (resolve, reject) => {
		try {
			const instance = await torrentEngine.add(
				torrent.hash,
				movieDocument.imdbCode
			);
			instance.on('piece', (index: number) => {
				debug(`Downloaded piece ${index} for ${movieDocument.imdbCode}`);
			});
			instance.on('idle', () => {
				debug(`${movieDocument.imdbCode} idle`);
				torrentEngine.close(torrent.hash);
				MovieModel.findOne({
					imdbCode: movieDocument.imdbCode,
				})
					.then((m) => {
						if (m) {
							m.status = 2;
							m.save().catch((error) => debug(error));
						}
					})
					.catch((error) => debug(error));
			});
			instance.on('moviehash', async (hash: string) => {
				debug(`Received moviehash for ${movieDocument.imdbCode}`, hash);
				movieDocument.movieHash = hash;
				try {
					await movieDocument.save();
					const subtitles = await downloadSubtitles(movieDocument, user);
					const interval = setInterval(() => {
						debug('Checking if first pieces are downloaded ');
						for (
							let i = instance.file.startPiece;
							i < instance.file.startPiece + 9;
							i++
						) {
							if (!instance.bitfield.get(i)) return;
						}
						clearInterval(interval);
						debug('resolving');
						resolve(subtitles);
					}, 5000);
				} catch (error) {
					reject(error);
				}
			});
			movieDocument.torrentHash = torrent.hash;
			movieDocument.fileName = instance.metadata.file.name;
			movieDocument.status = 1;
			await movieDocument.save();

			instance.startDownload();
		} catch (error) {
			reject(error);
		}
	});
};
