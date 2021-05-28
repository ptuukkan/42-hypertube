import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../services/agent';
import { RootStore } from './rootStore';
import { IMovie, IMovieList } from '../models/movie';

export default class ProfileStore {
	rootStore: RootStore;
	movies: IMovieList = { count: 0, movies: [] };
	movie: IMovie | null = null;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	getTopMovies = async () => {
		try {
			const tempMovies = await agent.Movies.search('');
			runInAction(() => {
				this.movies = tempMovies;
			});
		} catch (e) {
			console.log(e);
		}
	};

	getMovie = async (id: string) => {
		try {
			const movie = await agent.Movies.get(id);
			runInAction(() => {
				this.movie = movie;
			})
		} catch (error) {
			
		}
	}
}
