import { ValidationResult } from '@lemoncode/fonk/typings/model';

export interface IFieldValidatorArgs {
	value: any;
	values?: any;
	customArgs?: any;
	message?: string | string[];
}

export type ValidatorFunction = (
	fieldValidatorArgs: IFieldValidatorArgs
) => ValidationResult;
