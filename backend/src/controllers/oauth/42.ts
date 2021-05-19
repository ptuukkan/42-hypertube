import { saveUrlImgToProfileImages } from './../../utils/index';
import { IUser42 } from '../../services/oauth/42';
import UserModel, { IUser, IUserDocument } from './../../models/user';
import { Request, Response } from 'express';
import service42 from 'services/oauth/42';
import { getRandomString } from 'utils';

export const oAuth42Controller = async (
	req: Request,
	res: Response
): Promise<void> => {
	const APP_URL = process.env.REACT_APP_BASE_URL;
	const code = req.oAuthPayload!.code;

	let userData: IUser42;
	try {
		userData = await service42.getUser(code);
	} catch (err) {
		const errorStr = 'There+was+a+problem+with+authenticating';
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
		const ext = userData.image_url.split('users/')[1].split('.')[1];
		let picName: string | undefined = `${username}-${getRandomString()}.${ext}`;
		try {
			await saveUrlImgToProfileImages(userData.image_url, picName);
		} catch (err) {
			picName = undefined;
		}

		const user: IUser = {
			email: userData.email,
			firstName: userData.first_name,
			lastName: userData.last_name,
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

export const oAuth42LinkController = (_req: Request, res: Response): void => {
	const API_ID = process.env.ID_42_API;
	const RE_URL = encodeURIComponent(process.env.REDIRECT_URL_42!);
	const STATE = encodeURIComponent(process.env.STATE_SECRET_42!);
	const API_URL = process.env.URL_42_API;
	const link = `${API_URL}oauth/authorize?client_id=${API_ID}&redirect_uri=${RE_URL}&scope=public&state=${STATE}&response_type=code`;

	res.json({ status: 'OK', link });
};
