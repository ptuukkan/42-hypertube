import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../services/agent';
import { RootStore } from './rootStore';
import { IMovie, IMovieList } from '../models/movie';

export default class MovieStore {
	rootStore: RootStore;
	movies: IMovieList = { count: 0, movies: [] };
	savedSearch = '';
	movie: IMovie | null = null;
	subtitles: string[] = [];

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	getMovies = (search: string): Promise<void> => {
		return new Promise(async (resolve) => {
			const token = await this.rootStore.userStore.getToken();
			try {
				const tempMovies = await agent.Movies.search(search, token);
				runInAction(() => {
					this.movies = tempMovies;
					this.savedSearch = search;
				});
			} catch (error) {
				if (error.logUserOut) return this.rootStore.userStore.logoutUser();
				console.log(error);
			}
			resolve();
		});
	};

	getMovie = async (id: string): Promise<void> => {
		const token = await this.rootStore.userStore.getToken();
		try {
			const movie = await agent.Movies.get(id, token);
			runInAction(() => {
				this.movie = movie;
			});
		} catch (error) {
			if (error.logUserOut) return this.rootStore.userStore.logoutUser();
			console.log(error);
		}
	};

	prepareMovie = async (): Promise<void> => {
		if (!this.movie) return;
		const token = await this.rootStore.userStore.getToken();
			const subtitles = await agent.Movies.prepare(this.movie.imdb, token);
			runInAction(() => {
				this.subtitles = subtitles;
			});
	};

	get getSubtitles(): any[] {
		if (!this.movie) return [];
		return this.subtitles.map((s) => {
			return {
				kind: 'subtitles',
				src: `http://localhost:8080/subtitles/${this.movie!.imdb}/${s}.webvtt`,
				srcLang: s,
				default: s === 'en',
			};
		});
	}
}
