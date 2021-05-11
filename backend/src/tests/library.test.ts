import {
	bayToThumbnail,
	getMovieInfo,
	ytsToThumbnail,
} from 'application/library';
import { IQueryParams } from 'controllers/movie';
import { processParams } from 'controllers/utils';
import {
	bayMovieList,
	dupBayMovieList,
	thumbnailList20,
	ytsMovieList,
} from './testData';

describe('Library', () => {
	it('converts Yts movies to thumbnails', () => {
		const thumbnailList = ytsToThumbnail(ytsMovieList);
		expect(thumbnailList).toHaveLength(3);
	});

	it('gets movie info for Bay movies', async () => {
		expect.hasAssertions();
		try {
			const thumbnailList = await getMovieInfo(bayMovieList);
			expect(thumbnailList).toHaveLength(3);
			expect(thumbnailList[0]).toHaveProperty('year');
		} catch (error) {
			fail('error');
		}
	});

	it('converts Bay movies to thumbnails', async () => {
		expect.hasAssertions();
		try {
			const thumbnailList = await bayToThumbnail([], bayMovieList);
			expect(thumbnailList).toHaveLength(3);
		} catch (error) {
			fail('error');
		}
	});

	it('Bay movies are added to Yts movies', async () => {
		expect.hasAssertions();
		try {
			let thumbnailList = ytsToThumbnail(ytsMovieList);
			thumbnailList = await bayToThumbnail(thumbnailList, bayMovieList);
			expect(thumbnailList).toHaveLength(6);
		} catch (error) {
			fail('error');
		}
	});

	it('Duplicate Bay movies are reduced', async () => {
		expect.hasAssertions();
		const imdb = bayMovieList[0].imdb;
		const bayMovies = bayMovieList.map((m) => ({ ...m, imdb }));
		try {
			let thumbnailList = await bayToThumbnail([], bayMovies);
			expect(thumbnailList).toHaveLength(1);
			thumbnailList = ytsToThumbnail(ytsMovieList);
			thumbnailList = await bayToThumbnail(thumbnailList, bayMovies);
			expect(thumbnailList).toHaveLength(4);
		} catch (error) {
			fail('error');
		}
	});

	it('Invalid imdb codes are removed', async () => {
		expect.hasAssertions();
		bayMovieList[0].imdb = 'blbalba';
		try {
			const thumbnailList = await getMovieInfo(bayMovieList);
			expect(thumbnailList).toHaveLength(2);
			expect(thumbnailList[0]).toHaveProperty('year');
		} catch (error) {
			fail('error');
		}
	});

	it('No movie info api calls for duplicate bay movies', async () => {
		expect.assertions(1);
		try {
			let thumbnailList = ytsToThumbnail(ytsMovieList);
			thumbnailList = await bayToThumbnail(thumbnailList, dupBayMovieList);
			expect(thumbnailList).toHaveLength(3);
		} catch (error) {
			fail('error');
		}
	});
});

const baseParams = (): IQueryParams => {
	return {
		query: 'a',
		page: 1,
		limit: 20,
		sort: 'title',
		order: 'asc',
		genre: undefined,
	};
};

describe('Search params', () => {
	it('category Action', () => {
		const params = baseParams();
		params.genre = 'Action';
		const list = processParams(thumbnailList20, params);
		const notAction = list.some((item) => !item.genres.includes('Action'));
		expect(notAction).toBe(false);
		expect(list).toHaveLength(20);
	});

	it('category Sci-Fi', () => {
		const params = baseParams();
		params.genre = 'Sci-Fi';
		const list = processParams(thumbnailList20, params);
		const notAction = list.some((item) => !item.genres.includes('Sci-Fi'));
		expect(notAction).toBe(false);
		expect(list).toHaveLength(15);
	});

	it('order ascending', () => {
		const params = baseParams();
		const list = processParams(thumbnailList20, params);
		expect(list[0].imdb).toBe('tt6139732');
		expect(list[7].imdb).toBe('tt2245084');
		expect(list[19].imdb).toBe('tt0816692');
	});

	it('order descending', () => {
		const params = baseParams();
		params.order = 'desc';
		const list = processParams(thumbnailList20, params);
		expect(list[0].imdb).toBe('tt0816692');
		expect(list[12].imdb).toBe('tt2245084');
		expect(list[19].imdb).toBe('tt6139732');
	});

	it('sort year', () => {
		const params = baseParams();
		params.sort = 'year';
		const list = processParams(thumbnailList20, params);
		expect(list[0].imdb).toBe('tt2245084');
		expect(list[19].imdb).toBe('tt2386490');
	});

	it('sort imdb', () => {
		const params = baseParams();
		params.sort = 'imdb';
		const list = processParams(thumbnailList20, params);
		expect(list[0].imdb).toBe('tt0437086');
		expect(list[19].imdb).toBe('tt6806448');
	});

	it('sort rating', () => {
		const params = baseParams();
		params.sort = 'rating';
		const list = processParams(thumbnailList20, params);
		expect(list[0].imdb).toBe('tt6806448');
		expect(list[19].imdb).toBe('tt0816692');
	});

	it('limit 0', () => {
		const params = baseParams();
		params.limit = 0;
		const list = processParams(thumbnailList20, params);
		expect(list).toHaveLength(0);
	});

	it('limit 5', () => {
		const params = baseParams();
		params.limit = 5;
		const list = processParams(thumbnailList20, params);
		expect(list).toHaveLength(5);
	});

	it('limit 30', () => {
		const params = baseParams();
		params.limit = 30;
		const list = processParams(thumbnailList20, params);
		expect(list).toHaveLength(20);
	});

	it('page 1, limit 5', () => {
		const params = baseParams();
		params.page = 1;
		params.limit = 5;
		const list = processParams(thumbnailList20, params);
		expect(list).toHaveLength(5);
		expect(list[0].imdb).toBe('tt6139732');
	});

	it('page 2, limit 5', () => {
		const params = baseParams();
		params.page = 2;
		params.limit = 5;
		const list = processParams(thumbnailList20, params);
		expect(list).toHaveLength(5);
		expect(list[0].imdb).toBe('tt4154756');
	});

	it('page 3, limit 7', () => {
		const params = baseParams();
		params.page = 3;
		params.limit = 7;
		const list = processParams(thumbnailList20, params);
		expect(list).toHaveLength(6);
		expect(list[0].imdb).toBe('tt6806448');
		expect(list[5].imdb).toBe('tt0816692');
	});

	it('Mix', () => {
		const params = baseParams();
		params.genre = 'Adventure';
		params.sort = 'rating';
		params.order = 'desc';
		params.limit = 2;
		params.page = 2;
		const list = processParams(thumbnailList20, params);
		expect(list).toHaveLength(2);
		expect(list[0].imdb).toBe('tt4154756');
	});
});
