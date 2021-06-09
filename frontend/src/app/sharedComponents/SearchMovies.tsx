import React from 'react';
import { useTranslation } from 'react-i18next';
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
	const { t } = useTranslation();

	return (
		<Input
			loading={loading}
			icon="search"
			placeholder={t('search')}
			onChange={(e) => setQuery(e.target.value)}
			value={searchQuery}
		/>
	);
};

export default SearchMovies;
