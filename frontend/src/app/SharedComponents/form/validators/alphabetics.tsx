interface FieldValidatorArgs {
	value: any;
	values?: any;
	customArgs?: any;
	message?: string | string[];
}

export const alphabetic = (fieldValidatorArgs: FieldValidatorArgs) => {
	const { value } = fieldValidatorArgs;

	const validationResult = {
		succeeded: false,
		type: 'ALPHABETIC',
		message: 'Must be alphabetic.',
	};

	const regexp = new RegExp('^[A-Za-zñÑáéíóúÁÉÍÓÚäÄöÖåÅ]+$');
	if (regexp.test(value)) {
		validationResult.succeeded = true;
		validationResult.message = '';
	}
	return validationResult;
};
