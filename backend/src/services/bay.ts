import { AxiosAgent } from './axiosAgent';

export interface IBayMovie {
	id: string;
	name: string;
	info_hash: string;
	leechers: number;
	seeders: number;
	imdb: string;
}

const agent = new AxiosAgent(process.env.BAY_API);

const Movies = {
	list: (params: URLSearchParams): Promise<IBayMovie[]> =>
		agent.getParams('q.php', params),
	top: (): Promise<IBayMovie[]> =>
		agent.get('precompiled/data_top100_207.json'),
};

const bayService = {
	Movies,
};

export default bayService;
