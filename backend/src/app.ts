import 'config';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'morgan';
import createError from 'http-errors';
import axios from 'axios';
import mountRoutes from 'routes';
import mongoose from 'mongoose';
import { connectToDb, getDbValidationErrors } from 'database';
import Debug from 'debug';
import cookieParser from 'cookie-parser';
import { JsonWebTokenError } from 'jsonwebtoken';
import { NOT_VALID_FILE } from './application/multer';
import cors from 'cors';
import { MulterError } from 'multer';
import cronScheduler from 'cron';

const debug = Debug('app');
const app = express();
const PORT = process.env.PORT!;

connectToDb().then(() => {
	// Add deletion cron jobs for each downloaded movie
	cronScheduler.addJobsForEachMovie();
});

app.use(cors({ origin: process.env.REACT_APP_BASE_URL, credentials: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(`${__dirname}/../public`));

mountRoutes(app);

app.use((_req: Request, _res: Response, next: NextFunction) => {
	next(createError(404));
});

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
	debug(err);
	if (res.headersSent) {
		return next(err);
	}
	if (err instanceof createError.HttpError) {
		res.status(err.statusCode).json({ status: 'ERROR', message: err.message });
	} else if (axios.isAxiosError(err) && err.response) {
		res
			.status(err.response.status)
			.json({ status: 'ERROR', message: err.response.statusText });
	} else if (err instanceof mongoose.Error.ValidationError) {
		res.status(400).json({
			status: 'ERROR',
			message: 'Invalid data',
			errors: getDbValidationErrors(err),
		});
	} else if (err instanceof mongoose.Error) {
		res.status(500).json({ status: 'ERROR', message: 'DATABASE ERROR' });
	} else if (err instanceof JsonWebTokenError) {
		res.status(401).json({ status: 'ERROR', message: err.message, src: 'jwt' });
	} else if (err instanceof MulterError) {
		let message = err.message;
		if (err.field === NOT_VALID_FILE) message = 'File is not an image';
		res.status(400).json({ status: 'ERROR', message });
	} else {
		res.status(500).json({ status: 'ERROR', message: 'Internal server error' });
	}
});

app.listen(PORT, () => {
	console.info(`App listening on port ${PORT}`);
});
