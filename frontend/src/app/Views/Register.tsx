import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Validators } from '@lemoncode/fonk';
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

const validationSchema = {
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

export interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
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
								<Image src="/logo_128.png" /> Register your account
							</Header>
							<Segment stacked>
								<Field
									component={TextInput}
									name="email"
									placeholder="Email address"
								/>
								<Field
									name="username"
									placeholder="Username"
									component={TextInput}
								/>
								<Field
									name="firstName"
									placeholder="First name"
									component={TextInput}
								/>
								<Field
									name="lastName"
									placeholder="Last name"
									component={TextInput}
								/>
								<Field
									type="password"
									name="password"
									placeholder="Password"
									component={TextInput}
								/>
								{submitError && !dirtySinceLastSubmit && (
									<ErrorMessage message={submitError} />
								)}
								<Button disabled={submitting} color="teal" fluid size="large">
									Register
								</Button>
							</Segment>
							<Message>
								Have account? <Link to="/login">Login</Link>
							</Message>
						</Grid.Column>
						<Dimmer active={success} onClickOutside={CloseRegister} page>
							<Header as="h2" icon inverted>
								<Icon name="heart" />
								Registeration success!
								<Header.Subheader>please check your email!</Header.Subheader>
							</Header>
						</Dimmer>
					</Form>
				</Grid>
			)}
		/>
	);
};

export default observer(Register);
