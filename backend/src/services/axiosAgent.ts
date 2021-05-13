import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Debug from 'debug';

const debug = Debug('app');

export class AxiosAgent {
	axiosInstance: AxiosInstance;

	constructor(baseUrl?: string) {
		this.axiosInstance = axios.create({
			baseURL: baseUrl,
			timeout: 2000,
		});
		this.axiosInstance.interceptors.request.use((config) => {
			debug(
				`${config.method} ${config.baseURL} ${config.url} ${config.params}`
			);
			return config;
		});
	}

	responseBody = (response: AxiosResponse) => response.data;

	get = (url: string) => this.axiosInstance.get(url).then(this.responseBody);
	getParams = (url: string, params: URLSearchParams) =>
		this.axiosInstance.get(url, { params }).then(this.responseBody);
}
