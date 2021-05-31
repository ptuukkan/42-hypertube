import lodash from 'lodash';
import { IMovieDocument } from 'models/movie';
import ytsService from 'services/yts';
import torrentStream from 'torrent-stream';
import Path from 'path';
import MovieModel from 'models/movie';
import Debug from 'debug';
const debug = Debug('torrent');

interface ITorrent {
	title: string;
	hash: string;
	size: number;
	seeds: number
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
	debug(torrent);
	const title = encodeURI(torrent.title);
	const magnet = `magnet:?xt=urn:btih:${torrent.hash}&dn=${title}`;
	const path = Path.resolve(
		__dirname,
		`../../public/movies/${movieDocument.imdbCode}`
	);

	const engine = torrentStream(magnet, {
		uploads: 0,
		path,
		trackers: [
			'udp://open.demonii.com:1337/announce',
			'udp://tracker.openbittorrent.com:80',
			'udp://tracker.coppersurfer.tk:6969',
			'udp://glotorrents.pw:6969/announce',
			'udp://tracker.opentrackr.org:1337/announce',
			'udp://torrent.gresille.org:80/announce',
			'udp://p4p.arenabg.com:1337',
			'udp://tracker.leechers-paradise.org:6969',
		],
	});

	engine.on('torrent', () => {
		engine.files.forEach((file) => {
			debug(`Found file: ${file.name}`);
			if (file.name.endsWith('.mp4')) {
				file.select();
				debug(`selected file ${file.name}`);
				movieDocument.path = file.path;
				movieDocument.size = file.length;
				movieDocument.save().catch((error) => debug(error));
				debug(movieDocument);
			} else {
				file.deselect();
			}
		});
	});

	engine.on('download', (index) => {
		debug(`Downloaded index ${index}`);
	});

	engine.on('upload', () => {
		debug('uploaded something');
	});

	engine.on('idle', () => {
		debug(`${movieDocument.imdbCode} download complete`);
		MovieModel.findOneAndUpdate(
			{ imdbCode: movieDocument.imdbCode },
			{ status: 2 }
		).catch((error) => debug(error));
		engine.destroy(() => {
			debug('engine destroyed');
		});
	});
};

export const resumeDownloads = (): void => {
	MovieModel.find({ status: 1 }, (_err, movies) => {
		debug(movies);
		// movies.forEach((movie) => {
		// 	startMovieDownload(movie);
		// });
	});
};
