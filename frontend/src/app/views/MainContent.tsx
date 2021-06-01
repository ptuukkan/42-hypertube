import SearchMovies from 'app/views/movieList/SearchMovies';
import { RootStoreContext } from 'app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Segment } from 'semantic-ui-react';
import Browse from './movieList/Browse';

const MainContent: React.FC = () => {
	const rootStore = useContext(RootStoreContext);
	const { getMovies, movies, savedSearch } = rootStore.movieStore;
	const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);
	const [searchQuery, setQuery] = useState(savedSearch);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (movies.count !== 0 || savedSearch !== '') return;
		setLoading(true);
		getMovies(searchQuery).then(() => setLoading(false));
	}, []);

	useEffect(() => {
		if (savedSearch === '' && searchQuery === '') return;
		if (savedSearch && searchQuery === savedSearch) return;
		if (searchTimer) clearTimeout(searchTimer!);
		setSearchTimer(
			setTimeout(() => {
				setLoading(true);
				getMovies(searchQuery).then(() => setLoading(false));
			}, 700)
		);
	}, [searchQuery]);

	return (
		<Segment style={{ minHeight: 500, padding: 60 }}>
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
