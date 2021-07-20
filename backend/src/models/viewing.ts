import { Schema, Document, model } from 'mongoose';
import { IMovieDocument } from './movie';

export interface IViewingDocument extends Document {
	user: Schema.Types.ObjectId;
	movie: Schema.Types.ObjectId | IMovieDocument;
}

const ViewingSchema = new Schema<IViewingDocument>({
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
});

export default model<IViewingDocument>('Viewing', ViewingSchema);
