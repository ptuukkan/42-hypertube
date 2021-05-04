import { topMovies } from 'controllers/movie';
import { Router } from 'express';

const movieRouter = Router();

movieRouter.get('/top', topMovies);

export default movieRouter;
