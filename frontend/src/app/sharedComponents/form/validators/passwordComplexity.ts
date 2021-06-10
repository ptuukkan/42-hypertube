import { ValidationResult } from '@lemoncode/fonk/typings/model';

interface IFieldValidatorArgs {
	value: any;
	values?: any;
	customArgs?: any;
	message?: string | string[];
}

type ValidatorFunction = (
	fieldValidatorArgs: IFieldValidatorArgs
) => ValidationResult;

export const getTranslatedPasswordComplexity = (
	errorText: string
): ValidatorFunction => {
	return (fieldValidatorArgs: IFieldValidatorArgs): ValidationResult => {
		const { value } = fieldValidatorArgs;

		const validationResult = {
			succeeded: false,
			type: 'PASSWORD_COMPLEXITY',
			message: errorText,
		};

		if (/[A-Za-z]+/.test(value) && /\d+/.test(value)) {
			validationResult.succeeded = true;
			validationResult.message = '';
		}
		return validationResult;
	};
};
