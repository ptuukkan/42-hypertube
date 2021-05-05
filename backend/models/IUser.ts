import { genSalt, hash, compare } from 'bcrypt';
import mongoose, { Schema, Document, HookNextFunction } from 'mongoose';

// TODO with import this gives type error when applying plugin below
//import uniqueValidator from "mongoose-unique-validator";
const uniqueValidator = require('mongoose-unique-validator');

const HASH_ROUNDS = 10;

export enum Language {
	ENGLISH = 'en',
	FINNISH = 'fi',
	ESTONIAN = 'ee',
}

export interface IUser {
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	password: string;
	language?: string;
	profilePicName?: string;
}

export interface IUserDocument extends IUser, Document {
	fullName: string;
	isPasswordValid(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>({
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	password: { type: String, required: true },
	language: {
		type: String,
		enum: Object.values(Language),
		default: Language.ENGLISH,
	},
	profilePicName: { type: String, default: 'blank-profile.png' },
});

UserSchema.pre<IUserDocument>('save', async function (next: HookNextFunction) {
	if (!this.isModified('password')) {
		return next();
	}

	try {
		const salt = await genSalt(HASH_ROUNDS);
		this.password = await hash(this.password, salt);
		return next();
	} catch (e) {
		return next(e);
	}
});

UserSchema.virtual('fullName').get(function (this: IUserDocument): String {
	return `${this.firstName} ${this.lastName}`;
});

UserSchema.methods.isPasswordValid = function (
	password: string
): Promise<boolean> {
	return compare(password, this.password);
};

UserSchema.plugin(uniqueValidator);

export default mongoose.model<IUserDocument>('User', UserSchema);
