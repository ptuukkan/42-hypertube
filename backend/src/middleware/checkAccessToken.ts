import asyncHandler from 'express-async-handler';
import { IAuthPayload } from '../../@types/express';
import { Unauthorized } from 'http-errors';
import { verify } from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/require-await
export const checkAccessToken = asyncHandler(async (req, _res, next) => {
	const { authorization } = req.headers;

	if (!authorization) throw new Unauthorized('Token is missing.');

	const token = authorization.split(' ')[1];
	// Throws error if there is a problem
	const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
	req.authPayload = payload as IAuthPayload;

	return next();
});
