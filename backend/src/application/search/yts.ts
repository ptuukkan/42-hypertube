import yts, { IYtsMovie } from 'services/yts';

export const searchYtsMovies = async (): Promise<IYtsMovie[]> => {
	const params = new URLSearchParams();
	const movieEnvelope = await yts.Movies.list(params);
	return movieEnvelope.data.movies;
};
