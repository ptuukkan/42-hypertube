import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from 'app/stores/rootStore';
import { Menu } from 'semantic-ui-react';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

const PrivateMenuItems: React.FC = () => {
	const { t } = useTranslation();
	const rootStore = useContext(RootStoreContext);
	const { logoutUser } = rootStore.userStore;

	return (
		<Menu.Menu position="right" style={{ height: '100%' }}>
			<Menu.Item as={Link} to="/profile" style={{ justifyContent: 'center' }}>
				{t('profile')}
			</Menu.Item>
			<Menu.Item onClick={logoutUser} style={{ justifyContent: 'center' }}>
				{t('logout')}
			</Menu.Item>
			<LanguageSelector />
		</Menu.Menu>
	);
};

export default PrivateMenuItems;
