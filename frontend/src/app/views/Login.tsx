import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import { Link } from 'react-router-dom';
import {
	Grid,
	Form,
	Header,
	Image,
	Segment,
	Button,
	Message,
	Divider,
} from 'semantic-ui-react';
import { passwordComplexity } from 'app/sharedComponents/form/validators/passwordComplexity';
import TextInput from 'app/sharedComponents/form/TextInput';
import { RootStoreContext } from '../stores/rootStore';
import ErrorMessage from 'app/sharedComponents/form/ErrorMessage';
import OAuthButtons from 'app/sharedComponents/form/OAuthButtons';
import { useTranslation } from 'react-i18next';

// TODO move to component so can translate!
const validationSchema = {
	field: {
		username: [Validators.required.validator],
		password: [
			Validators.required.validator,
			{
				validator: passwordComplexity,
			},
		],
	},
};

const formValidation = createFinalFormValidation(validationSchema);

const Login: React.FC = () => {
	const { t } = useTranslation();
	const rootStore = useContext(RootStoreContext);
	const { loginUser } = rootStore.userStore;

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
								<Image src="/logo_128.png" />
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
