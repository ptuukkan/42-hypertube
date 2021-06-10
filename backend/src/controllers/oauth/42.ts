import asyncHandler from 'express-async-handler';
import { saveUrlImgToProfileImages } from './../../utils/index';
import UserModel, { IUser } from './../../models/user';
import { Request, Response } from 'express';
import service42 from 'services/oauth/42';
import { getRandomString } from 'utils';
import {
	addRefreshTokenToRes,
	createAccessToken,
	createRefreshToken,
} from 'application/tokens';

export const oAuth42Controller = asyncHandler(
	async (req, res): Promise<void> => {
		const code = req.oAuthPayload!.code;

		const userData = await service42.getUser(code);
		let currentUser = await UserModel.findOne({ email: userData.email });

		if (!currentUser) {
			const username = getRandomString(10);
			const user: IUser = {
				email: userData.email,
				firstName: userData.first_name,
				lastName: userData.last_name,
				password: getRandomString(),
				isConfirmed: true,
				username,
			};
			currentUser = await UserModel.create(user);
			// Add pic for user now, else if validation fails pic still gets created
			const ext = userData.image_url.split('users/')[1].split('.')[1];
			let picName: string | undefined = `${username}-profile.${ext}`;
			try {
				await saveUrlImgToProfileImages(userData.image_url, picName);
			} catch (err) {
				picName = undefined;
			}
			if (picName) currentUser.updateOne({ profilePicName: picName }).exec();
		} else if (!currentUser.isConfirmed) {
			await currentUser.updateOne({ isConfirmed: true });
		}

		// Set refreshToken cookie and return accessToken
		addRefreshTokenToRes(res, createRefreshToken(currentUser));
		res.json({ status: 'OK', accessToken: createAccessToken(currentUser) });
	}
);

export const oAuth42LinkController = (_req: Request, res: Response): void => {
	const API_ID = process.env.ID_42_API;
	const RE_URL = encodeURIComponent(process.env.REDIRECT_URL_42!);
	const STATE = encodeURIComponent(process.env.STATE_SECRET_42!);
	const API_URL = process.env.URL_42_API;
	const link = `${API_URL}oauth/authorize?client_id=${API_ID}&redirect_uri=${RE_URL}&scope=public&state=${STATE}&response_type=code`;

	res.json({ status: 'OK', link });
};
