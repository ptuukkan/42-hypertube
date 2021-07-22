import React, { useContext, useEffect } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Link, useLocation } from 'react-router-dom';
import {
	Grid,
	Form,
	Header,
	Segment,
	Button,
	Message,
	Dimmer,
	Icon,
} from 'semantic-ui-react';
import ErrorMessage from 'app/sharedComponents/form/ErrorMessage';
import { observer } from 'mobx-react-lite';
import OAuthButtons from 'app/sharedComponents/form/OAuthButtons';
import TextInput from 'app/sharedComponents/form/TextInput';
import { useTranslation } from 'react-i18next';
import { getRegisterFormValidator } from 'app/sharedComponents/form/validators';
import { history } from 'index';
import { RootStoreContext } from 'app/stores/rootStore';

const Register: React.FC = () => {
	const { t } = useTranslation();
	const rootStore = useContext(RootStoreContext);
	const { registerUser, success } = rootStore.userStore;
	const queryParams = new URLSearchParams(useLocation().search);
	const CloseRegister = () => history.push('/');

	const formValidation = getRegisterFormValidator(t);

	useEffect(() => {
		// In order when on mobile scolled to bottom and this view is opened
		window.scrollTo(0, 0);
	}, []);

	const githubHasPrivateEmail = () => queryParams.get('username') !== null;

	return (
		<>
			{githubHasPrivateEmail() && (
				<Message style={{ marginTop: 80, marginBottom: -30 }} info>
					<Message.Header>{t('github_private_email_info')}</Message.Header>
				</Message>
			)}
			<FinalForm
				onSubmit={registerUser}
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
							<Grid.Column style={{ maxWidth: 450, marginBottom: 30 }}>
								<Header as="h2" color="teal" textAlign="center">
									{t('register_title')}
								</Header>
								<Segment stacked>
									<Field
										component={TextInput}
										name="email"
										placeholder={t('email')}
									/>
									<Field
										name="username"
										placeholder={t('username')}
										component={TextInput}
										defaultValue={queryParams.get('username')}
									/>
									<Field
										name="firstName"
										placeholder={t('first_name')}
										component={TextInput}
										defaultValue={queryParams.get('firstName')}
									/>
									<Field
										name="lastName"
										placeholder={t('last_name')}
										component={TextInput}
										defaultValue={queryParams.get('lastName')}
									/>
									<Field
										type="password"
										name="password"
										placeholder={t('password')}
										component={TextInput}
									/>
									{submitError && !dirtySinceLastSubmit && (
										<ErrorMessage message={submitError} />
									)}
									<Button disabled={submitting} color="teal" fluid size="large">
										{t('register')}
									</Button>
									<OAuthButtons disabled={submitting} />
								</Segment>
								<Message>
									{t('have_account')} <Link to="/login">{t('login')}</Link>
								</Message>
							</Grid.Column>
							<Dimmer active={success} onClickOutside={CloseRegister} page>
								<Header as="h2" icon inverted>
									<Icon name="heart" />
									{t('register_success_title')}
									<Header.Subheader>
										{t('register_success_description')}
									</Header.Subheader>
								</Header>
							</Dimmer>
						</Form>
					</Grid>
				)}
			/>
		</>
	);
};

export default observer(Register);
