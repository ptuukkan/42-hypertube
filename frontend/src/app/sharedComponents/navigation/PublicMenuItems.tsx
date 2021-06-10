import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import LanguageSelector from './LanguageSelector';

const PublicMenuItems: React.FC = () => {
	const { t } = useTranslation();

	return (
		<Menu.Menu position="right">
			<Menu.Item as={Link} to="/register">
				{t('register')}
			</Menu.Item>
			<Menu.Item as={Link} to="/login">
				{t('login')}
			</Menu.Item>
			<LanguageSelector />
		</Menu.Menu>
	);
};

export default PublicMenuItems;
