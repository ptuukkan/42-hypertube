import { AxiosAgent } from './axiosAgent';

export interface IYtsMovieListEnvelope {
	status: string;
	status_message: string;
	data: IYtsMoviesData;
}

export interface IYtsMovieEnvelope {
	status: string;
	status_message: string;
	data: {
		movie: IYtsMovieDetails;
	};
}

interface IYtsMoviesData {
	movie_count: number;
	limit: number;
	page_number: number;
	movies: IYtsMovie[];
}

export interface IYtsMovie {
	id: string;
	imdb_code: string;
	title_english: string;
	year: number;
	rating: number;
	genres: string[];
	medium_cover_image: string;
}

export interface IYtsMovieDetails {
	runtime: number;
	description_intro: string;
	cast: IYtsCast[];
}

export interface IYtsCast {
	name: string;
	character_name: string;
	url_small_image: string;
	imdb_code: string;
}

const agent = new AxiosAgent(process.env.YTS_API);

const listParams = (key: string, value: string) => {
	const params = new URLSearchParams();
	params.append('limit', '50');
	params.append(key, value);
	return params;
};

const detailsParams = (key: string, value: string) => {
	const params = new URLSearchParams();
	params.append('with_cast', 'true');
	params.append(key, value);
	return params;
};

const ytsService = {
	top: (): Promise<IYtsMovieListEnvelope> =>
		agent.getParams(
			'list_movies.json',
			listParams('sort_by', 'download_count')
		),
	search: (search: string): Promise<IYtsMovieListEnvelope> =>
		agent.getParams('list_movies.json', listParams('query_term', search)),
	details: (id: string): Promise<IYtsMovieEnvelope> =>
		agent.getParams('movie_details.json', detailsParams('movie_id', id)),
};

export default ytsService;
