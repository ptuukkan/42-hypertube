export interface IMovieThumbnailEnvelope {
	count: number;
	genres: string[];
	movies: IMovieThumbnail[];
}

export interface IMovieThumbnail {
	title: string;
	year: number;
	coverImage: string;
	genres: string[];
	rating: number;
	imdb: string;
}

// Used for type checking.
export const dummyThumbnail: IMovieThumbnail = {
	title: 'Movie Title',
	year: 1999,
	coverImage: 'Cover Image',
	genres: ['genre1', 'genre2'],
	rating: 9,
	imdb: 'imdb code',
};
