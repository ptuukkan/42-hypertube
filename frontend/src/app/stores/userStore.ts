import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../services/agent';
import { ILoginFormValues, IRegisterFormValues, IUser } from '../models/user';
import { RootStore } from './rootStore';
import { history } from '../..';
import { FORM_ERROR } from 'final-form';
const RegErrorTypes = [
	'username',
	'email',
	'firstname',
	'lastname',
	'password',
];

export default class UserStore {
	rootStore: RootStore;
	loading = false;
	success = false;
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

	setSuccess = () => {
		this.success = true;
		setTimeout(() => {
			this.success = !this.success;
		}, 3000);
	};

	registerUser = async (data: IRegisterFormValues) => {
		try {
			await agent.User.register(data);
			this.setSuccess();
		} catch (error) {
			if (error.response.data.message === 'Invalid data') {
				return error.response.data.errors.reduce((obj: any, item: string) => {
					RegErrorTypes.forEach((error) => {
						if (item.includes(error)) {
							obj[error] = item;
						}
					});
					return obj;
				}, {});
			}
			return { [FORM_ERROR]: error.response.data.errors };
		}
	};

	loginUser = async (data: ILoginFormValues) => {
		try {
			const user = await agent.User.login(data);
			this.setToken(user.accessToken);
			runInAction(() => {
				this.user = user;
			});
			history.push('/');
		} catch (error) {
			return { [FORM_ERROR]: error.response.data.message };
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
