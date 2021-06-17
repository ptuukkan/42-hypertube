import { ValidationResult } from '@lemoncode/fonk/typings/model';
import { IFieldValidatorArgs, ValidatorFunction } from './types';

export const getTranslatedUsernameValidator = (
	errorText: string
): ValidatorFunction => {
	return (fieldValidatorArgs: IFieldValidatorArgs): ValidationResult => {
		const { value } = fieldValidatorArgs;

		const validationResult = {
			succeeded: false,
			type: 'USERNAME',
			message: errorText,
		};

		if (value && value.length > 2 && value.length < 256) {
			validationResult.succeeded = true;
			validationResult.message = '';
		}
		return validationResult;
	};
};
