import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../services/agent';
import { RootStore } from './rootStore';
import { IMovieList } from '../models/movie';

export default class ProfileStore {
	rootStore: RootStore;
	movies: IMovieList = { count: 0, movies: [] };

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	getTopMovies = async () => {
		try {
			const tempMovies = await agent.Browse.top();
			runInAction(() => {
				this.movies = tempMovies;
			});
		} catch (e) {
			console.log(e);
		}
	};
}
