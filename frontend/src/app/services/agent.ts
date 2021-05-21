import axios, { AxiosResponse } from 'axios';
import { IMovieList } from '../models/movie';
import {
	IForgetPassword,
	ILoginFormValues,
	IRegisterFormValues,
	IResetPassword,
	IUser,
} from '../models/user';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
	get: (url: string) => axios.get(url).then(responseBody),
	delete: (url: string) => axios.delete(url).then(responseBody),
	post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
	put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
};

const User = {
	register: (user: IRegisterFormValues): Promise<void> =>
		requests.post('/preAuth/register', user),
	login: (user: ILoginFormValues): Promise<IUser> =>
		requests.post('/preAuth/login', user),
	verify: (link: string): Promise<void> => requests.get(`/user/verify/${link}`),
	forget: (data: IForgetPassword): Promise<void> =>
		requests.post(`/preAuth/send-reset-password`, data),
	reset: (link: string, data: IResetPassword): Promise<void> =>
		requests.put(`/preAuth/reset-password/${link}`, data),
};

const Movies = {
	search: (title: string): Promise<IMovieList> =>
		requests.get(`movies/search?query=${title}`),
};

const agent = {
	Movies,
	User,
};

export default agent;
