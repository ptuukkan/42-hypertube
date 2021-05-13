import { Application } from 'express';
import movieRouter from 'routes/movie';
import preAuthRouter from './preAuth';

const mountRoutes = (app: Application) => {
	// Public routes
	app.use('/api/preAuth/', preAuthRouter);

	// Private routes
	// TODO add isAuth middleware
	app.use('/api/movies', movieRouter);
};

export default mountRoutes;
