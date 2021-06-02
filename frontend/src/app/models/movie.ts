export interface IMovie {
	title: string;
	year: number;
	coverImage: string;
	genres: string[];
	rating: number;
	imdb: string;
	summary: string;
	runtime: number;
	writer: string;
	director: string;
	actors: [
		{
			name: string;
			character_name: string;
			url_small_image: string;
			imdb_code: string;
		}
	];
}

export interface IMovieList {
	count: number;
	movies: IMovie[];
}
