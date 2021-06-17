export interface IRegisterFormValues {
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	password: string;
}

export interface IUpdateForm {
	[key: string]: string | File;
}

export interface IGetUser {
	status: string;
	user: IUser;
}

export interface IUser {
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	profilePicName: string;
	removePic?: boolean;
	_id: string;
}

export interface IAccessToken {
	accessToken: string;
}

export interface ILoginFormValues {
	username: string;
	password: string;
}

export interface IResetPassword {
	password: string;
}

export interface IForgetPassword {
	email: string;
}
