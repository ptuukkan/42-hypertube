import { searchMovies, topMovies } from 'controllers/movie';
import { Router } from 'express';

const movieRouter = Router();

movieRouter.get('/top', topMovies);

// search?query=lord+of+the+rings, 400 if query is not supplied
movieRouter.get('/search', searchMovies);

export default movieRouter;
