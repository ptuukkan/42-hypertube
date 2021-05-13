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

export const filterList = (list: IMovieThumbnail[], params: IQueryParams) => {
	if (params.genre) {
		list = list.filter((t) => t.genres.includes(params.genre!));
	}
	return list;
};

export const paginate = (list: IMovieThumbnail[], params: IQueryParams) => {
	list = lodash(list)
		.orderBy([params.sort, 'title'], [params.order, 'asc'])
		.drop((params.page - 1) * params.limit)
		.take(params.limit)
		.value();
	return list;
};

export const searchMovies = asyncHandler(async (req, res) => {
	const params = parseParams(req);
	let thumbnailList = await search(params.query);

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
	const imdbCode = req.params.imdbCode;
	const movie = await details(imdbCode);
	res.json(movie);
});
