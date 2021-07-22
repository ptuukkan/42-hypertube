import { Schema, Document, model } from 'mongoose';
import { IYtsCast } from 'services/yts';
import { IComment } from './comment';

export interface IMovieThumbnailEnvelope {
	count: number;
	genres: string[];
	movies: IMovieThumbnail[];
}

export interface IMovieThumbnail {
	title: string;
	year: number;
	coverImage: string;
	genres: string[];
	rating: number;
	imdb: string;
	watched: boolean;
}

// Used for type checking.
export const dummyThumbnail: IMovieThumbnail = {
	title: 'Movie Title',
	year: 1999,
	coverImage: 'Cover Image',
	genres: ['genre1', 'genre2'],
	rating: 9,
	imdb: 'imdb code',
	watched: false,
};

export interface IMovie extends IMovieThumbnail {
	summary: string;
	runtime: number;
	director?: string;
	writer?: string;
	actors?: string | IYtsCast[];
	comments: IComment[];
}

export interface IMovieDocument extends Document {
	imdbCode: string;
	status: number;
	fileName: string;
	torrentHash: string;
	movieHash: string;
	subtitles: string[];
	lastViewed: number;
}

const MovieSchema = new Schema<IMovieDocument>({
	imdbCode: { type: String, required: true },
	status: { type: Number, required: true }, // 0 = not downloaded, 1 = downloading, 2 = download completed
	fileName: { type: String },
	torrentHash: { type: String },
	movieHash: { type: String },
	subtitles: { type: Array },
	lastViewed: { type: Number },
});

export default model<IMovieDocument>('Movie', MovieSchema);
