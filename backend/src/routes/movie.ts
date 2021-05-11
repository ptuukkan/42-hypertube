import { searchMovies } from 'controllers/movie';
import { Router } from 'express';

const movieRouter = Router();

movieRouter.get('/search', searchMovies);

export default movieRouter;
