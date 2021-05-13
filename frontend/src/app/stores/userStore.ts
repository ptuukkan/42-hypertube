import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../services/agent';
import { ILoginFormValues, IRegisterFormValues, IUser } from '../models/user';
import { RootStore } from './rootStore';
import { history } from '../..';
import { FORM_ERROR } from 'final-form';

export default class UserStore {
	rootStore: RootStore;
	loading = false;
	token: string | null = window.localStorage.getItem('jwt');
	user: IUser | null = null;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	stopLoading = () => {
		this.loading = false;
	};

	logoutUser = () => {
		this.token = null;
		this.user = null;
		window.localStorage.removeItem('jwt');
	};

	setToken = (token: string) => {
		this.token = token;
		window.localStorage.setItem('jwt', this.token);
	};

	registerUser = async (data: IRegisterFormValues) => {
		try {
			await agent.User.register(data);
		} catch (error) {
			if (error.error_type === 'ValidationError') {
				/* 				return error.errors.reduce((obj: any, item: IValidationError) => {
					obj[item.field] = item.message;
					return obj;
				}, {}); */
			}
			return { [FORM_ERROR]: error.message };
		}
	};

	loginUser = async (data: ILoginFormValues) => {
		try {
			const user = await agent.User.login(data);
			/* 			this.setToken(user.token);
			runInAction(() => {
				this.user = user;
			}); */
			history.push('/');
		} catch (error) {
			return { [FORM_ERROR]: error.message };
		}
	};

	getUser = async () => {
		try {
			/* 			const user = await agent.User.current(location);
			 */
			/* runInAction(() => {
				this.user = user;
			}); */
		} catch (error) {
			console.log(error);
			throw error;
		}
	};
}
