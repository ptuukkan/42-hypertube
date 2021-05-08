import { AxiosAgent } from './axiosAgent';

export interface IOmdbMovieDetails {
	Title: string;
	Year: string;
	Poster: string;
	Genre: string;
	imdbRating: string;
	Type: string;
}

export interface IOmdbError {
	Response: string;
	Error: string;
}

const agent = new AxiosAgent(process.env.OMDB_API);

const apiKey = process.env.OMDB_API_KEY ?? '';

const buildParams = (imdb: string) => {
	const params = new URLSearchParams();
	params.append('apikey', apiKey);
	params.append('type', 'movie');
	params.append('i', imdb);
	return params;
};

const omdbService = {
	details: (imdb: string): Promise<IOmdbMovieDetails | IOmdbError> =>
		agent.getParams('', buildParams(imdb)),
};

export default omdbService;
