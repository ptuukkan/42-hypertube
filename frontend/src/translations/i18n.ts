import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import EN_TRANSLATIONS from 'app/../translations/locales/en/translations.json';
import EE_TRANSLATIONS from 'app/../translations/locales/ee/translations.json';
import FI_TRANSLATIONS from 'app/../translations/locales/fi/translations.json';

const LNG_ITEM_NAME = 'i18nActiveLng';

i18n.use(initReactI18next).init({
	fallbackLng: 'en',
	resources: {
		en: { translations: EN_TRANSLATIONS },
		ee: { translations: EE_TRANSLATIONS },
		fi: { translations: FI_TRANSLATIONS },
	},
	ns: ['translations'],
	defaultNS: 'translations',
});

// Set initial language
const currentLng = localStorage.getItem(LNG_ITEM_NAME);
if (!currentLng) localStorage.setItem(LNG_ITEM_NAME, 'en');
i18n.changeLanguage(currentLng || 'en');

export const languagesSelect = [
	{ key: 'en', value: 'en', text: 'English' },
	{ key: 'fi', value: 'fi', text: 'Suomi' },
	{ key: 'ee', value: 'ee', text: 'Eesti' },
];

export const changeLanguage = (value: string): void => {
	localStorage.setItem(LNG_ITEM_NAME, value);
	i18n.changeLanguage(value);
};

export default i18n;
