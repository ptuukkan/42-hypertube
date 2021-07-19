import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { changeLanguage, languagesSelect } from 'translations/i18n';

interface IProps {
	isMobile?: boolean;
}

const LanguageSelector: React.FC<IProps> = ({ isMobile = false }) => {
	const { i18n } = useTranslation();

	const activeLanguageName = () => {
		const activeLng = languagesSelect.find((row) => row.key === i18n.language);
		return activeLng!.text;
	};

	const handleChange = (
		e: React.SyntheticEvent<HTMLElement, Event>,
		{ value }: DropdownProps
	) => {
		changeLanguage(value as string);
	};

	return (
		<Dropdown
			item
			icon={isMobile ? 'world' : null}
			pointing={isMobile ? 'top right' : 'top'}
			options={languagesSelect}
			text={activeLanguageName()}
			onChange={handleChange}
			value={i18n.language}
			style={{ justifyContent: 'center' }}
		/>
	);
};

export default LanguageSelector;
