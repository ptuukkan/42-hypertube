interface ICodePayload {
	userId: string;
	code: string;
}

export interface IAuthPayload {
	userId: string;
}

declare global {
	namespace Express {
		interface Request {
			codePayload?: ICodePayload;
			authPayload?: IAuthPayload;
		}
	}
}
