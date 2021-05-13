import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Container, Menu, Image, Popup, Icon, Input } from 'semantic-ui-react';

export interface MobileMenuProps {
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	searchQuery: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ setQuery, searchQuery }) => {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<Fragment>
			<Menu fixed="top">
				<Container>
					<Menu.Item as={Link} to="/" header>
						<Image
							size="small"
							src={'./logo_128.png'}
							floated="left"
							style={{ marginRight: '1em', maxWidth: 60 }}
						/>
					</Menu.Item>
					<Menu.Menu position="right">
						<Popup
							trigger={
								<Menu.Item>
									<Icon name="bars" size="massive" />
									Menu
								</Menu.Item>
							}
							position="bottom center"
							on="click"
							pinned
							style={{ padding: 0 }}
							open={menuOpen}
							onOpen={() => setMenuOpen(true)}
							onClose={() => setMenuOpen(false)}
						>
							<Menu vertical>
								<Menu.Item>
									<Input
										icon="search"
										placeholder="Search..."
										onChange={(e) => setQuery(e.target.value)}
										value={searchQuery}
									/>
								</Menu.Item>
								<Menu.Item
									as={Link}
									to="/profile"
									name="myprofile"
									onClick={() => setMenuOpen(false)}
								>
									<Icon name="user circle" />
									My Profile
								</Menu.Item>
								<Menu.Item
									as={Link}
									to="#"
									name="my movies"
									onClick={() => setMenuOpen(false)}
								>
									<Icon name="film" />
									My movies
								</Menu.Item>
							</Menu>
						</Popup>

						<Menu.Item
							as={Link}
							to="/"
							name="logout"
							onClick={() => console.log('logout')}
						>
							<Icon name="times" />
							Logout
						</Menu.Item>
					</Menu.Menu>
				</Container>
			</Menu>
		</Fragment>
	);
};

export default MobileMenu;
