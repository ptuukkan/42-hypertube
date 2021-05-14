/* eslint-disable @typescript-eslint/no-var-requires */
import { genSalt, hash, compare } from 'bcryptjs';
import mongoose, { Schema, Document, HookNextFunction } from 'mongoose';

// TODO with import this gives type error when applying plugin below
// import uniqueValidator from "mongoose-unique-validator";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const uniqueValidator = require('mongoose-unique-validator');

const HASH_ROUNDS = 10;
// eslint-disable-next-line max-len
const EMAIL_REGEX = /[a-zA-Z\d!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z\d!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z\d](?:[a-zA-Z\d-]*[a-zA-Z\d])?\.)+[a-zA-Z\d](?:[a-zA-Z\d-]*[a-zA-Z\d])?/;

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
	isConfirmed?: boolean;
}

export interface IUserDocument extends IUser, Document {
	fullName: string;
	isPasswordValid(password: string): Promise<boolean>;
	checkAndUpdatePassword(password: string): Promise<void>;
}

const UserSchema = new Schema<IUserDocument>({
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: (email: string) => EMAIL_REGEX.test(email),
			message: () => 'Email must be a valid address.',
		},
	},
	username: {
		type: String,
		required: true,
		unique: true,
		minLength: [3, 'Username must be at least 3 characters.'],
		maxLength: [255, 'Username must not be over 255 characters.'],
	},
	firstName: {
		type: String,
		required: true,
		minLength: [2, 'First name must be at least 2 characters.'],
		maxLength: [255, 'First name must not be over 255 characters.'],
		validate: {
			validator: (name: string) => /^[A-Za-z]+$/.test(name),
			message: () => 'First name must be only letters.',
		},
	},
	lastName: {
		type: String,
		required: true,
		minLength: [2, 'Last name must be at least 2 characters.'],
		maxLength: [255, 'Last name must not be over 255 characters.'],
		validate: {
			validator: (name: string) => /^[A-Za-z]+$/.test(name),
			message: () => 'Last name must be only letters.',
		},
	},
	password: {
		type: String,
		required: true,
		minLength: [4, 'Password must be at least 4 characters.'],
		maxLength: [255, 'Password must not be over 255 characters.'],
		validate: {
			validator: (password: string) =>
				/[A-Za-z]+/.test(password) && /\d+/.test(password),
			message: () => 'Password must have both letters and numbers.',
		},
	},
	language: {
		type: String,
		enum: Object.values(Language),
		default: Language.ENGLISH,
	},
	profilePicName: { type: String, default: 'blank-profile.png' },
	isConfirmed: { type: Boolean, default: false },
});

/**
 * When user is valid then on save the password is hashed and saved
 */
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

UserSchema.virtual('fullName').get(function (this: IUserDocument): string {
	return `${this.firstName} ${this.lastName}`;
});

/**
 * To check if password is valid on login
 *
 * @param password regular string
 * @returns Boolean as a Promsise if the password is valid or not
 */
UserSchema.methods.isPasswordValid = function (
	password: string
): Promise<boolean> {
	return compare(password, this.password);
};

UserSchema.methods.checkAndUpdatePassword = async function (
	password: string
): Promise<void> {
	this.password = password;
	// Throws error if invalid format
	await this.validate();
	const salt = await genSalt(HASH_ROUNDS);
	const hashPass = await hash(password, salt);
	return this.updateOne({ password: hashPass });
};

UserSchema.plugin(uniqueValidator);

export default mongoose.model<IUserDocument>('User', UserSchema);
