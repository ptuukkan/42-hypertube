import { IUserGithub } from './../../services/oauth/github';
import { saveUrlImgToProfileImages } from './../../utils/index';
import UserModel, { IUser, IUserDocument } from './../../models/user';
import { Request, Response } from 'express';
import { getRandomString } from 'utils';
import serviceGithub from 'services/oauth/github';

export const oAuthGithubController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const APP_URL = process.env.REACT_APP_BASE_URL;
	const code = req.oAuthPayload!.code;

	let userData: IUserGithub;
	try {
		userData = await serviceGithub.getUser(code);
	} catch (e) {
		const errorStr = 'There+was+a+problem+with+authenticating.';
		return res.redirect(301, `${APP_URL}?oauth-error=${errorStr}`);
	}

	let currentUser: IUserDocument | null;
	try {
		currentUser = await UserModel.findOne({ email: userData.email });
	} catch (err) {
		return res.redirect(301, `${APP_URL}?oauth-error=DATABASE_ERROR`);
	}

	if (!currentUser) {
		const username = getRandomString(10);
		let picName: string | undefined = `${username}-${getRandomString()}.jpg`;
		try {
			await saveUrlImgToProfileImages(userData.avatar_url, picName);
		} catch (err) {
			picName = undefined;
		}
		const splitName = userData.name.split(' ');
		const lastName = splitName[splitName.length - 1];
		splitName.length -= 1;
		const firstName = splitName.join(' ');
		const user: IUser = {
			email: userData.email,
			firstName,
			lastName,
			password: getRandomString(),
			isConfirmed: true,
			profilePicName: picName,
			username,
		};
		currentUser = await UserModel.create(user);
		console.log(currentUser);
	} else if (!currentUser.isConfirmed) {
		await currentUser.updateOne({ isConfirmed: true });
	}

	res.redirect(301, `${APP_URL}movies`);
};

export const oAuthGithubLinkController = (
	_req: Request,
	res: Response
): void => {
	const API_ID = process.env.GITHUB_API_ID;
	const STATE = encodeURIComponent(process.env.GITHUB_STATE_SECRET!);
	const URL = process.env.GITHUB_URL_OAUTH;
	const link = `${URL}authorize?client_id=${API_ID}&scope=read:user%20user:email&state=${STATE}`;

	res.json({ status: 'OK', link });
};
