import { unlink } from 'fs';
import path from 'path';
import { IUpdateUser } from './../models/user';
import UserModel from 'models/user';
import asyncHandler from 'express-async-handler';
import { BadRequest } from 'http-errors';

export const getProfileController = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const user = await UserModel.findOne(
		{ _id: id },
		'firstName lastName profilePicName username'
	);
	if (!user) throw new BadRequest('User not found');

	return res.json({ status: 'OK', user });
});

export const getCurrentProfileController = asyncHandler(async (req, res) => {
	const user = await UserModel.findOne(
		{ _id: req.authPayload?.userId },
		'email firstName lastName profilePicName username'
	);
	if (!user) throw new BadRequest('User not found');

	return res.json({ status: 'OK', user });
});

const removeFile = (fileName: string) => {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	unlink(path.resolve('public/profileImages', fileName), () => {});
};

export const updateProfileController = asyncHandler(async (req, res) => {
	const { userId } = req.authPayload!;
	const user = await UserModel.findOne(
		{ _id: userId },
		'email firstName lastName profilePicName username'
	);
	if (!user) throw new BadRequest('User not found');

	const newData: IUpdateUser = req.body;
	if (!Object.keys(newData).length && !req.file)
		throw new BadRequest('No data nor image!');

	if (newData.removeProfilePic) newData.profilePicName = 'blank-profile.png';
	if (req.file) newData.profilePicName = req.file.filename;
	const oldPicName = user.profilePicName!;

	try {
		const newUser: IUpdateUser = await user.checkAndUpdateUser(newData);
		if (
			oldPicName !== 'blank-profile.png' &&
			(req.file || newData.removeProfilePic)
		) {
			removeFile(oldPicName);
		}
		newUser.password = undefined;
		return res.json({ status: 'OK', user: newUser });
	} catch (e) {
		if (req.file) removeFile(req.file.filename);
		throw e;
	}
});
