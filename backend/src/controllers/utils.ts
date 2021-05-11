import { IQueryParams } from 'controllers/movie';
import { Request } from 'express';
import lodash from 'lodash';
import { dummyThumbnail, IMovieThumbnail } from 'models/movie';

export const isString = (text: any): text is string => {
	return typeof text === 'string' || text instanceof String;
};

// Is this the correct place for this?
export const parseParams = (req: Request) => {
	let params: IQueryParams = {
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
