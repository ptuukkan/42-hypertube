import React from 'react';
import { Switch, Route } from 'react-router';
import { Container } from 'semantic-ui-react';
import Login from './Login';
import MainContent from './MainContent';
import Navigation from './Navigation';
import Register from './Register';


const App = () => {
	return (
		<Container>
			<Navigation />
			<Switch>
				<Route path="/register" component={Register} />
				<Route path="/login" component={Login} />
				<Route exact path="/" component={MainContent} />
			</Switch>
			
		</Container>
	);
};

export default App;
