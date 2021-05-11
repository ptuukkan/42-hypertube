import { search } from 'application/library';
import asyncHandler from 'express-async-handler';
import { IMovieThumbnailEnvelope } from 'models/movie';
import { parseParams, processParams } from 'controllers/utils';
import lodash, { toLower } from 'lodash';

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

	thumbnailList = processParams(thumbnailList, params);

	const envelope: IMovieThumbnailEnvelope = {
		count: thumbnailList.length,
		genres: genres,
		movies: thumbnailList,
	};
	res.json(envelope);
});
