import { Schema, Document, model } from 'mongoose';
import UserModel from 'models/user';

export interface IComment {
	username: string;
	profilePicName?: string;
	text: string;
	timestamp: number;
}

export interface ICommentDocument extends Document {
	user: Schema.Types.ObjectId;
	movie: Schema.Types.ObjectId;
	timestamp: number;
	text: string;
	toDto(): Promise<IComment>
}

const CommentSchema = new Schema<ICommentDocument>({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	movie: {
		type: Schema.Types.ObjectId,
		ref: 'Movie',
		required: true,
	},
	timestamp: {
		type: Number,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
});

CommentSchema.methods.toDto = async function (): Promise<IComment> {
	const user = await UserModel.findById(this.user);
	if (!user) return Promise.reject('comment has no user');
	return {
		username: user.username,
		profilePicName: user.profilePicName,
		text: this.text,
		timestamp: this.timestamp,
	};
};

export default model<ICommentDocument>('Comment', CommentSchema);
