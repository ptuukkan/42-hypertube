import TextInput from 'app/SharedComponents/form/TextInput';
import React from 'react';
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
} from 'semantic-ui-react';
import { passwordComplexity } from 'app/SharedComponents/form/validators/passwordComplexity';
import ErrorMessage from 'app/SharedComponents/form/ErrorMessage';

const validationSchema = {
	field: {
		emailAddress: [Validators.required.validator, Validators.email.validator],
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
	return (
		<FinalForm
			onSubmit={(d) => console.log(d)}
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
									name="emailAddress"
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
								<Button color="teal" fluid size="large">
									Register
								</Button>
							</Segment>
							<Message>
								Have account? <Link to="/login">Login</Link>
							</Message>
						</Grid.Column>
					</Form>
				</Grid>
			)}
		/>
	);
};

export default Register;
