import {
	IRefreshToken,
	addRefreshTokenToRes,
	createRefreshToken,
	createAccessToken,
} from 'application/tokens';
import UserModel from 'models/user';
import { Unauthorized } from 'http-errors';
import asyncHandler from 'express-async-handler';
import { verify } from 'jsonwebtoken';

export const accessTokenController = asyncHandler(async (req, res) => {
	const token = req.cookies.jid;
	if (!token) throw new Unauthorized('No token.');

	// Throws error if there is a problem
	const payload = verify(
		token,
		process.env.REFRESH_TOKEN_SECRET!
	) as IRefreshToken;

	const user = await UserModel.findOne({ _id: payload.userId });
	if (!user) throw new Unauthorized('User not found.');
	if (user.tokenVersion !== payload.tokenVersion)
		throw new Unauthorized('Token version not valid.');

	// Set refreshToken cookie and return accessToken
	addRefreshTokenToRes(res, createRefreshToken(user));
	res.json({ status: 'OK', accessToken: createAccessToken(user) });
});
