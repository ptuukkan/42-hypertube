import { IMovie } from 'app/models/movie';
import SearchMovies from 'app/SharedComponents/SearchMoves';
import React, { useEffect, useState } from 'react';
import { Segment } from 'semantic-ui-react';
import agent from '../services/agent';
import Browse from './Browse';

export interface MainContetProps {
	searchQuery: string;
	setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const MainContent: React.FC<MainContetProps> = ({ searchQuery, setQuery }) => {
	const [movies, setMovies] = useState<IMovie[]>([]);
	const [lastQuery, setLastQuery] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (movies.length === 0 || searchQuery !== lastQuery) {
			setLoading(true);
			agent.Movies.search(searchQuery)
				.then((movies) => setMovies(movies.movies))
				.catch((e) => console.log(e))
				.finally(() => {
					setLoading(false);
					setLastQuery(searchQuery);
				});
		}
	}, [movies.length, searchQuery, lastQuery]);

	return (
		<Segment style={{ minHeight: 500, padding: 60 }}>
			<SearchMovies setQuery={setQuery} searchQuery={searchQuery} />
			<Browse loading={loading} movies={movies} />
		</Segment>
	);
};

export default MainContent;
