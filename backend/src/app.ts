import 'config';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'morgan';
import searchRouter from 'routes/search';
import createError from 'http-errors';
import axios from 'axios';
const debug = require('debug')('app');

const app = express();
const PORT = process.env.PORT;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/search', searchRouter);

app.use((_req: Request, _res: Response, next: NextFunction) => {
	next(createError(404));
});

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
	debug(err);
	if (res.headersSent) {
		return next(err);
	}
	if (err instanceof createError.HttpError) {
		res.status(err.statusCode).send(err.message);
	} else if (axios.isAxiosError(err) && err.response) {
		res.status(err.response.status).send(err.response.statusText);
	} else {
		res.status(500).send('Internal server error');
	}
});

app.listen(PORT, () => {
	console.info(`App listening on port ${PORT}`);
});
