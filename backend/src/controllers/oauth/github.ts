import { sign } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { saveUrlImgToProfileImages } from './../../utils/index';
import UserModel, { IUser } from './../../models/user';
import { Request, Response } from 'express';
import { getRandomString } from 'utils';
import serviceGithub from 'services/oauth/github';

export const oAuthGithubController = asyncHandler(
	async (req, res): Promise<void> => {
		const code = req.oAuthPayload!.code;

		const userData = await serviceGithub.getUser(code);
		let currentUser = await UserModel.findOne({ email: userData.email });

		if (!currentUser) {
			const username = getRandomString(10);
			let names: string[] = [];
			if (userData.name) {
				names = userData.name.split(' ');
			}
			const firstName = !names.length ? null : names[0];
			const lastName = !names.length ? null : names[names.length - 1];
			const user: IUser = {
				email: userData.email,
				firstName: firstName || 'FirstName',
				lastName: lastName || 'LastName',
				password: getRandomString(),
				isConfirmed: true,
				username,
			};
			currentUser = await UserModel.create(user);
			// Add pic for user now, else if validation fails pic still gets created
			let picName: string | undefined = `${username}-profile.jpg`;
			try {
				await saveUrlImgToProfileImages(userData.avatar_url, picName);
			} catch (err) {
				picName = undefined;
			}
			if (picName) currentUser.updateOne({ profilePicName: picName });
		} else if (!currentUser.isConfirmed) {
			await currentUser.updateOne({ isConfirmed: true });
		}

		const jwtUser = {
			username: currentUser.username,
			id: currentUser.id,
		};

		const token = process.env.SECRET && sign(jwtUser, process.env.SECRET);
		res.json({ accessToken: token });
	}
);

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
