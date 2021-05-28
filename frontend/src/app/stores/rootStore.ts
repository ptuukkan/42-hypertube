import { configure } from 'mobx';
import { createContext } from 'react';
import MovieStore from './movieStore';
import OAuthStore from './oAuthStore';
import UserStore from './userStore';

configure({ enforceActions: 'always' });

export class RootStore {
	movieStore: MovieStore;
	userStore: UserStore;
	oAuthStore: OAuthStore;

	constructor() {
		this.movieStore = new MovieStore(this);
		this.userStore = new UserStore(this);
		this.oAuthStore = new OAuthStore(this);
	}
}

export const RootStoreContext = createContext(new RootStore());
