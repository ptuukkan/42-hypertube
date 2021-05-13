import MainContent from 'app/Views/MainContent';
import Register from 'app/Views/Register';
import Navigation from '../SharedComponents/Navigation/Navigation'
import { Switch, Route } from 'react-router';
import { Container } from 'semantic-ui-react';
import Login from '../Views/Login';
import Forgot from 'app/Views/Forgot';

const App = () => {
	return (
		<Container>
			<Navigation />
			<Switch>
				<Route path="/register" component={Register} />
				<Route path="/login" component={Login} />
				<Route path="/forgot" component={Forgot} />
				<Route exact path="/" component={MainContent} />
			</Switch>
		</Container>
	);
};

export default App;
