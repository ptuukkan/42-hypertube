import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Debug from 'debug';

const debug = Debug('app');

export class AxiosAgent {
	axiosInstance: AxiosInstance;

	constructor(baseUrl?: string) {
		this.axiosInstance = axios.create({
			baseURL: baseUrl,
			timeout: 5000,
		});
		this.axiosInstance.interceptors.request.use((config) => {
			debug(
				`${config.method} ${config.baseURL} ${config.url} ${config.params}`
			);
			return config;
		});
	}

	responseBody = (response: AxiosResponse): any => response.data;

	get = (url: string): any =>
		this.axiosInstance.get(url).then(this.responseBody);
	getParams = (url: string, params: URLSearchParams): any =>
		this.axiosInstance.get(url, { params }).then(this.responseBody);
	getHeaders = (url: string, headers: Record<string, string>): any =>
		this.axiosInstance.get(url, { headers }).then(this.responseBody);
	getStream = (url = ''): any =>
		this.axiosInstance.get(url, { responseType: 'stream' });
	postParams = (
		url: string,
		body: Record<string, any>,
		params?: URLSearchParams,
		headers: Record<string, any> = {}
	): any =>
		this.axiosInstance
			.post(url, body, { params, headers })
			.then(this.responseBody);
}
