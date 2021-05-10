import axios, { AxiosInstance, AxiosResponse } from 'axios';
const debug = require('debug')('axios');

export class AxiosAgent {
	axiosInstance: AxiosInstance;

	constructor(baseUrl?: string) {
		this.axiosInstance = axios.create({
			baseURL: baseUrl,
		});
		this.axiosInstance.interceptors.request.use((config) => {
			debug(`${config.method} ${config.baseURL} ${config.url} ${config.params}`);
			return config;
		});
	}

	responseBody = (response: AxiosResponse) => response.data;

	get = (url: string) => this.axiosInstance.get(url).then(this.responseBody);
	getParams = (url: string, params: URLSearchParams) =>
		this.axiosInstance.get(url, { params: params }).then(this.responseBody);
}
