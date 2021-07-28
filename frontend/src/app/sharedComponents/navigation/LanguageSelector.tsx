import { RootStoreContext } from 'app/stores/rootStore';
import { Languages } from 'app/stores/userStore';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { changeLanguage, languagesSelect } from 'translations/i18n';

interface IProps {
	isMobile?: boolean;
}

const LanguageSelector: React.FC<IProps> = ({ isMobile = false }) => {
	const { i18n } = useTranslation();
	// TODO hold this oldLanguage in localStorate due to oAuth refreshes page!
	const [oldLanguage, setOldLanguage] = useState<Languages | null>(() => null);
	const rootStore = useContext(RootStoreContext);
	const { token, updateUser } = rootStore.userStore;

	useEffect(() => {
		if (token && oldLanguage) {
			console.log(i18n.language);
		}
	}, [token, oldLanguage]);

	const activeLanguageName = () => {
		const activeLng = languagesSelect.find((row) => row.key === i18n.language);
		return activeLng!.text;
	};

	const handleChange = (
		e: React.SyntheticEvent<HTMLElement, Event>,
		{ value }: DropdownProps
	) => {
		if (!oldLanguage) setOldLanguage(i18n.language as Languages);
		console.log('LANGUAGE CHANGED FROM ' + i18n.language + ' to ' + value);
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
