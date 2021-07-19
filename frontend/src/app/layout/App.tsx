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
import Landing from 'app/views/landing/Landing';
import Movie from 'app/views/movieDetails/Movie';
import Profile from 'app/views/profile/Profile';

const App = () => {
	const rootStore = useContext(RootStoreContext);
	const { token } = rootStore.userStore;
	const [message, setMessage] = useState('');
	const search = useLocation().search;
	const urlParams = new URLSearchParams(search);
	const emailStatus = urlParams.get('confirm-email');
	const oAuthError = urlParams.get('oauth-error');
	const tokenError = urlParams.get('error-token');

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

	useEffect(() => {
		if (tokenError) {
			setMessage(tokenError);
			setTimeout(() => setMessage(''), 4000);
		}
	}, [tokenError]);

	const isMessageNegative =
		emailStatus === 'error' || oAuthError !== null || tokenError !== null;

	return (
		<Container>
			<Navigation token={token} />
			{message !== '' && (
				<Message
					style={{ marginTop: 80, marginBottom: -30 }}
					success={emailStatus === 'success'}
					negative={isMessageNegative}
				>
					{message}
				</Message>
			)}
			<Switch>
				<Route path="/register" component={Register} />
				<Route path="/login" component={Login} />
				<Route path="/forgot" component={Forgot} />
				<Route path="/reset-password/:id" component={ChangePassword} />
				<OAuthRoute path="/oauth" />
				<Privateroute path="/profile" component={Profile} />
				<Privateroute path="/movies/:id" component={Movie} />
				<Privateroute path="/movies" component={MainContent} />
				<Route exact path="/" component={Landing} />
				<Route component={NotFound} />
			</Switch>
		</Container>
	);
};

export default observer(App);
