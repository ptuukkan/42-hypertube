export interface IValidationError {
	field: string;
	message: string;
}

export interface IBackendError {
	error_type: string;
	message: string;
}

export class BackendError {
	error_type: string;
	message: string;

	constructor(message: string) {
		this.error_type = 'BackendError';
		this.message = message;
	}
}
