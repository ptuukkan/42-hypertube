import lodash from 'lodash';
import { IMovieDocument } from 'models/movie';
import ytsService from 'services/yts';
import Debug from 'debug';
import { torrentEngine } from 'app';
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
			movieDocument.torrentHash = torrent.hash;
			movieDocument.fileName = instance.metadata.file.name;
			movieDocument.status = 1;
			await movieDocument.save();
			resolve();
		} catch (error) {
			reject(error);
		}
	});
};
