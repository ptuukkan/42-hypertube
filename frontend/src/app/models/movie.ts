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
	actors: IActorObj[] | string | [];
	comments?: IComment[];
	watched: boolean;
}

export interface IActorObj {
	name: string;
	character_name: string;
	url_small_image: string;
	imdb_code: string;
}

export interface IComment {
	username: string;
	profilePicName: string;
	comment: string;
	date: Date;
}

export interface IMovieList {
	count: number;
	movies: IMovie[];
}
