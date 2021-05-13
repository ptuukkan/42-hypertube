import MainContent from 'app/Views/MainContent';
import Register from 'app/Views/Register';
import Navigation from '../SharedComponents/Navigation/Navigation';
import { Switch, Route } from 'react-router';
import { Container } from 'semantic-ui-react';
import Login from '../Views/Login';
import Forgot from 'app/Views/Forgot';
import { useState } from 'react';

const App = () => {
	const [searchQuery, setSearchQuery] = useState('');
	return (
		<Container>
			<Navigation setQuery={setSearchQuery} searchQuery={searchQuery} />
			<Switch>
				<Route path="/register" component={Register} />
				<Route path="/login" component={Login} />
				<Route path="/forgot" component={Forgot} />
				<Route
					exact
					path="/"
					render={(props) => (
						<MainContent {...props} searchQuery={searchQuery} />
					)}
				/>
			</Switch>
		</Container>
	);
};

export default App;
