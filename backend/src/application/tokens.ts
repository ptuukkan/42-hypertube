import { IAuthPayload } from '../../@types/express/index.d';
import { IUserDocument } from 'models/user';
import { sign } from 'jsonwebtoken';
import { Response } from 'express';

export interface IRefreshToken {
	userId: string;
	tokenVersion: number;
}

export const createRefreshToken = (user: IUserDocument): string => {
	const data: IRefreshToken = {
		userId: user.id,
		tokenVersion: user.tokenVersion!,
	};
	return sign(data, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
};

export const createAccessToken = (user: IUserDocument): string => {
	const data: IAuthPayload = { userId: user.id };
	return sign(data, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '2m' });
};

export const addRefreshTokenToRes = (res: Response, token: string): void => {
	res.cookie('jid', token, {
		httpOnly: true,
		path: '/api/accessToken',
		maxAge: 604800000, // 7d in millis
	});
};

export const revokeRefreshToken = (res: Response): void => {
	res.clearCookie('jid', { httpOnly: true, path: '/api/accessToken' });
};
