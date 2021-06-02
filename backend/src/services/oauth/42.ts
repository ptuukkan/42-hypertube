import { AxiosAgent } from '../axiosAgent';

export interface IUser42 {
	email: string;
	first_name: string;
	last_name: string;
	login: string;
	image_url: string;
}

const agent = new AxiosAgent(process.env.URL_42_API);

const makeParams = (code: string) => {
	const params = new URLSearchParams();
	params.append('grant_type', 'authorization_code');
	params.append('client_id', process.env.ID_42_API!);
	params.append('client_secret', process.env.SECRET_42_API!);
	params.append('code', code);
	params.append('redirect_uri', process.env.REDIRECT_URL_42!);
	params.append('state', process.env.STATE_SECRET_42!);
	return params;
};

const service42 = {
	getUser: async (code: string): Promise<IUser42> => {
		const data = await agent.postParams('oauth/token', {}, makeParams(code));
		const accessToken = data.access_token;
		return agent.getHeaders('v2/me', {
			Authorization: `Bearer ${accessToken}`,
		});
	},
};

export default service42;
