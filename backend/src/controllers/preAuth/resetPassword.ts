import LinkModel, { ILink, LinkType } from 'models/link';
import UserModel from 'models/user';
import createError from 'http-errors';
import Usermodel from 'models/user';
import asyncHandler from 'express-async-handler';
import { getRandomString } from 'utils';
import { sendResetPasswordEmail } from 'utils/email';
import { Request, Response } from 'express';

export const sendResetPasswordController = asyncHandler(async (req, res) => {
	const { email } = req.body;
	const RESET = LinkType.RESET;

	const user = await Usermodel.findOne({ email });
	if (!user) throw createError(400, 'Invalid email.');

	const link = await LinkModel.findOne({ user: user._id, linkType: RESET });
	if (link)
		throw createError(400, 'Reset password link has already been requested.');

	const code = getRandomString();
	const title = 'Reset your password for Hypertube';
	await sendResetPasswordEmail(email, title, user._id, code);
	const linkObj: ILink = { user: user._id, linkType: RESET, code };
	await LinkModel.create(linkObj);

	res.status(200).json({ status: 'OK' });
});

export const validResetCodeController = (req: Request, res: Response) => {
	const code = req.params.code;

	res.redirect(302, `http://localhost:3000/reset-password/${code}`);
};

export const resetPasswordController = asyncHandler(async (req, res) => {
	const { userId, code } = req.codePayload!;
	const password = req.body.password;

	if (!password) throw createError(400, 'Value for `password` is required.');

	const user = await UserModel.findOne({ _id: userId });
	if (!user) throw createError(400, 'User not found.');

	if (await user.isPasswordValid(password))
		throw createError(400, 'Entered password is same as the old password.');

	// Throws error if password does not meet requirements
	await user.checkAndUpdatePassword(password);

	await LinkModel.deleteOne({ code, user: user._id, linkType: LinkType.RESET });

	// TODO return accessToken
	res.json({ status: 'OK', accessToken: '' });
});
