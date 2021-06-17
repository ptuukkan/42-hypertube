import { getTranslatedEmailValidator } from 'app/sharedComponents/form/validators/email';
import { getTranslatedNameValidator } from 'app/sharedComponents/form/validators/name';
import { getTranslatedPasswordComplexity } from 'app/sharedComponents/form/validators/passwordComplexity';
import {
	createFinalFormValidation,
	FinalFormValidation,
} from '@lemoncode/fonk-final-form';
import { getTranslatedUsernameValidator } from './username';
import { TFunction } from 'react-i18next';

export const getLoginFormValidator = (t: TFunction): FinalFormValidation => {
	const validationSchema = {
		field: {
			username: [getTranslatedUsernameValidator(t('username_error'))],
			password: [getTranslatedPasswordComplexity(t('password_error'))],
		},
	};
	return createFinalFormValidation(validationSchema);
};

export const getRegisterFormValidator = (
	t: TFunction,
	emptyPasswordIsOk = false
): FinalFormValidation => {
	const validationSchema = {
		field: {
			firstName: [getTranslatedNameValidator(t('name_error'))],
			lastName: [getTranslatedNameValidator(t('name_error'))],
			username: [getTranslatedUsernameValidator(t('username_error'))],
			email: [getTranslatedEmailValidator(t('email_field_error'))],
			password: [
				getTranslatedPasswordComplexity(t('password_error'), emptyPasswordIsOk),
			],
		},
	};
	return createFinalFormValidation(validationSchema);
};

export const getChangePasswordFormValidator = (
	t: TFunction
): FinalFormValidation => {
	const validationSchema = {
		field: {
			password: [getTranslatedPasswordComplexity(t('password_error'))],
		},
	};
	return createFinalFormValidation(validationSchema);
};

export const getForgotPasswordFormValidator = (
	t: TFunction
): FinalFormValidation => {
	const validationSchema = {
		field: {
			email: [getTranslatedEmailValidator(t('email_field_error'))],
		},
	};
	return createFinalFormValidation(validationSchema);
};
