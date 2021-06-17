import { ValidationResult } from '@lemoncode/fonk/typings/model';
import { IFieldValidatorArgs, ValidatorFunction } from './types';

export const getTranslatedEmailValidator = (
	errorText: string
): ValidatorFunction => {
	const EMAIL_REGEX =
		/[a-zA-Z\d!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z\d!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z\d](?:[a-zA-Z\d-]*[a-zA-Z\d])?\.)+[a-zA-Z\d](?:[a-zA-Z\d-]*[a-zA-Z\d])?/;

	return (fieldValidatorArgs: IFieldValidatorArgs): ValidationResult => {
		const { value } = fieldValidatorArgs;

		const validationResult = {
			succeeded: false,
			type: 'EMAIL_COMPLEXITY',
			message: errorText,
		};

		if (EMAIL_REGEX.test(value)) {
			validationResult.succeeded = true;
			validationResult.message = '';
		}
		return validationResult;
	};
};
