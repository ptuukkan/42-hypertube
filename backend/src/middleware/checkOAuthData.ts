import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const checkOAuthData = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const path: string = req.route.path.split('/').pop();
	const APP_URL = process.env.REACT_APP_BASE_URL;
	console.log('PATH -> ', path);
	const STATE_SECRET =
		path === '42'
			? process.env.STATE_SECRET_42
			: process.env.GITHUB_STATE_SECRET;
	const code: string | undefined = req.query.code as string | undefined;
	const state: string | undefined = req.query.state as string | undefined;
	let errorStr: string | undefined;

	if (!code) errorStr = 'User+did+not+allow+access.';
	if (state !== STATE_SECRET) errorStr = 'Returned+state+did+not+match.';
	if (errorStr) return res.redirect(301, `${APP_URL}?oauth-error=${errorStr}`);

	req.oAuthPayload = { code: code!, state: state! };

	next();
};
