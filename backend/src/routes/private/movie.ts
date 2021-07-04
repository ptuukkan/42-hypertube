import {
	getMovie,
	prepareMovie,
	searchMovies,
	streamMovie,
} from 'controllers/movie';
import { Router } from 'express';

const movieRouter = Router();

movieRouter.get('/search', searchMovies);
movieRouter.post('/:imdbCode/prepare', prepareMovie);
movieRouter.get('/:imdbCode/stream', streamMovie);
movieRouter.get('/:imdbCode', getMovie);

export default movieRouter;
