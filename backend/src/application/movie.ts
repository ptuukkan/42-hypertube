import { movieCache } from 'config';
import createError from 'http-errors';
import { IMovie, IMovieThumbnail } from 'models/movie';
import omdbService, { IOmdbMovieDetails } from 'services/omdb';
import ytsService, { IYtsMovie, IYtsMovieDetails } from 'services/yts';
import { omdbDetailsToMovieThumbnail, ytsMovieToMovieThumbnail } from './utils';

export const buildMovie = (
	ytsMovie: IYtsMovie | undefined,
	ytsDetails: IYtsMovieDetails | undefined,
	omdbDetails: IOmdbMovieDetails | undefined
) => {
	let movieThumbnail: IMovieThumbnail | undefined = undefined;
	if (!ytsMovie && !omdbDetails)
		throw new Error('no movie data to build movie from');

	// First convert to IMovieThumbnail as IMovie extends it.
	if (ytsMovie) {
		movieThumbnail = ytsMovieToMovieThumbnail(ytsMovie);
	} else {
		movieThumbnail = omdbDetailsToMovieThumbnail(omdbDetails!);
	}
	let movie: IMovie = {
		...movieThumbnail,
		summary: '',
		runtime: 0,
	};

	// Then assign rest of the properties. We want omdb plot over yts, and yts actors over omdb.
	if (omdbDetails) {
		movie.writer = omdbDetails.Writer;
		movie.director = omdbDetails.Director;
		movie.actors = omdbDetails.Actors;
		movie.summary = omdbDetails.Plot;
		movie.runtime = parseInt(omdbDetails.Runtime);
	}
	if (ytsDetails) {
		movie.actors = ytsDetails.cast;
		movie.runtime = ytsDetails.runtime;
		if (!omdbDetails) {
			movie.summary = ytsDetails.description_intro;
		}
	}
	return movie;
};

export const details = async (imdbCode: string) => {
	if (!imdbCode.match(/^tt\d+$/)) {
		throw new createError.BadRequest('imdb code not valid');
	}

	const movie = movieCache.get(imdbCode);
	if (movie) return movie;

	let ytsMovie: IYtsMovie | undefined = undefined;
	let ytsDetails: IYtsMovieDetails | undefined = undefined;
	let omdbDetails: IOmdbMovieDetails | undefined = undefined;

	// Get yts and omdb data in parallel.
	const ytsPromise = ytsService.search(imdbCode);
	const omdbPromise = omdbService.details(imdbCode);
	const [ytsPromiseResult, omdbPromiseResult] = await Promise.allSettled([
		ytsPromise,
		omdbPromise,
	]);
	if (
		ytsPromiseResult.status === 'fulfilled' &&
		ytsPromiseResult.value.status === 'ok' &&
		ytsPromiseResult.value.data.movie_count === 1
	) {
		ytsMovie = ytsPromiseResult.value.data.movies[0];
		const ytsDetailsEnvelope = await ytsService.details(ytsMovie.id);
		if (ytsDetailsEnvelope.status === 'ok') {
			ytsDetails = ytsDetailsEnvelope.data.movie;
		}
	}
	if (
		omdbPromiseResult.status === 'fulfilled' &&
		'Title' in omdbPromiseResult.value &&
		omdbPromiseResult.value.Type === 'movie'
	) {
		omdbDetails = omdbPromiseResult.value;
	}

	// Then try to construct a IMovie type from them.
	try {
		const movie = buildMovie(ytsMovie, ytsDetails, omdbDetails);
		movieCache.set(imdbCode, movie);
		return movie;
	} catch (error) {
		throw new createError.NotFound('Movie not found: ' + error.message);
	}
};
