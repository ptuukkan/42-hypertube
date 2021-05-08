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
	imdb_code: string;
	title_english: string;
	year: number;
	rating: number;
	genres: string[];
	medium_cover_image: string;
}

const agent = new AxiosAgent(process.env.YTS_API);

const makeParams = (key: string, value: string) => {
	const params = new URLSearchParams();
	params.append(key, value);
	return params;
};

const ytsService = {
	list: (params: URLSearchParams): Promise<IYtsMovieEnvelope> =>
		agent.getParams('', params),
	top: (): Promise<IYtsMovieEnvelope> =>
		agent.getParams('', makeParams('sort_by', 'download_count')),
	search: (search: string): Promise<IYtsMovieEnvelope> =>
		agent.getParams('', makeParams('query_term', search)),
};

export default ytsService;
