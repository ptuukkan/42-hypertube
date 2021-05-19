export {};

interface ICodePayload {
	userId: string;
	code: string;
}

interface IOAuthPayload {
	code: string;
	state: string;
}

declare global {
	namespace Express {
		interface Request {
			codePayload?: ICodePayload;
			oAuthPayload?: IOAuthPayload;
		}
	}
}
