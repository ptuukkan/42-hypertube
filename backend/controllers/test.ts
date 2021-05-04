import { Request, Response } from 'express';

export const testRoute = (_: Request, res: Response) => {
	res.status(200).json({ test: 'SUCCESS' });
};
