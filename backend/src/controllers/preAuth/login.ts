import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { Unauthorized } from 'http-errors';
import Usermodel, { IUserDocument } from 'models/user';

export const loginController = asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	if (!password) throw new Unauthorized('Value for `password` is required.');

	const user: IUserDocument | null = await Usermodel.findOne({ username });

	if (!user) throw new Unauthorized('User not found.');

	if (!user.isConfirmed) throw new Unauthorized('User not confirmed.');

	if (!(await user.isPasswordValid(password)))
		throw new Unauthorized('Wrong password.');

	const jwtUser = {
		username: user.username,
		id: user.id,
	};

	const token = process.env.SECRET && jwt.sign(jwtUser, process.env.SECRET);
	res.json({ accessToken: token });
});
