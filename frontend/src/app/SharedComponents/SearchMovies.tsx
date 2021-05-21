import React from 'react';
import { Input } from 'semantic-ui-react';

export interface SearchMoviesProps {
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	searchQuery: string;
	loading: boolean
}

const SearchMovies: React.FC<SearchMoviesProps> = ({
	searchQuery,
	setQuery,
	loading,
}) => {
	
	return (
			<Input
				loading={loading}
				icon="search"
				placeholder="Search..."
				onChange={(e) => setQuery(e.target.value)}
				value={searchQuery}
			/>
	);
};

export default SearchMovies;
