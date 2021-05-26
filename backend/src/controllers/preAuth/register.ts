import { IUser } from './../../models/user';
import { LinkType, ILink } from './../../models/link';
import asyncHandler from 'express-async-handler';
import Usermodel, { IUserDocument } from 'models/user';
import { sendConfirmAccountEmail } from 'utils/email';
import { getRandomString } from 'utils';
import LinkModel from 'models/link';

export const registerController = asyncHandler(async (req, res) => {
	const { username, password, firstName, lastName, email } = req.body;

	const userObj: IUser = { username, password, firstName, lastName, email };
	const user: IUserDocument = await Usermodel.create(userObj);

	const code = getRandomString();
	const title = 'Confirm account for Hypertube';
	await sendConfirmAccountEmail(email, title, user.id, code);
	const linkObj: ILink = { user: user.id, linkType: LinkType.CONFIRM, code };
	await LinkModel.create(linkObj);

	res.status(200).json({ status: 'OK' });
});
