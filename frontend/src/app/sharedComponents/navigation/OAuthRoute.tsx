import agent from 'app/services/agent';
import { LinkType } from 'app/stores/oAuthStore';
import { RootStoreContext } from 'app/stores/rootStore';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Route,
	Redirect,
	RouteProps,
	useLocation,
	useHistory,
} from 'react-router-dom';
import { Dimmer, Loader } from 'semantic-ui-react';

const OAuthRoute: React.FC<RouteProps> = ({ ...rest }) => {
	const { t } = useTranslation();
	const rootStore = useContext(RootStoreContext);
	const { setToken } = rootStore.userStore;
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(true);
	const [isMounted, setIsMounted] = useState(true);
	const queryParams = new URLSearchParams(useLocation().search);
	const code = queryParams.get('code');
	const state = queryParams.get('state');
	const linkType = rootStore.oAuthStore.consumeLinkClicked();
	const history = useHistory();

	useEffect(() => {
		if (!isMounted) return;
		if (code && state && linkType) {
			if (linkType === LinkType.GITHUB || linkType === LinkType.CODE_42) {
				agent.OAuth.verifyOAuthUser(linkType, code, state)
					.then((res) => {
						setToken(res.accessToken);
						setError(false);
					})
					.catch((err) => {
						console.log(err);
						// If email in github is private, needs to register manually
						if (err.response.data && err.response.data.message) {
							const data = err.response.data.message;
							const queryParams = Object.keys(data)
								.map((key) => `${key}=${encodeURI(data[key])}`)
								.join('&');
							history.push(`/register?${queryParams}`);
						}
					})
					.finally(() => setLoading(false));
			}
			return;
		} else setLoading(false);
		return () => setIsMounted(false);
	}, [code, linkType, setToken, state, isMounted, history]);

	return (
		<Route
			{...rest}
			render={() =>
				loading ? (
					<Dimmer active page>
						<Loader content={t('getting_data')} size="massive" />
					</Dimmer>
				) : error ? (
					<Redirect to="/?oauth-error=Authentication+failed,+try+again+later." />
				) : (
					<Redirect to="/movies" />
				)
			}
		/>
	);
};

export default OAuthRoute;
