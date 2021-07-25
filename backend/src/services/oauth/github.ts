import { AxiosAgent } from '../axiosAgent';

export interface IUserGithub {
	email: string;
	name: string; // First name and last name are joined
	login: string;
	avatar_url: string;
}

const agent = new AxiosAgent(process.env.GITHUB_URL_API, 10000);

const makeParams = (code: string) => {
	const params = new URLSearchParams();
	params.append('client_id', process.env.GITHUB_API_ID!);
	params.append('client_secret', process.env.GITHUB_API_SECRET!);
	params.append('code', code);
	params.append('state', process.env.GITHUB_STATE_SECRET!);
	return params;
};

const serviceGithub = {
	getUser: async (code: string): Promise<IUserGithub> => {
		const tempAgent = new AxiosAgent(process.env.GITHUB_URL_OAUTH);
		const headers = { Accept: 'application/json' };
		const data = await tempAgent.postParams(
			'access_token',
			{},
			makeParams(code),
			headers
		);
		const accessToken = data.access_token;
		return agent.getHeaders('user', {
			Authorization: `token ${accessToken}`,
		});
	},
};

export default serviceGithub;
