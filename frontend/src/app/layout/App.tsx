import MainContent from 'app/Views/MainContent';
import Register from 'app/Views/Register';
import Navigation from '../SharedComponents/Navigation/Navigation';
import { Switch, Route } from 'react-router';
import { Container } from 'semantic-ui-react';
import Login from '../Views/Login';
import Forgot from 'app/Views/Forgot';
import { useContext, useState } from 'react';
import { RootStoreContext } from 'app/stores/rootStore';
import MainContentPublic from 'app/Views/MainContentPublic';
import { observer } from 'mobx-react-lite';

const App = () => {
	const rootStore = useContext(RootStoreContext);
	const { token } = rootStore.userStore;
	const [searchQuery, setSearchQuery] = useState('');

	if (token) {
		return (
			<Container>
				<Navigation
					token={token}
				/>
				<Switch>
					<Route
						path="/"
						render={(props) => (
							<MainContent
								{...props}
								setQuery={setSearchQuery}
								searchQuery={searchQuery}
							/>
						)}
					/>
				</Switch>
			</Container>
		);
	} else
		return (
			<Container>
				<Navigation
					token={token}
				/>
				<Switch>
					<Route path="/register" component={Register}/>
					<Route path="/login" component={Login} />
					<Route path="/forgot" component={Forgot} />
					<Route exact path="/" component={MainContentPublic} />
				</Switch>
			</Container>
		);
};

export default observer(App);
