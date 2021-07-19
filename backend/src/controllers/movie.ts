import { search } from 'application/library';
import asyncHandler from 'express-async-handler';
import {
	dummyThumbnail,
	IMovieThumbnail,
	IMovieThumbnailEnvelope,
} from 'models/movie';
import lodash, { isString, toLower } from 'lodash';
import { details } from 'application/movie';
import { Request } from 'express';
import MovieModel from 'models/movie';
import { startMovieDownload } from 'application/torrent';
import Path from 'path';
import Fs from 'fs';
import { BadRequest, Unauthorized } from 'http-errors';
import { movieStream } from 'application/stream';
import { torrentEngine } from 'app';
import { downloadSubtitles } from 'application/subtitles';
import UserModel from 'models/user';
import ViewingModel from 'models/viewing';

export interface IQueryParams {
	query: string;
	page: number;
	limit: number;
	sort: string;
	order: boolean | 'asc' | 'desc';
	genre?: string;
}

const parseParams = (req: Request) => {
	const params: IQueryParams = {
		query: 'a', // Hard code 'a' => top movies.
		page: 1,
		limit: 20,
		sort: 'title',
		order: 'asc',
		genre: undefined,
	};

	if (isString(req.query.query) && req.query.query.length > 1) {
		params.query = req.query.query;
	}
	if (isString(req.query.page) && parseInt(req.query.page) > 0) {
		params.page = parseInt(req.query.page);
	}
	if (isString(req.query.limit) && parseInt(req.query.limit) > 0) {
		params.limit = parseInt(req.query.limit);
	}
	if (isString(req.query.sort) && req.query.sort in dummyThumbnail) {
		params.sort = req.query.sort;
	}
	if (
		isString(req.query.order) &&
		(req.query.order === 'asc' || req.query.order === 'desc')
	) {
		params.order = req.query.order;
	}
	if (isString(req.query.genre)) {
		params.genre = req.query.genre;
	}
	return params;
};

export const filterList = (
	list: IMovieThumbnail[],
	params: IQueryParams
): IMovieThumbnail[] => {
	if (params.genre) {
		list = list.filter((t) => t.genres.includes(params.genre!));
	}
	return list;
};

export const paginate = (
	list: IMovieThumbnail[],
	params: IQueryParams
): IMovieThumbnail[] => {
	list = lodash(list)
		.orderBy([params.sort, 'title'], [params.order, 'asc'])
		.drop((params.page - 1) * params.limit)
		.take(params.limit)
		.value();
	return list;
};

export const searchMovies = asyncHandler(async (req, res) => {
	const user = await UserModel.findById(req.authPayload?.userId);
	if (!user) throw new Unauthorized('not logged in');
	const params = parseParams(req);
	let thumbnailList = await search(params.query, user);

	// Get list of genres included in the result before filtering.
	const genres = lodash(thumbnailList)
		.flatMap((t) => t.genres)
		.sortBy()
		.sortedUniqBy(toLower)
		.value();

	thumbnailList = filterList(thumbnailList, params);
	// Get movie count before paginating.
	const count = thumbnailList.length;
	thumbnailList = paginate(thumbnailList, params);

	const envelope: IMovieThumbnailEnvelope = {
		count,
		genres,
		movies: thumbnailList,
	};
	res.json(envelope);
});

export const getMovie = asyncHandler(async (req, res) => {
	const user = await UserModel.findById(req.authPayload?.userId);
	if (!user) throw new Unauthorized('not logged in');
	const imdbCode = req.params.imdbCode;
	const movie = await details(imdbCode, user);
	res.json(movie);
});

export const prepareMovie = asyncHandler(async (req, res) => {
	const user = await UserModel.findById(req.authPayload?.userId);
	if (!user) throw new Unauthorized('not logged in');

	let movieDocument = await MovieModel.findOne({
		imdbCode: req.params.imdbCode,
	});
	if (!movieDocument) {
		movieDocument = new MovieModel({
			imdbCode: req.params.imdbCode,
			status: 0,
		});
	}

	let subtitles: string[] = [];

	if (movieDocument.status === 2) {
		const videoPath = Path.resolve(
			__dirname,
			`../../movies/${movieDocument.imdbCode}/${movieDocument.fileName}`
		);
		if (!Fs.existsSync(videoPath)) {
			movieDocument.status = 0;
		} else {
			subtitles = await downloadSubtitles(movieDocument, user);
		}
	}

	if (
		movieDocument.status === 1 &&
		!torrentEngine.instances.get(movieDocument.torrentHash)
	) {
		movieDocument.status = 0;
	}
	if (movieDocument.status === 0) {
		subtitles = await startMovieDownload(movieDocument, user);
	}
	res.json(subtitles);
});

export const streamMovie = asyncHandler(async (req, res) => {
	const movieDocument = await MovieModel.findOne({
		imdbCode: req.params.imdbCode,
	});
	if (!movieDocument) throw new BadRequest('Movie not found in database');
	movieStream(req, res, movieDocument);
});

export const setWatched = asyncHandler(async (req, res) => {
	const user = await UserModel.findById(req.authPayload?.userId);
	if (!user) throw new Unauthorized('not logged in');
	const movie = await MovieModel.findOne({
		imdbCode: req.params.imdbCode,
	});
	if (!movie) throw new BadRequest('not such movie');

	let viewing = await ViewingModel.findOne({
		user: user._id,
		movie: movie._id,
	});
	if (viewing) {
		viewing.timestamp = Date.now();
		await viewing.save();
	} else {
		viewing = new ViewingModel({
			user: user._id,
			movie: movie._id,
			timestamp: Date.now(),
		});
		await viewing.save();
	}

	res.send('OK');
});
