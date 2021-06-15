import { ValidationResult } from '@lemoncode/fonk/typings/model';
import { IFieldValidatorArgs, ValidatorFunction } from './types';

export const getTranslatedNameValidator = (
	errorText: string
): ValidatorFunction => {
	const ALPHA_REGEX = /^[A-Za-zñÑáéíóúÁÉÍÓÚäÄöÖåÅ]+$/;

	return (fieldValidatorArgs: IFieldValidatorArgs): ValidationResult => {
		const { value } = fieldValidatorArgs;

		const validationResult = {
			succeeded: false,
			type: 'NAME',
			message: errorText,
		};

		if (
			value &&
			ALPHA_REGEX.test(value) &&
			value.length > 1 &&
			value.length < 256
		) {
			validationResult.succeeded = true;
			validationResult.message = '';
		}
		return validationResult;
	};
};
