import { search } from 'application/library';
import asyncHandler from 'express-async-handler';
import { IMovieThumbnailEnvelope } from 'models/movie';
import { filterList, paginate, parseParams } from 'controllers/utils';
import lodash, { toLower } from 'lodash';
import { details } from 'application/movie';

export interface IQueryParams {
	query: string;
	page: number;
	limit: number;
	sort: string;
	order: boolean | 'asc' | 'desc';
	genre?: string;
}

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
	const count = thumbnailList.length;
	thumbnailList = paginate(thumbnailList, params);

	const envelope: IMovieThumbnailEnvelope = {
		count: count,
		genres: genres,
		movies: thumbnailList,
	};
	res.json(envelope);
});

export const getMovie = asyncHandler(async (req, res) => {
	const imdbCode = req.params.imdbCode;
	const movie = await details(imdbCode);
	res.json(movie);
});
