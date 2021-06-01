import { Application } from 'express';
import movieRouter from 'routes/private/movie';
import preAuthRouter from 'routes/preAuth';
import oAuthRouter from './oauth';
import { checkAccessToken } from 'middleware/checkAccessToken';
import { accessTokenController } from 'controllers/accessToken';
import userRouter from 'routes/private/user';

const mountRoutes = (app: Application): void => {
	// Public routes
	app.use('/api/pre-auth/', preAuthRouter);
	app.use('/api/auth/', oAuthRouter);
	app.post('/api/accessToken', accessTokenController);
	// Private routes
	app.use('/api/movies', checkAccessToken, movieRouter);
	app.use('/api/user', checkAccessToken, userRouter);
};

export default mountRoutes;
