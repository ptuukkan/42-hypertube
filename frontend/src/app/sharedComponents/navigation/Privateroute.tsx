import React, { useContext } from 'react';
import {
	RouteProps,
	RouteComponentProps,
	Route,
	Redirect,
} from 'react-router-dom';
import { RootStoreContext } from '../../stores/rootStore';
import { observer } from 'mobx-react-lite';

interface IProps extends RouteProps {
	component: React.ComponentType<RouteComponentProps<any>>;
}

const PrivateRoute: React.FC<IProps> = ({ component: Component, ...rest }) => {
	const rootStore = useContext(RootStoreContext);
	const { token } = rootStore.userStore;

	return (
		<Route
			{...rest}
			render={
				(props) => {
					if (token) {
						return <Component {...props} />;
					} else {
						return <Redirect to={'/'} />;
					}
				}
			}
		/>
	);
};

export default observer(PrivateRoute);