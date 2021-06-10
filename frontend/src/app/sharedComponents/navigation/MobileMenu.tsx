import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Container, Menu, Image, Popup, Icon } from 'semantic-ui-react';
import { RootStoreContext } from 'app/stores/rootStore';

interface IProps {
	token: string | null;
}

const MobileMenu: React.FC<IProps> = ({ token }) => {
	const rootStore = useContext(RootStoreContext);
	const { logoutUser } = rootStore.userStore;
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<Fragment>
			<Menu fixed="top">
				<Container>
					<Menu.Item as={Link} to={token ? '/movies' : '/'} header>
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
							{token && (
								<Menu vertical>
									<Menu.Item
										as={Link}
										to="/profile"
										name="myprofile"
										onClick={() => setMenuOpen(false)}
									>
										<Icon name="user circle" />
										Profile
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
							)}
							{!token && (
								<Menu vertical>
									<Menu.Item
										as={Link}
										to="/login"
										name="Login"
										onClick={() => setMenuOpen(false)}
									>
										Login
									</Menu.Item>
									<Menu.Item
										as={Link}
										to="/register"
										name="Register"
										onClick={() => setMenuOpen(false)}
									>
										Register
									</Menu.Item>
								</Menu>
							)}
						</Popup>
						{token && (
							<Menu.Item onClick={logoutUser}>
								<Icon name="times" />
								Logout
							</Menu.Item>
						)}
					</Menu.Menu>
				</Container>
			</Menu>
		</Fragment>
	);
};

export default MobileMenu;
