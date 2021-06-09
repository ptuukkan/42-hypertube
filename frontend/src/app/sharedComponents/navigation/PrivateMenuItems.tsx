import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from 'app/stores/rootStore';
import { Menu } from 'semantic-ui-react';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

const PrivateMenuItems = () => {
	const { t } = useTranslation();
	const rootStore = useContext(RootStoreContext);
	const { logoutUser } = rootStore.userStore;

	return (
		<Menu.Menu position="right">
			<Menu.Item as={Link} to="/my_profile">
				{t('profile')}
			</Menu.Item>
			<Menu.Item onClick={logoutUser}>{t('logout')}</Menu.Item>
			<LanguageSelector />
		</Menu.Menu>
	);
};

export default PrivateMenuItems;
