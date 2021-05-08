import {
	bayToThumbnail,
	getMovieInfo,
	ytsToThumbnail,
} from 'application/library';
import { bayMovieList, dupBayMovieList, ytsMovieList } from './testData';

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
		const bayMovies = bayMovieList.map((m) => ({
			...m,
			imdb: imdb,
		}));
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
	})
});
