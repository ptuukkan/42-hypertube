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
			'Must have at least 1 lowercase, 1 uppercase, 1 number, and 1 special character',
	};

	const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*?_])/;

	if (regex.exec(value)) {
		validationResult.succeeded = true;
		validationResult.message = '';
	}
	return validationResult;
};