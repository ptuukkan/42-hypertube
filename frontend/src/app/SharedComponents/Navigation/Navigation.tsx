import { AppMedia } from 'app/SharedComponents/AppMedia';
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Image } from 'semantic-ui-react';
import MobileMenu from './MobileMenu';
import PrivateMenuItems from './PrivateMenuItems';
import PublicMenuItems from './PublicMenuItems';

const { Media, MediaContextProvider } = AppMedia;

export interface NavigationProps {
	token: string | null;
}

const Navigation: React.FC<NavigationProps> = ({
	token,
}) => {
	return (
		<MediaContextProvider>
			<Menu fixed="top" icon="labeled" borderless>
				<Menu.Item as={Link} to="/" header>
					<Image
						size="small"
						src={'./logo_128.png'}
						floated="left"
						style={{ marginRight: '1em', maxWidth: 50 }}
					/>
				</Menu.Item>
				<Menu.Menu position="right">
					<Media at="xs">
						<MobileMenu />
					</Media>
					<Media greaterThanOrEqual="sm">
						{token && <PrivateMenuItems />}
						{!token && <PublicMenuItems />}
					</Media>
				</Menu.Menu>
			</Menu>
		</MediaContextProvider>
	);
};

export default Navigation;
