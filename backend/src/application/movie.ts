import { movieCache } from 'config';
import { BadRequest, NotFound } from 'http-errors';
import { IMovie, IMovieThumbnail } from 'models/movie';
import omdbService, { IOmdbMovieDetails } from 'services/omdb';
import ytsService, { IYtsMovie, IYtsMovieDetails } from 'services/yts';
import { omdbDetailsToMovieThumbnail, ytsMovieToMovieThumbnail } from './utils';
import ViewingModel, { IViewingDocument } from 'models/viewing';
import { IUserDocument } from 'models/user';

export const buildMovie = (
	ytsMovie: IYtsMovie | undefined,
	ytsDetails: IYtsMovieDetails | undefined,
	omdbDetails: IOmdbMovieDetails | undefined,
	viewings: IViewingDocument[]
): IMovie => {
	let ytsThumbnail: IMovieThumbnail | undefined;
	let omdbThumbnail: IMovieThumbnail | undefined;
	let movieThumbnail: IMovieThumbnail;

	if (!ytsMovie && !omdbDetails)
		throw new Error('no movie data to build movie from');

	// Try to get movie thumbnails from both services.
	try {
		ytsThumbnail = ytsMovieToMovieThumbnail(viewings, ytsMovie);
		// eslint-disable-next-line no-empty
	} catch (_error) {}
	try {
		omdbThumbnail = omdbDetailsToMovieThumbnail(viewings, omdbDetails);
		// eslint-disable-next-line no-empty
	} catch (_error) {}

	if (ytsThumbnail) {
		movieThumbnail = ytsThumbnail;
	} else if (omdbThumbnail) {
		movieThumbnail = omdbThumbnail;
	} else throw new Error('Unable to build movie thumbnail');

	const movie: IMovie = {
		...movieThumbnail,
		summary: '',
		runtime: 0,
		comments: [],
	};

	// Then assign rest of the properties.
	// We want omdb plot over yts, and yts actors over omdb.
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

export const details = async (
	imdbCode: string,
	user: IUserDocument
): Promise<IMovie> => {
	if (!imdbCode.match(/^tt\d+$/)) {
		throw new BadRequest('imdb code not valid');
	}

	const cachedMovie = movieCache.get(imdbCode);
	if (cachedMovie) return cachedMovie;

	const viewings = await ViewingModel.find({ user: user._id }).populate(
		'movie',
		'imdbCode'
	);

	let ytsMovie: IYtsMovie | undefined;
	let ytsDetails: IYtsMovieDetails | undefined;
	let omdbDetails: IOmdbMovieDetails | undefined;

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
		const movie = buildMovie(ytsMovie, ytsDetails, omdbDetails, viewings);
		movieCache.set(imdbCode, movie);
		return movie;
	} catch (error) {
		throw new NotFound(`Movie not found: ${error.message}`);
	}
};
