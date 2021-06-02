import { NextFunction, Request, Response } from 'express';
import { Unauthorized } from 'http-errors';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const checkOAuthData = (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	const path: string = req.route.path.split('/').pop();
	const STATE_SECRET =
		path === '42'
			? process.env.STATE_SECRET_42
			: process.env.GITHUB_STATE_SECRET;
	const code: string | undefined = req.body.code as string | undefined;
	const state: string | undefined = req.body.state as string | undefined;
	let errorStr: string | undefined;

	if (!code) errorStr = 'Access was denied.';
	if (state !== STATE_SECRET) errorStr = 'State secret did not match.';
	if (errorStr) next(new Unauthorized(errorStr));

	req.oAuthPayload = { code: code!, state: state! };

	next();
};
