import SearchMovies from 'app/views/movieList/SearchMovies';
import { RootStoreContext } from 'app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Segment } from 'semantic-ui-react';
import Browse from './movieList/Browse';

const MainContent: React.FC = () => {
	const rootStore = useContext(RootStoreContext);
	const { getMovies, movies, savedSearch } = rootStore.movieStore;
	const searchTimer = useRef<NodeJS.Timeout>();
	const [searchQuery, setQuery] = useState(savedSearch);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (movies.count !== 0 || savedSearch !== '') return;
		setLoading(true);
		getMovies(searchQuery).then(() => setLoading(false));
	}, [getMovies, movies.count, savedSearch, searchQuery]);

	useEffect(() => {
		if (savedSearch === '' && searchQuery === '') return;
		if (savedSearch && searchQuery === savedSearch) return;
		if (searchTimer.current) clearTimeout(searchTimer.current!);
		searchTimer.current = setTimeout(() => {
			setLoading(true);
			getMovies(searchQuery).then(() => setLoading(false));
		}, 700);
		return () => {
			if (searchTimer.current) clearTimeout(searchTimer.current!);
		};
	}, [searchQuery, getMovies, savedSearch]);

	return (
		<Segment
			style={{ minHeight: 500, padding: 60, paddingTop: 30, marginTop: 80 }}
		>
			<SearchMovies
				setQuery={setQuery}
				searchQuery={searchQuery}
				loading={loading}
			/>
			<Browse loading={loading} movies={movies.movies} />
		</Segment>
	);
};

export default observer(MainContent);
