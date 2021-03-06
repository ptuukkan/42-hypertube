import React, { useContext, useEffect } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import {
	Grid,
	Form,
	Header,
	Segment,
	Button,
	Message,
	Divider,
} from 'semantic-ui-react';
import TextInput from 'app/sharedComponents/form/TextInput';
import { RootStoreContext } from 'app/stores/rootStore';
import ErrorMessage from 'app/sharedComponents/form/ErrorMessage';
import OAuthButtons from 'app/sharedComponents/form/OAuthButtons';
import { useTranslation } from 'react-i18next';
import { getLoginFormValidator } from 'app/sharedComponents/form/validators';

const Login: React.FC = () => {
	const { t } = useTranslation();
	const rootStore = useContext(RootStoreContext);
	const { loginUser } = rootStore.userStore;

	const formValidation = getLoginFormValidator(t);

	useEffect(() => {
		// In order when on mobile scolled to bottom and this view is opened
		window.scrollTo(0, 0);
	}, []);

	return (
		<FinalForm
			onSubmit={loginUser}
			validate={formValidation.validateForm}
			render={({
				handleSubmit,
				submitting,
				submitError,
				dirtySinceLastSubmit,
			}) => (
				<Grid
					textAlign="center"
					style={{ height: '100vh', marginTop: 60 }}
					verticalAlign="middle"
				>
					<Form onSubmit={handleSubmit} error size="large">
						<Grid.Column style={{ maxWidth: 450 }}>
							<Header as="h2" color="teal" textAlign="center">
								{t('login')}
							</Header>
							<Segment stacked>
								<Field
									component={TextInput}
									name="username"
									placeholder={t('username')}
								/>
								<Field
									component={TextInput}
									type="password"
									name="password"
									placeholder={t('password')}
								/>
								{submitError && !dirtySinceLastSubmit && (
									<ErrorMessage message={submitError} />
								)}
								<Button disabled={submitting} color="teal" fluid size="large">
									{t('login')}
								</Button>
								<OAuthButtons disabled={submitting} />
							</Segment>
							<Message>
								{t('need_account')} <Link to="/register">{t('register')}</Link>
								<Divider />
								{t('forgot_password')} <Link to="/forgot">{t('reset')}</Link>
							</Message>
						</Grid.Column>
					</Form>
				</Grid>
			)}
		/>
	);
};

export default Login;
