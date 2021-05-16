import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

export interface PublicMenuItemsProps {}

const PublicMenuItems: React.SFC<PublicMenuItemsProps> = () => {
	return (
		<Menu.Menu position="right">
			<Menu.Item as={Link} to="/register">
				Register
			</Menu.Item>
			<Menu.Item as={Link} to="/login">
				Login
			</Menu.Item>
		</Menu.Menu>
	);
};

export default PublicMenuItems;
