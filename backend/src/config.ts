import dotenv from 'dotenv';
import { IMovie, IMovieThumbnail } from 'models/movie';
import LRU from 'lru-cache';
dotenv.config();

const lruOptions = { max: 1000, maxAge: 1000 * 60 * 5 };
export const thumbnailCache = new LRU<string, IMovieThumbnail[]>(lruOptions);
export const movieCache = new LRU<string, IMovie>(lruOptions);
