import { Application } from 'express';
import movieRouter from 'routes/movie';

const mountRoutes = (app: Application) => {
	// Regular routes (without middleware)
	app.use('/api/movies', movieRouter);

	// routes with middleware
	// app.use('/api/testNoAuth', MIDDLEWARE, testRoutes);
};

export default mountRoutes;
// Then in app.ts import this as mountRoutes and call it with app as the parameter
