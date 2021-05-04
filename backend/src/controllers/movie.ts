import asyncHandler from 'express-async-handler';

export const topMovies = asyncHandler(async (_req, res) => {
	res.send("top movies");
});
