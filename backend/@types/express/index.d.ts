interface ICodePayload {
	userId: string;
	code: string;
}

export interface IAuthPayload {
	userId: string;
}

interface IOAuthPayload {
	code: string;
	state: string;
}

declare global {
	namespace Express {
		interface Request {
			codePayload?: ICodePayload;
			authPayload?: IAuthPayload;
			oAuthPayload?: IOAuthPayload;
		}
	}
}
