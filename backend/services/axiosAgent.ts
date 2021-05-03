import axios, { AxiosResponse } from 'axios';

export class AxiosAgent {
	constructor(baseUrl?: string) {
		axios.defaults.baseURL = baseUrl;
	}
	responseBody = (response: AxiosResponse) => response.data;

	getParams = (params: URLSearchParams) =>
		axios.get('', { params: params }).then(this.responseBody);
}
