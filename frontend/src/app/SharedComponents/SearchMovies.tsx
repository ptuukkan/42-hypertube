import React from 'react';
import { Input } from 'semantic-ui-react';

export interface SearchMoviesProps {
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	searchQuery: string;
}

const SearchMovies: React.FC<SearchMoviesProps> = ({
	setQuery,
	searchQuery,
}) => {
	return (
		<Input
			icon="search"
			placeholder="Search..."
			onChange={(e) => setQuery(e.target.value)}
			value={searchQuery}
		/>
	);
};

export default SearchMovies;
