import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../services/agent';
import { RootStore } from './rootStore';

export enum LinkType {
	GITHUB = 'github',
	CODE_42 = '42',
}

export default class OAuthStore {
	static ITEM_NAME = 'oAuthLink';
	rootStore: RootStore;
	linkGithub: string | null = null;
	link42: string | null = null;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	getLinks = async () => {
		try {
			const dataGithub = await agent.OAuth.getGithubLink();
			const data42 = await agent.OAuth.get42Link();
			runInAction(() => {
				this.linkGithub = dataGithub.link;
				this.link42 = data42.link;
			});
		} catch (e) {
			console.log(e);
		}
	};

	setLinkClicked = (type: LinkType) => {
		localStorage.setItem(OAuthStore.ITEM_NAME, type);
	};

	consumeLinkClicked = (): LinkType | null => {
		const type = localStorage.getItem(OAuthStore.ITEM_NAME) as LinkType | null;
		if (type) localStorage.removeItem(OAuthStore.ITEM_NAME);
		return type;
	};
}
