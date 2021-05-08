import { bayToThumbnail, ytsToThumbnail } from 'application/library';
import asyncHandler from 'express-async-handler';
import { IMovieThumbnailEnvelope } from 'models/movie';
import bayService from 'services/bay';
import ytsService from 'services/yts';
import createError from 'http-errors';

export const topMovies = asyncHandler(async (_req, res) => {
	const ytsPromise = ytsService.top();
	const bayPromise = bayService.top();
	const [ytsMovies, bayMovies] = await Promise.all([
		ytsPromise,
		bayPromise,
	]);
	let thumbnailList = ytsToThumbnail(ytsMovies.data.movies);
	thumbnailList = await bayToThumbnail(thumbnailList, bayMovies);
	const envelope: IMovieThumbnailEnvelope = {
		count: thumbnailList.length,
		movies: thumbnailList.sort((a, b) => {
			if (a.title > b.title) return 1;
			if (a.title < b.title) return -1;
			return 0;
		}),
	};
	res.json(envelope);
});

export const searchMovies = asyncHandler(async (req, res) => {
	let query: string;
	if (req.query.query && typeof req.query.query === "string") {
		query = req.query.query;
	} else {
		throw createError(400, 'query was not supplied');
	}
	const ytsPromise = ytsService.search(query);
	const bayPromise = bayService.search(query);
	const [ytsMovies, bayMovies] = await Promise.all([
		ytsPromise,
		bayPromise,
	]);
	let thumbnailList = ytsToThumbnail(ytsMovies.data.movies);
	thumbnailList = await bayToThumbnail(thumbnailList, bayMovies);
	const envelope: IMovieThumbnailEnvelope = {
		count: thumbnailList.length,
		movies: thumbnailList.sort((a, b) => {
			if (a.title > b.title) return 1;
			if (a.title < b.title) return -1;
			return 0;
		}),
	};
	res.json(envelope);
});
