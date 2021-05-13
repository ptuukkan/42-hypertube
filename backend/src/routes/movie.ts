import { getMovie, searchMovies } from 'controllers/movie';
import { Router } from 'express';

const movieRouter = Router();

movieRouter.get('/search', searchMovies);
movieRouter.get('/:imdbCode', getMovie);

export default movieRouter;
