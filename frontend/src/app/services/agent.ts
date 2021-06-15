import { IGetUser } from 'app/models/user';
import { ILink } from 'app/models/oAuth';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { IMovie, IMovieList } from 'app/models/movie';
import {
	IForgetPassword,
	ILoginFormValues,
	IRegisterFormValues,
	IResetPassword,
	IAccessToken,
} from '../models/user';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (error.response && error.response.data.src === 'jwt')
			return Promise.reject({ logUserOut: true });
		return Promise.reject(error);
	}
);

const responseBody = (response: AxiosResponse) => response.data;
const authConf = (token: string) => ({
	headers: { Authorization: `Bearer ${token}` },
});

const requests = {
	get: (url: string) => axios.get(url).then(responseBody),
	post: (url: string, body: Record<string, any>) =>
		axios.post(url, body).then(responseBody),
	put: (url: string, body: Record<string, any>) =>
		axios.put(url, body).then(responseBody),
	getAuth: (url: string, token: string) =>
		axios.get(url, authConf(token)).then(responseBody),
	deleteAuth: (url: string, token: string) =>
		axios.delete(url, authConf(token)).then(responseBody),
	postAuth: (url: string, token: string, body: Record<string, any>) =>
		axios.post(url, body, authConf(token)).then(responseBody),
	putAuth: (url: string, token: string, body: Record<string, any>) =>
		axios.put(url, body, authConf(token)).then(responseBody),
};

const User = {
	register: (user: IRegisterFormValues): Promise<void> =>
		requests.post('/pre-auth/register', user),
	login: (user: ILoginFormValues): Promise<IAccessToken> =>
		requests.post('/pre-auth/login', user),
	forget: (data: IForgetPassword): Promise<void> =>
		requests.post(`/pre-auth/send-reset-password`, data),
	reset: (code: string, data: IResetPassword): Promise<IAccessToken> =>
		requests.put(`/pre-auth/reset-password/${code}`, data),
	getCurrentProfile: (token: string): Promise<IGetUser> =>
		requests.getAuth('/user', token),
	update: (token: string, user: FormData): Promise<IGetUser> =>
		requests.postAuth('/user', token, user),
	accessToken: (): Promise<IAccessToken> => requests.post('/accessToken', {}),
	logout: (token: string): Promise<void> =>
		requests.postAuth('/user/logout', token, {}),
};

const Movies = {
	search: (title: string, token: string): Promise<IMovieList> =>
		requests.getAuth(`movies/search?query=${title}`, token),
	get: (imdbCode: string, token: string): Promise<IMovie> =>
		requests.getAuth(`movies/${imdbCode}`, token),
};

const OAuth = {
	getGithubLink: (): Promise<ILink> => requests.get('/auth/github-link'),
	get42Link: (): Promise<ILink> => requests.get('/auth/42-link'),
	verifyOAuthUser: (
		path: string,
		code: string,
		state: string
	): Promise<IAccessToken> => requests.post(`/auth/${path}`, { code, state }),
};

const agent = {
	Movies,
	User,
	OAuth,
};

export default agent;
