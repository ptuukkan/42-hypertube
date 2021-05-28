import { Switch, Route } from 'react-router';
import { Container, Message } from 'semantic-ui-react';
import { useContext, useEffect, useState } from 'react';
import { RootStoreContext } from 'app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import Navigation from 'app/SharedComponents/Navigation/Navigation';
import Privateroute from 'app/SharedComponents/Navigation/Privateroute';
import ChangePassword from 'app/Views/ChangePassword';
import Forgot from 'app/Views/Forgot';
import Login from 'app/Views/Login';
import MainContent from 'app/Views/MainContent';
import MainContentPublic from 'app/Views/MainContentPublic';
import NotFound from 'app/Views/NotFound';
import Register from 'app/Views/Register';
import Movie from 'app/Views/Movie';

const App = () => {
	const rootStore = useContext(RootStoreContext);
	const { token } = rootStore.userStore;
	const [message, setMessage] = useState('');
	const search = useLocation().search;
	const emailStatus = new URLSearchParams(search).get('confirm-email');

	useEffect(() => {
		if (emailStatus !== '') {
			emailStatus === 'success' && setMessage('Email confirm success!');
			emailStatus === 'error' && setMessage('Email confirm failed!');
			setTimeout(() => {
				setMessage('');
			}, 3000);
		}
	}, [emailStatus]);

	return (
		<Container>
			<Navigation token={token} />
			{message !== '' && (
				<Message
					style={{ marginTop: 65 }}
					success={emailStatus === 'success'}
					warning={emailStatus === 'error'}
				>
					{message}
				</Message>
			)}
			<Switch>
				<Route path="/register" component={Register} />
				<Route path="/login" component={Login} />
				<Route path="/forgot" component={Forgot} />
				<Route path="/reset-password/:id" component={ChangePassword} />
				<Privateroute path="/movies/:id" component={() => <Movie />} />
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
