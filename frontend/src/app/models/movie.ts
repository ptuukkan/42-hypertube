export interface IMovie {
	title: string;
	year: number,
	coverImage: string,
	genres: string[],
	rating: number,
	imdb: string
}

export interface IMovieList {
	count: number,
	movies: IMovie[]
}