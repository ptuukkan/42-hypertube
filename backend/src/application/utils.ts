import { IMovieThumbnail } from 'models/movie';
import { IOmdbMovieDetails } from 'services/omdb';
import { IYtsMovie } from 'services/yts';

export const ytsMovieToMovieThumbnail = (
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
		} as IMovieThumbnail;
	}
	throw new Error('ytsMovie data not complete');
};

export const omdbDetailsToMovieThumbnail = (
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
		} as IMovieThumbnail;
	}
	throw new Error('omdbDetails data not complete');
};

export interface IRange {
	start: number;
	end: number;
}

export const readRangeHeader = (range: string, fileSize: number): IRange => {
	const parts = range.split(/bytes=([0-9]*)-([0-9]*)/);
	const start = parseInt(parts[1]);
	const end = parseInt(parts[2]);

	const videoRange: IRange = {
		start: isNaN(start) ? 0 : start,
		end: isNaN(end) ? fileSize - 1 : end,
	};

	if (videoRange.end > fileSize - 1) {
		videoRange.end = fileSize - 1;
	}
	if (videoRange.start > videoRange.end) {
		throw new Error();
	}
	if (isNaN(start) && !isNaN(end)) {
		videoRange.start = fileSize - end;
		videoRange.end = fileSize - 1;
	}

	return videoRange;
};
