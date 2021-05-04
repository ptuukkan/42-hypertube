import { Router } from 'express';
import { testRoute } from '../controllers/test';

const testRouter = Router();

// localhost:PORT/api/testNoAuth
testRouter.get('/', testRoute);

export default testRouter;
