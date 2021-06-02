import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import {
	Grid,
	Form,
	Header,
	Image,
	Segment,
	Button,
	Dimmer,
	Icon,
} from 'semantic-ui-react';
import { history } from '../..';
import TextInput from 'app/sharedComponents/form/TextInput';
import ErrorMessage from 'app/sharedComponents/form/ErrorMessage';
import { RootStoreContext } from '../stores/rootStore';
import { observer } from 'mobx-react-lite';

const validationSchema = {
	field: {
		email: [Validators.required.validator, Validators.email.validator],
	},
};

const formValidation = createFinalFormValidation(validationSchema);

const Forgot = () => {
	const rootStore = useContext(RootStoreContext);
	const { forgetPassword, success } = rootStore.userStore;
	const CloseForgot = () => history.push('/');
	return (
		<FinalForm
			onSubmit={forgetPassword}
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
								<Image src="/logo_128.png" />
								Restore your password
							</Header>
							<Segment stacked>
								<Field
									component={TextInput}
									name="email"
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
						<Dimmer active={success} onClickOutside={CloseForgot} page>
							<Header as="h2" icon inverted>
								<Icon name="heart" />
								Restore link is on it&apos;s way...!
								<Header.Subheader>just wait...!</Header.Subheader>
							</Header>
						</Dimmer>
					</Form>
				</Grid>
			)}
		/>
	);
};

export default observer(Forgot);
