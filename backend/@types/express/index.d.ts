export {};

interface ICodePayload {
	userId: string;
	code: string;
}

declare global {
	namespace Express {
		interface Request {
			codePayload?: ICodePayload;
		}
	}
}
