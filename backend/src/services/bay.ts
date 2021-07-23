import { AxiosAgent } from './axiosAgent';

export interface IBayMovie {
	id: number;
	name: string;
	info_hash: string;
	size: number;
	seeders: string;
	imdb: string | null;
}

const agent = new AxiosAgent(process.env.BAY_API);

const makeParams = (key: string, value: string) => {
	const params = new URLSearchParams();
	params.append('cat', '207');
	params.append(key, value);
	return params;
};

const bayService = {
	list: (params: URLSearchParams): Promise<IBayMovie[]> =>
		agent.getParams('q.php', params),
	top: (): Promise<IBayMovie[]> =>
		agent.get('precompiled/data_top100_207.json'),
	search: (query: string): Promise<IBayMovie[]> =>
		agent.getParams('q.php', makeParams('q', query)),
};

export default bayService;
