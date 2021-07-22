import Debug from 'debug';
import { IMovieThumbnail } from 'models/movie';
import bayService, { IBayMovie } from 'services/bay';
import omdbService from 'services/omdb';
import ytsService, { IYtsMovie } from 'services/yts';
import { thumbnailCache } from 'config';
import { omdbDetailsToMovieThumbnail, ytsMovieToMovieThumbnail } from './utils';

const debug = Debug('app');

export const ytsToThumbnail = (
	ytsMovieList: IYtsMovie[]
): IMovieThumbnail[] => {
	const thumbnailList = ytsMovieList.reduce((list: IMovieThumbnail[], yts) => {
		try {
			return [...list, ytsMovieToMovieThumbnail(yts)];
		} catch (_error) {
			return list;
		}
	}, []);

	return thumbnailList;
};

export const getMovieInfo = async (
	bayMovieList: IBayMovie[]
): Promise<IMovieThumbnail[]> => {
	// Make the promises and then resolve them in parallel.
	const promiseList = await Promise.allSettled(
		bayMovieList.map(async (movie) => {
			if (!movie.imdb) return Promise.reject('No imdb code');
			try {
				const ytsEnvelope = await ytsService.search(movie.imdb);
				if (ytsEnvelope.status !== 'ok' || ytsEnvelope.data.movie_count !== 1) {
					throw new Error('status not ok or movie count not 1');
				}
				return ytsToThumbnail(ytsEnvelope.data.movies)[0];
			} catch (error) {
				debug(error);
				const omdbDetails = await omdbService.details(movie.imdb);
				if ('Title' in omdbDetails && omdbDetails.Type === 'movie') {
					return omdbDetailsToMovieThumbnail(omdbDetails);
				}
				return Promise.reject('Movie data not found');
			}
		})
	);
	const thumbnailList: IMovieThumbnail[] = [];
	promiseList.forEach((promise) => {
		if (promise.status === 'fulfilled' && promise.value) {
			thumbnailList.push(promise.value);
		}
	});
	return thumbnailList;
};

export const bayToThumbnail = async (
	thumbnailList: IMovieThumbnail[],
	bayMovieList: IBayMovie[]
): Promise<IMovieThumbnail[]> => {
	// We probably have duplicate movies
	// First reduce to distinct movies and remove null imdb codes.
	const distinctBayMovies = bayMovieList.reduce(
		(distinct: IBayMovie[], current) => {
			if (current.imdb && !distinct.some((d) => d.imdb === current.imdb)) {
				return [...distinct, current];
			}
			return distinct;
		},
		[]
	);

	// Get movies which are not already in our thumbnail list.
	const moviesNotIncluded = distinctBayMovies.reduce(
		(movies: IBayMovie[], current) => {
			if (!thumbnailList.some((m) => m.imdb === current.imdb)) {
				return [...movies, current];
			}
			return movies;
		},
		[]
	);

	// Get movie info for bay movies to be added to thumbnail list.
	if (moviesNotIncluded.length > 0) {
		const bayThumbnails = await getMovieInfo(moviesNotIncluded);
		thumbnailList.push(...bayThumbnails);
	}
	return thumbnailList;
};

export const search = async (query: string): Promise<IMovieThumbnail[]> => {
	let ytsPromise;
	let bayPromise;
	let thumbnailList: IMovieThumbnail[] | undefined;

	// First check if we have the results in cache and return immediately if we do.
	thumbnailList = thumbnailCache.get(query);
	if (thumbnailList) return thumbnailList;

	// Re-initialize thumbnailList so it is not undefined.
	thumbnailList = [];
	// This 'a' is hard coded in case we don't have query string -> get Top movies
	if (query === 'a') {
		ytsPromise = ytsService.top();
		bayPromise = bayService.top();
	} else {
		ytsPromise = ytsService.search(query);
		bayPromise = bayService.search(query);
	}

	// Resolve promises parallel.
	const [ytsPromiseResult, bayPromiseResult] = await Promise.allSettled([
		ytsPromise,
		bayPromise,
	]);
	if (
		ytsPromiseResult.status === 'fulfilled' &&
		ytsPromiseResult.value.data.movie_count > 0
	) {
		thumbnailList = ytsToThumbnail(ytsPromiseResult.value.data.movies);
	}
	if (bayPromiseResult.status === 'fulfilled' && bayPromiseResult.value) {
		thumbnailList = await bayToThumbnail(thumbnailList, bayPromiseResult.value);
	}

	// Store result in cache only if we got results from either service.
	// This prevents unwanted behavior in case one or both are down momentarily.
	if (
		ytsPromiseResult.status === 'fulfilled' ||
		bayPromiseResult.status === 'fulfilled'
	) {
		thumbnailCache.set(query, thumbnailList);
	}
	return thumbnailList;
};
