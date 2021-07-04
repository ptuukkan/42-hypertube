import { streamMovie } from 'controllers/movie';
import { Router } from 'express';

const streamRouter = Router();

streamRouter.get('/:imdbCode', streamMovie);

export default streamRouter;
