import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Image, Input } from 'semantic-ui-react';

export interface PrivateMenuItemsProps {
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	searchQuery: string;
}

const PrivateMenuItems: React.FC<PrivateMenuItemsProps> = ({
	setQuery,
	searchQuery,
}) => {
	return (
		<Fragment>
			<Menu fixed="top">
				<Container>
					<Menu.Item as={Link} to="/" header>
						<Image
							size="small"
							src={'./logo_128.png'}
							floated="left"
							style={{ marginRight: '1em', maxWidth: 50 }}
						/>
					</Menu.Item>
					<Menu.Menu position="right">
						<Input
							icon="search"
							placeholder="Search..."
							onChange={(e) => setQuery(e.target.value)}
							value={searchQuery}
						/>
						<Menu.Item as={Link} to="/register">
							Register
						</Menu.Item>
						<Menu.Item as={Link} to="/login">
							Login
						</Menu.Item>
					</Menu.Menu>
				</Container>
			</Menu>
		</Fragment>
	);
};

export default PrivateMenuItems;
