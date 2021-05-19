import { Application } from 'express';
import movieRouter from 'routes/private/movie';
import preAuthRouter from 'routes/preAuth';
import { checkAccessToken } from 'middleware/checkAccessToken';
import { accessTokenController } from 'controllers/accessToken';
import userRouter from 'routes/private/user';

const mountRoutes = (app: Application): void => {
	app.post('/api/accessToken', accessTokenController);

	// Public routes // TODO change preAuth to pre-auth
	app.use('/api/preAuth/', preAuthRouter);

	// Private routes
	app.use('/api/movies', checkAccessToken, movieRouter);
	app.use('/api/user', checkAccessToken, userRouter);
};

export default mountRoutes;
