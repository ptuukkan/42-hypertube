import UserModel from 'models/user';
import asyncHandler from 'express-async-handler';
import { BadRequest } from 'http-errors';

export const getProfileController = asyncHandler(async (req, res) => {
	const user = await UserModel.findOne(
		{ _id: req.authPayload?.userId },
		'email firstName lastName profilePicName username'
	);
	if (!user) throw new BadRequest('User not found');

	return res.json({ status: 'OK', user });
});

export const updateProfileController = asyncHandler((req, res) => {
	return res.json({ status: 'OK', user: {} });
});
