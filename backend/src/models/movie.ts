export interface IMovieThumbnailEnvelope {
	count: number;
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
