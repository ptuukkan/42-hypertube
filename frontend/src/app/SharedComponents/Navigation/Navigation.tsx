import { AppMedia } from 'app/SharedComponents/AppMedia';
import React, { Fragment } from 'react';
import { Menu } from 'semantic-ui-react';
import MobileMenu from './MobileMenu';
import PrivateMenuItems from './PrivateMenuItems';

const { Media, MediaContextProvider } = AppMedia;

export interface NavigationProps {
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	searchQuery: string;
}

const Navigation: React.FC<NavigationProps> = ({ setQuery, searchQuery }) => {
	return (
		<MediaContextProvider>
			<Menu fixed="top" icon="labeled" borderless>
				<Fragment>
					<Media at="xs">
						<MobileMenu setQuery={setQuery} searchQuery={searchQuery} />
					</Media>
					<Media greaterThanOrEqual="sm">
						<PrivateMenuItems setQuery={setQuery} searchQuery={searchQuery} />
					</Media>
				</Fragment>
			</Menu>
		</MediaContextProvider>
	);
};

export default Navigation;
