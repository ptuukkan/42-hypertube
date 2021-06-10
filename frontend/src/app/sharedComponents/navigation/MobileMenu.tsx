import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Container, Menu, Image, Popup, Icon } from 'semantic-ui-react';
import { RootStoreContext } from 'app/stores/rootStore';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

interface IProps {
	token: string | null;
}

const MobileMenu: React.FC<IProps> = ({ token }) => {
	const { t } = useTranslation();
	const rootStore = useContext(RootStoreContext);
	const { logoutUser } = rootStore.userStore;
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<>
			<Menu fixed="top">
				<Container>
					<Menu.Item as={Link} to={token ? '/movies' : '/'} header>
						<Image
							size="small"
							src="./logo_128.png"
							floated="left"
							style={{ marginRight: '1em', maxWidth: 60 }}
						/>
					</Menu.Item>
					<Menu.Menu position="right">
						<Popup
							trigger={
								<Menu.Item>
									<Icon name="bars" size="massive" />
									{t('menu')}
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
										{t('profile')}
									</Menu.Item>
									<Menu.Item
										as={Link}
										to="#"
										name="my movies"
										onClick={() => setMenuOpen(false)}
									>
										<Icon name="film" />
										{t('movies')}
									</Menu.Item>
									<LanguageSelector isMobile />
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
										{t('login')}
									</Menu.Item>
									<Menu.Item
										as={Link}
										to="/register"
										name="Register"
										onClick={() => setMenuOpen(false)}
									>
										{t('register')}
									</Menu.Item>
									<LanguageSelector isMobile />
								</Menu>
							)}
						</Popup>
						{token && (
							<Menu.Item onClick={logoutUser}>
								<Icon name="times" />
								{t('logout')}
							</Menu.Item>
						)}
					</Menu.Menu>
				</Container>
			</Menu>
		</>
	);
};

export default MobileMenu;
