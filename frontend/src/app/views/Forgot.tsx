import React, { useContext, useEffect } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import {
	Grid,
	Form,
	Header,
	Segment,
	Button,
	Dimmer,
	Icon,
} from 'semantic-ui-react';
import { history } from 'index';
import TextInput from 'app/sharedComponents/form/TextInput';
import ErrorMessage from 'app/sharedComponents/form/ErrorMessage';
import { RootStoreContext } from 'app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { getForgotPasswordFormValidator } from 'app/sharedComponents/form/validators';

const Forgot = () => {
	const { t } = useTranslation();
	const rootStore = useContext(RootStoreContext);
	const { forgetPassword, success } = rootStore.userStore;
	const CloseForgot = () => history.push('/');

	const formValidation = getForgotPasswordFormValidator(t);

	useEffect(() => {
		// In order when on mobile scolled to bottom and this view is opened
		window.scrollTo(0, 0);
	}, []);

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
								{t('request_password')}
							</Header>
							<Segment stacked>
								<Field
									component={TextInput}
									name="email"
									placeholder={t('email')}
								/>
								{submitError && !dirtySinceLastSubmit && (
									<ErrorMessage message={submitError} />
								)}
								<Button color="teal" fluid size="large">
									{t('request')}
								</Button>
							</Segment>
						</Grid.Column>
						<Dimmer active={success} onClickOutside={CloseForgot} page>
							<Header as="h2" icon inverted>
								<Icon name="heart" />
								{t('request_success_title')}
								<Header.Subheader>
									{t('request_success_description')}
								</Header.Subheader>
							</Header>
						</Dimmer>
					</Form>
				</Grid>
			)}
		/>
	);
};

export default observer(Forgot);
