import { buildMovie, details } from 'application/movie';
import { omdbRocketman, ytsRocketman, ytsRocketmanDetails } from './testData';

describe('Movie', () => {
	it('Gets Movie details of valid imdb code', async () => {
		expect.hasAssertions();
		try {
			const movie = await details('tt2066051');
			expect(movie.title).toBe('Rocketman');
			expect(movie.runtime).toBe(121);
			expect(movie.writer).toBe('Lee Hall');
			expect(movie.actors).toBeDefined();
		} catch (_error) {
			fail('Movie get failed');
		}
	});

	it('Bad request for invalid imdb code', async () => {
		expect.hasAssertions();
		try {
			await details('tt2066a051');
			fail('Movie get successful when it should not');
		} catch (error) {
			expect(error.statusCode).toBe(400);
		}
	});

	it('Not found for non existent imdb code', async () => {
		expect.hasAssertions();
		try {
			await details('tt20661231051');
			fail('Movie get successful when it should not');
		} catch (error) {
			expect(error.statusCode).toBe(404);
		}
	});
});

describe('Build Movie', () => {
	it('Builds with yts and omdb', () => {
		try {
			const movie = buildMovie(
				ytsRocketman,
				ytsRocketmanDetails,
				omdbRocketman
			);
			expect(movie.title).toBe('Rocketman');
			expect(movie.runtime).toBe(121);
			expect(movie.writer).toBe('Lee Hall');
			expect(movie.actors).toBeDefined();
		} catch (_error) {
			fail('Movie build failed');
		}
	});

	it('Builds without omdb', () => {
		try {
			const movie = buildMovie(ytsRocketman, ytsRocketmanDetails, undefined);
			expect(movie.title).toBe('Rocketman');
			expect(movie.runtime).toBe(121);
			expect(movie.actors).toBeDefined();
		} catch (_error) {
			fail('Movie build failed');
		}
	});

	it('Builds without ytsDetails', () => {
		try {
			const movie = buildMovie(ytsRocketman, undefined, omdbRocketman);
			expect(movie.title).toBe('Rocketman');
			expect(movie.runtime).toBe(121);
			expect(movie.actors).toBeDefined();
			expect(movie.writer).toBe('Lee Hall');
		} catch (_error) {
			fail('Movie build failed');
		}
	});

	it('Builds without ytsMovie', () => {
		try {
			const movie = buildMovie(undefined, ytsRocketmanDetails, omdbRocketman);
			expect(movie.title).toBe('Rocketman');
			expect(movie.runtime).toBe(121);
			expect(movie.actors).toBeDefined();
			expect(movie.writer).toBe('Lee Hall');
		} catch (_error) {
			fail('Movie build failed');
		}
	});

	it('Builds without yts', () => {
		try {
			const movie = buildMovie(undefined, undefined, omdbRocketman);
			expect(movie.title).toBe('Rocketman');
			expect(movie.runtime).toBe(121);
			expect(movie.actors).toBeDefined();
			expect(movie.writer).toBe('Lee Hall');
		} catch (_error) {
			fail('Movie build failed');
		}
	});

	it('Builds without ytsDetails or omdb', () => {
		try {
			const movie = buildMovie(ytsRocketman, undefined, undefined);
			expect(movie.title).toBe('Rocketman');
			expect(movie.runtime).toBe(0);
			expect(movie.actors).toBeUndefined();
			expect(movie.writer).toBeUndefined();
		} catch (_error) {
			fail('Movie build failed');
		}
	});

	it('Does not build without ytsMovie or omdb', () => {
		try {
			buildMovie(undefined, ytsRocketmanDetails, undefined);
			fail('Movie build successful when it should not be');
		} catch (_error) {
			expect(true).toBe(true);
		}
	});
});
