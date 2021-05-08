import { searchMovies, topMovies } from 'controllers/movie';
import { Router } from 'express';

const movieRouter = Router();

movieRouter.get('/top', topMovies);
movieRouter.get('/search', searchMovies); // search?query=lord+of+the+rings, 400 if query is not supplied

export default movieRouter;
