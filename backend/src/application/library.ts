import Debug from 'debug';
import { IMovieThumbnail } from 'models/movie';
import { IBayMovie } from 'services/bay';
import omdbService, { IOmdbMovieDetails } from 'services/omdb';
import ytsService, { IYtsMovie } from 'services/yts';

const debug = Debug('MyApp');

export const ytsToThumbnail = (ytsMovieList: IYtsMovie[]) => {
	// All the required data exists in Yts response so only map here.
	const thumbnailList = ytsMovieList.map(
		(yts) =>
			({
				title: yts.title_english,
				year: yts.year,
				coverImage: yts.medium_cover_image,
				genres: yts.genres,
				rating: yts.rating,
				imdb: yts.imdb_code,
			} as IMovieThumbnail)
	);

	return thumbnailList;
};

const omdbToThumbnail = (omdbDetails: IOmdbMovieDetails, imdb: string) => {
	const thumbnail: IMovieThumbnail = {
		title: omdbDetails.Title,
		year: parseInt(omdbDetails.Year),
		coverImage: omdbDetails.Poster,
		genres: omdbDetails.Genre.split(','),
		rating: parseFloat(omdbDetails.imdbRating),
		imdb,
	};
	return thumbnail;
};

export const getMovieInfo = async (bayMovieList: IBayMovie[]) => {
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
					return omdbToThumbnail(omdbDetails, movie.imdb);
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
) => {
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
