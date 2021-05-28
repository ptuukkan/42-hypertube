import { Application } from 'express';
import movieRouter from 'routes/movie';
import oAuthRouter from './oauth';
import preAuthRouter from './preAuth';

const mountRoutes = (app: Application): void => {
	// Public routes
	app.use('/api/preAuth/', preAuthRouter);
	app.use('/api/auth/', oAuthRouter);

	// Private routes
	// TODO add isAuth middleware
	app.use('/api/movies', movieRouter);
};

export default mountRoutes;
