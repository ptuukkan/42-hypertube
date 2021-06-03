import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import LanguageSelector from './LanguageSelector';

export interface PublicMenuItemsProps {}

const PublicMenuItems: React.FC<PublicMenuItemsProps> = () => {
	const { t } = useTranslation();
	return (
		<Menu.Menu position="right">
			<Menu.Item as={Link} to="/register">
				{t('nav_register')}
			</Menu.Item>
			<Menu.Item as={Link} to="/login">
				{t('nav_login')}
			</Menu.Item>
			<LanguageSelector />
		</Menu.Menu>
	);
};

export default PublicMenuItems;
