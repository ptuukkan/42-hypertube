import { IUserDocument } from 'models/user';
import mongoose, { Schema, Document } from 'mongoose';

export enum LinkType {
	CONFIRM = 'confirm',
	RESET = 'reset',
}

export interface ILink {
	user: IUserDocument['_id'];
	linkType: string;
	code: string;
	created?: Date;
}

export interface ILinkDocument extends ILink, Document {}

const LinkSchema = new Schema<ILinkDocument>({
	linkType: { type: String, enum: Object.values(LinkType), required: true },
	code: { type: String, required: true },
	created: { type: Date, default: new Date() },
	user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

export default mongoose.model<ILinkDocument>('Link', LinkSchema);
