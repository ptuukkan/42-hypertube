import { IMovieThumbnail } from 'models/movie';
import { IViewingDocument } from 'models/viewing';
import { IOmdbMovieDetails } from 'services/omdb';
import { IYtsMovie } from 'services/yts';

export const ytsMovieToMovieThumbnail = (
	viewings: IViewingDocument[],
	ytsMovie?: IYtsMovie
): IMovieThumbnail => {
	if (
		ytsMovie &&
		ytsMovie.title_english.length > 0 &&
		ytsMovie.imdb_code.length > 0 &&
		ytsMovie.rating > 0
	) {
		return {
			title: ytsMovie.title_english,
			year: ytsMovie.year,
			coverImage: ytsMovie.medium_cover_image,
			genres: ytsMovie.genres,
			rating: ytsMovie.rating,
			imdb: ytsMovie.imdb_code,
			watched: !!viewings.find(
				(v) => 'imdbCode' in v.movie && v.movie.imdbCode === ytsMovie.imdb_code
			),
		} as IMovieThumbnail;
	}
	throw new Error('ytsMovie data not complete');
};

export const omdbDetailsToMovieThumbnail = (
	viewings: IViewingDocument[],
	omdbDetails?: IOmdbMovieDetails
): IMovieThumbnail => {
	if (
		omdbDetails &&
		omdbDetails.Title.length > 0 &&
		parseFloat(omdbDetails.imdbRating) > 0
	) {
		return {
			title: omdbDetails.Title,
			year: parseInt(omdbDetails.Year),
			coverImage: omdbDetails.Poster,
			genres: omdbDetails.Genre.split(',').map((g) => g.trim()),
			rating: parseFloat(omdbDetails.imdbRating),
			imdb: omdbDetails.imdbID,
			watched: !!viewings.find(
				(v) => 'imdbCode' in v.movie && v.movie.imdbCode === omdbDetails.imdbID
			),
		} as IMovieThumbnail;
	}
	throw new Error('omdbDetails data not complete');
};
