import lodash from 'lodash';
import { IMovieDocument } from 'models/movie';
import ytsService from 'services/yts';
import Debug from 'debug';
import { torrentEngine } from 'app';
import MovieModel from 'models/movie';
import { downloadSubtitles } from './subtitles';
import { IUserDocument } from 'models/user';
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
			instance.startDownload();
			movieDocument.torrentHash = torrent.hash;
			movieDocument.fileName = instance.metadata.file.name;
			movieDocument.status = 1;
			await movieDocument.save();
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
				console.log('moviehash event');
				debug(hash);
				movieDocument.movieHash = hash;
				try {
					await movieDocument.save();
					const subtitles = await downloadSubtitles(movieDocument, user);
					debug(subtitles);
					const interval = setInterval(() => {
						debug('Checking if pieces 0-4 are downloaded ');
						for (let i = 0; i < 4; i++) {
							if (!instance.bitfield.get(i)) return;
						}
						clearInterval(interval);
						debug('resolving');
						resolve(subtitles);
					}, 5000);
				} catch (error) {
					reject();
				}
			});
		} catch (error) {
			reject(error);
		}
	});
};
