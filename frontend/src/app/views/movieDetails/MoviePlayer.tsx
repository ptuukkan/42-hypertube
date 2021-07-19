import { RootStoreContext } from 'app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import ReactPlayer from 'react-player';
import MovieLoader from './MovieLoader';

const MoviePlayer = (): JSX.Element => {
	const rootStore = useContext(RootStoreContext);
	const { movie, getSubtitles, setWatched } = rootStore.movieStore;

	if (!movie) return <MovieLoader />;

	const checkWatched = (played: number) => {
		if (played > 0.9 && !movie.watched) {
			setWatched();
		}
	};

	console.log('render');

	return (
		<ReactPlayer
			url={`http://localhost:8080/api/stream/${movie.imdb}`}
			width="100%"
			height="auto"
			controls
			muted
			config={{
				file: {
					tracks: getSubtitles,
				},
			}}
			onProgress={({ played }) => checkWatched(played)}
		/>
	);
};

export default observer(MoviePlayer);
