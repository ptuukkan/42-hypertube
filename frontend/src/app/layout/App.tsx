import MainContent from 'app/views/MainContent';
import Register from 'app/views/Register';
import Navigation from '../sharedComponents/navigation/Navigation';
import Privateroute from '../sharedComponents/navigation/Privateroute';
import { Switch, Route } from 'react-router';
import { Container, Message } from 'semantic-ui-react';
import Login from '../views/Login';
import Forgot from 'app/views/Forgot';
import { useContext, useEffect, useState } from 'react';
import { RootStoreContext } from 'app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import ChangePassword from 'app/views/ChangePassword';
import MainContentPublic from 'app/views/MainContentPublic';
import { useLocation } from 'react-router-dom';

const App = () => {
	const rootStore = useContext(RootStoreContext);
	const { token } = rootStore.userStore;
	const [searchQuery, setSearchQuery] = useState('');
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
				<Privateroute
					path="/movies"
					component={(props) => (
						<MainContent
							{...props}
							setQuery={setSearchQuery}
							searchQuery={searchQuery}
						/>
					)}
				/>
				<Route
					path="/"
					render={(props) => <MainContentPublic {...props} token={token} />}
				/>
			</Switch>
		</Container>
	);
};

export default observer(App);
