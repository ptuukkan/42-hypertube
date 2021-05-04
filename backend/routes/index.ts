import { Application } from 'express';
import testRoutes from './test';

const mountRoutes = (app: Application) => {
	// Regular routes (without middleware)
	app.use('/api/testNoAuth', testRoutes);

	// routes with middleware
	// app.use('/api/testNoAuth', MIDDLEWARE, testRoutes);
};

export default mountRoutes;
// Then in app.ts import this as mountRoutes and call it with app as the parameter
