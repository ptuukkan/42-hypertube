import { AxiosAgent } from './axiosAgent';

export interface IYtsMovieEnvelope {
	status: string;
	status_message: string;
	data: IYtsMovieData;
}

interface IYtsMovieData {
	movie_count: number;
	limit: number;
	page_number: number;
	movies: IYtsMovie[];
}

export interface IYtsMovie {
	id: number;
	url: string;
	imdb_code: string;
	title: string;
	year: number;
	rating: number;
	genres: string[];
}

const agent = new AxiosAgent(process.env.YTS_API);

const Movies = {
	list: (params: URLSearchParams): Promise<IYtsMovieEnvelope> =>
		agent.getParams('', params),
};

const ytsService = {
	Movies,
};

export default ytsService;
