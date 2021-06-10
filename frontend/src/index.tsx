import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/layout/App';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import './translations/i18n';

export const history = createBrowserHistory();

ReactDOM.render(
	<Router history={history}>
		<App />
	</Router>,
	document.getElementById('root')
);
