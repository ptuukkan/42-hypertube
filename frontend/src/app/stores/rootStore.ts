import { configure } from 'mobx';
import { createContext } from 'react';
import MovieStore from './movieStore';
import UserStore from './userStore';

configure({ enforceActions: 'always' });

export class RootStore {
	movieStore: MovieStore;
	userStore: UserStore;

	constructor() {
		this.movieStore = new MovieStore(this);
		this.userStore = new UserStore(this);
	}
}

export const RootStoreContext = createContext(new RootStore());
