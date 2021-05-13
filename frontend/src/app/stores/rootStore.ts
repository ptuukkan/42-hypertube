import { configure } from 'mobx';
import { createContext } from 'react';
import MovieStore from './movieStore';

configure({ enforceActions: 'always' });

export class RootStore {
	movieStore: MovieStore;


	constructor() {
		this.movieStore = new MovieStore(this);

	}
}

export const RootStoreContext = createContext(new RootStore());