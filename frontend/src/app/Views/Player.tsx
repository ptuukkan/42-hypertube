import { IMovie } from 'app/models/movie';
import React from 'react';
import ReactPlayer from 'react-player';

interface IProps {
	movie: IMovie;
}

const Player: React.FC<IProps> = ({ movie }) => {
	console.log('render');

	return (
		<ReactPlayer
			url={`http://localhost:8080/api/movies/${movie.imdb}/stream`}
			width="100%"
			height="auto"
			controls={true}
			muted={true}
		/>
	);
};

export default Player;
