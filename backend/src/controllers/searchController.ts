import { searchYtsMovies } from 'application/search/yts';
import asyncHandler from 'express-async-handler';
import bay from 'services/bay';

const search = asyncHandler(async (_req, res) => {
	const movies = await bay.Movies.top();
	res.json(movies.map((m) => m.imdb));
});

const searchController = {
	search,
};

export default searchController;
