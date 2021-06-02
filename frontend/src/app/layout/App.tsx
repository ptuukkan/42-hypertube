import React from 'react';
import MainContent from 'app/views/MainContent';
import Register from 'app/views/Register';
import Navigation from '../sharedComponents/navigation/Navigation';
import Privateroute from '../sharedComponents/navigation/Privateroute';
import { Switch, Route } from 'react-router';
import { Container, Message } from 'semantic-ui-react';
import { useContext, useEffect, useState } from 'react';
import { RootStoreContext } from 'app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import NotFound from 'app/views/NotFound';
import OAuthRoute from 'app/sharedComponents/navigation/OAuthRoute';
import ChangePassword from 'app/views/ChangePassword';
import Forgot from 'app/views/Forgot';
import Login from 'app/views/Login';
import MainContentPublic from 'app/views/MainContentPublic';
import Movie from 'app/views/Movie';

const App = () => {
	const rootStore = useContext(RootStoreContext);
	const { token } = rootStore.userStore;
	const [message, setMessage] = useState('');
	const search = useLocation().search;
	const urlParams = new URLSearchParams(search);
	const emailStatus = urlParams.get('confirm-email');
	const oAuthError = urlParams.get('oauth-error');

	useEffect(() => {
		if (emailStatus) {
			emailStatus === 'success' && setMessage('Email confirm success!');
			emailStatus === 'error' && setMessage('Email confirm failed!');
			setTimeout(() => setMessage(''), 4000);
		}
	}, [emailStatus]);

	useEffect(() => {
		if (oAuthError) {
			setMessage(oAuthError);
			setTimeout(() => setMessage(''), 4000);
		}
	}, [oAuthError]);

	return (
		<Container>
			<Navigation token={token} />
			{message !== '' && (
				<Message
					style={{ marginTop: 65 }}
					success={emailStatus === 'success'}
					negative={emailStatus === 'error' || oAuthError !== null}
				>
					{message}
				</Message>
			)}
			<Switch>
				<Route path="/register" component={Register} />
				<Route path="/login" component={Login} />
				<Route path="/forgot" component={Forgot} />
				<Route path="/reset-password/:id" component={ChangePassword} />
				<OAuthRoute exact path="/oauth" />
				<Privateroute path="/movies/:id" component={Movie} />
				<Privateroute
					path="/movies"
					component={(props) => <MainContent {...props} />}
				/>
				<Route
					exact
					path="/"
					render={(props) => <MainContentPublic {...props} token={token} />}
				/>
				<Route component={NotFound} />
			</Switch>
		</Container>
	);
};

export default observer(App);
