import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import LanguageSelector from './LanguageSelector';

const PublicMenuItems: React.FC = () => {
	const { t } = useTranslation();

	return (
		<Menu.Menu position="right" style={{ height: '100%' }}>
			<Menu.Item as={Link} to="/register" style={{ justifyContent: 'center' }}>
				{t('register')}
			</Menu.Item>
			<Menu.Item as={Link} to="/login" style={{ justifyContent: 'center' }}>
				{t('login')}
			</Menu.Item>
			<LanguageSelector />
		</Menu.Menu>
	);
};

export default PublicMenuItems;
