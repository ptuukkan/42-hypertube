import dotenv from 'dotenv';
import { IMovieThumbnail } from 'models/movie';
import LRU from 'lru-cache';
dotenv.config();

const lruOptions = { max: 1000, maxAge: 1000 * 60 * 5 };
export const cache = new LRU<string, IMovieThumbnail[]>(lruOptions);
