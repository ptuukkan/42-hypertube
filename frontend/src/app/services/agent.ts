import axios, { AxiosResponse } from 'axios';
// import { BackendError } from '../models/errors';
import { IMovie } from '../models/movie';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
	get: (url: string) => axios.get(url).then(responseBody),
	delete: (url: string) => axios.delete(url).then(responseBody),
	post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
	put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
};

const Browse = {
	top: (): Promise<{ count: number; movies: IMovie[] }> =>
		requests.get('movies/top'),
};

const agent = {
	Browse,
};

export default agent;
