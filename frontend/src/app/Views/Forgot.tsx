import { Form as FinalForm, Field } from 'react-final-form';
import { Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import { Grid, Form, Header, Image, Segment, Button } from 'semantic-ui-react';
import TextInput from 'app/SharedComponents/form/TextInput';
import ErrorMessage from 'app/SharedComponents/form/ErrorMessage';

const validationSchema = {
	field: {
		emailAddress: [Validators.required.validator, Validators.email.validator],
	},
};

const formValidation = createFinalFormValidation(validationSchema);

const Forgot = () => {
	return (
		<FinalForm
			onSubmit={(d) => console.log(d)}
			validate={formValidation.validateForm}
			render={({ handleSubmit, submitError, dirtySinceLastSubmit }) => (
				<Grid
					textAlign="center"
					style={{ height: '100vh', marginTop: 60 }}
					verticalAlign="middle"
				>
					<Form onSubmit={handleSubmit} error size="large">
						<Grid.Column style={{ maxWidth: 450 }}>
							<Header as="h2" color="teal" textAlign="center">
								<Image src="/logo_128.png" /> Restore your password
							</Header>
							<Segment stacked>
								<Field
									component={TextInput}
									name="emailAddress"
									placeholder="Email address"
								/>
								{submitError && !dirtySinceLastSubmit && (
									<ErrorMessage message={submitError} />
								)}
								<Button color="teal" fluid size="large">
									Restore
								</Button>
							</Segment>
						</Grid.Column>
					</Form>
				</Grid>
			)}
		/>
	);
};

export default Forgot;
