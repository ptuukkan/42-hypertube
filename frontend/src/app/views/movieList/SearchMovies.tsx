import React, { createRef, useEffect } from 'react';
import { Input } from 'semantic-ui-react';

export interface SearchMoviesProps {
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	searchQuery: string;
	loading: boolean;
}

const SearchMovies: React.FC<SearchMoviesProps> = ({
	searchQuery,
	setQuery,
	loading,
}) => {
	const inputRef: React.LegacyRef<Input> = createRef();

	useEffect(() => {
		if (!loading) inputRef.current?.focus();
	}, [loading]);

	return (
		<Input
			loading={loading}
			disabled={loading}
			icon="search"
			placeholder="Search..."
			onChange={(e) => setQuery(e.target.value)}
			value={searchQuery}
			ref={inputRef}
		/>
	);
};

export default SearchMovies;
