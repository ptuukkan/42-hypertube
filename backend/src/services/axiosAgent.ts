import axios, { AxiosResponse } from 'axios';

export class AxiosAgent {
	constructor(baseUrl?: string) {
		axios.defaults.baseURL = baseUrl;
	}
	responseBody = (response: AxiosResponse) => response.data;

	get = (url: string) => axios.get(url).then(this.responseBody);
	getParams = (url: string, params: URLSearchParams) =>
		axios.get(url, { params: params }).then(this.responseBody);
}
