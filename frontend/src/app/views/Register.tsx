import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import { history } from '../..';
import { Link } from 'react-router-dom';
import {
	Grid,
	Form,
	Header,
	Image,
	Segment,
	Button,
	Message,
	Dimmer,
	Icon,
} from 'semantic-ui-react';
import { passwordComplexity } from 'app/sharedComponents/form/validators/passwordComplexity';
import { RootStoreContext } from '../stores/rootStore';
import ErrorMessage from 'app/sharedComponents/form/ErrorMessage';
import { observer } from 'mobx-react-lite';
import OAuthButtons from 'app/sharedComponents/form/OAuthButtons';
import TextInput from 'app/sharedComponents/form/TextInput';
import { useTranslation } from 'react-i18next';

// TODO add others required too! + move to component so can translate!
const validationSchema: ValidationSchema = {
	field: {
		email: [Validators.required.validator, Validators.email.validator],
		password: [
			Validators.required.validator,
			{
				validator: passwordComplexity,
			},
		],
	},
};

const formValidation = createFinalFormValidation(validationSchema);

const Register: React.FC = () => {
	const { t } = useTranslation();
	const rootStore = useContext(RootStoreContext);
	const { registerUser, success } = rootStore.userStore;
	const CloseRegister = () => history.push('/');

	return (
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
						<Grid.Column style={{ maxWidth: 450 }}>
							<Header as="h2" color="teal" textAlign="center">
								<Image src="/logo_128.png" />
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
								/>
								<Field
									name="firstName"
									placeholder={t('first_name')}
									component={TextInput}
								/>
								<Field
									name="lastName"
									placeholder={t('last_name')}
									component={TextInput}
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
	);
};

export default observer(Register);
