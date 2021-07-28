import { RootStoreContext } from 'app/stores/rootStore';
import { Languages, languageArray } from 'app/stores/userStore';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { changeLanguage, languagesSelect } from 'translations/i18n';

interface IProps {
	isMobile?: boolean;
}

const LanguageSelector: React.FC<IProps> = ({ isMobile = false }) => {
	const { i18n } = useTranslation();
	const rootStore = useContext(RootStoreContext);
	const { token, updateLanguage } = rootStore.userStore;

	useEffect(() => {
		const oldLanguage = window.localStorage.getItem('language');
		if (oldLanguage && token) {
			window.localStorage.removeItem('language');
			if (!languageArray.includes(oldLanguage)) {
				console.log('Could not save unknown language. Please try again.');
				//TODO Unknown language toast here.
			} else {
				updateLanguage(oldLanguage as Languages).catch(() => {
					console.log('Failed to save language. Please try again.');
					//TODO toast here.
				});
			}
		}
	});

	const activeLanguageName = () => {
		const activeLng = languagesSelect.find((row) => row.key === i18n.language);
		return activeLng!.text;
	};

	const handleChange = (
		e: React.SyntheticEvent<HTMLElement, Event>,
		{ value }: DropdownProps
	) => {
		changeLanguage(value as string);
		if (token) {
			updateLanguage(value as Languages);
		} else {
			window.localStorage.setItem('language', value as string);
		}
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
