import 'config';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'morgan';
import createError from 'http-errors';
import axios from 'axios';
import mountRoutes from 'routes';
const cors = require('cors');
const debug = require('debug')('app');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
