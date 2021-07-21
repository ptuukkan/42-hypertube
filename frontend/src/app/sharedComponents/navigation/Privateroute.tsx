import React, { useContext, useEffect, useState } from 'react';
import {
	RouteProps,
	RouteComponentProps,
	Route,
	Redirect,
} from 'react-router-dom';
import { RootStoreContext } from '../../stores/rootStore';
import { observer } from 'mobx-react-lite';
import { Dimmer, Loader } from 'semantic-ui-react';

interface IProps extends RouteProps {
	component: React.ComponentType<RouteComponentProps<any>>;
}

const PrivateRoute: React.FC<IProps> = ({ component: Component, ...rest }) => {
	const rootStore = useContext(RootStoreContext);
	const { token, getNewToken, logOutBtnClicked } = rootStore.userStore;
	const [loading, setLoading] = useState(true);
	const [isMounted, setIsMounted] = useState(true);

	useEffect(() => {
		if (!isMounted) return;
		if (!token && !logOutBtnClicked && loading) {
			getNewToken()
				.then(() => setLoading(false))
				.catch(() => setLoading(false));
		} else setLoading(false);
		return () => setIsMounted(false);
	}, [token, loading, isMounted, logOutBtnClicked, getNewToken]);

	const errorStr = !logOutBtnClicked
		? '?error-token=Not+authorized.+Please+login+in.'
		: '';

	return (
		<Route
			{...rest}
			render={(props) =>
				loading ? (
					<Dimmer active page>
						<Loader content="Loading..." size="massive" />
					</Dimmer>
				) : token ? (
					<Component {...props} />
				) : (
					<Redirect to={`/login${errorStr}`} />
				)
			}
		/>
	);
};

export default observer(PrivateRoute);
