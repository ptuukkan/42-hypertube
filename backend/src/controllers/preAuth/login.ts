import asyncHandler from 'express-async-handler';
import createError from 'http-errors';
import Usermodel, { IUserDocument } from 'models/user';

export const loginController = asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	const user: IUserDocument | null = await Usermodel.findOne({ username });

	if (!user) throw createError(401, 'User not found.');

	if (!user.isConfirmed) throw createError(401, 'User not confirmed.');

	if (!(await user.isPasswordValid(password)))
		throw createError(401, 'Wrong password.');

	// TODO return accessToken
	res.json({ status: 'OK', accessToken: '' });
});
