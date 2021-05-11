import React, { Fragment } from 'react';
import { Menu } from 'semantic-ui-react';
import { AppMedia } from './AppMedia';
import MobileMenu from './MobileMenu';
import PrivateMenuItems from './PrivateMenuItems';

const { Media, MediaContextProvider } = AppMedia;

export interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = () => {
	return (
		<MediaContextProvider>
				<Menu fixed="top" icon="labeled" borderless>
						<Fragment>
							<Media at="xs">
								<MobileMenu />
							</Media>
							<Media greaterThanOrEqual="sm">
								<PrivateMenuItems />
							</Media>
						</Fragment>
				</Menu>
		</MediaContextProvider>
	);
};

export default Navigation;
