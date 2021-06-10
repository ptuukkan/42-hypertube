interface IFieldValidatorArgs {
	value: any;
	values?: any;
	customArgs?: any;
	message?: string | string[];
}

export const passwordComplexity = (fieldValidatorArgs: IFieldValidatorArgs) => {
	const { value } = fieldValidatorArgs;

	const validationResult = {
		succeeded: false,
		type: 'PASSWORD_COMPLEXITY',
		message:
			'Min length is 4 charcters. Must have letters and at least 1 number.',
	};

	if (/[A-Za-z]+/.test(value) && /\d+/.test(value)) {
		validationResult.succeeded = true;
		validationResult.message = '';
	}
	return validationResult;
};

export const updatePasswordComplexity = (
	fieldValidatorArgs: IFieldValidatorArgs
) => {
	const { value } = fieldValidatorArgs;

	const validationResult = {
		succeeded: false,
		type: 'PASSWORD_COMPLEXITY',
		message:
			'Min length is 4 charcters. Must have letters and at least 1 number.',
	};

	if ((/[A-Za-z]+/.test(value) && /\d+/.test(value)) || value === undefined) {
		validationResult.succeeded = true;
		validationResult.message = '';
	}
	return validationResult;
};
