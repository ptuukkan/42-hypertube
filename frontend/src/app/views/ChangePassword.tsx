import { history } from '../..';
import { RootStoreContext } from 'app/stores/rootStore';
import React, { useContext, useEffect } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import {
	Button,
	Dimmer,
	Form,
	Grid,
	Header,
	Icon,
	Segment,
} from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { IResetPassword } from 'app/models/user';
import { observer } from 'mobx-react-lite';
import ErrorMessage from 'app/sharedComponents/form/ErrorMessage';
import TextInput from 'app/sharedComponents/form/TextInput';
import { useTranslation } from 'react-i18next';
import { getChangePasswordFormValidator } from 'app/sharedComponents/form/validators';

interface IParams {
	id: string;
}

const ChangePassword = () => {
	const { t } = useTranslation();
	const rootStore = useContext(RootStoreContext);
	const { success, sendResetPassword } = rootStore.userStore;
	const CloseChangePassword = () => history.push('/movies');
	const { id } = useParams<IParams>();

	const formValidation = getChangePasswordFormValidator(t);

	useEffect(() => {
		// In order when on mobile scolled to bottom and this view is opened
		window.scrollTo(0, 0);
	}, []);

	const onSubmit = async (
		data: IResetPassword
	): Promise<Record<string, any> | void> => await sendResetPassword(data, id);

	return (
		<FinalForm
			onSubmit={onSubmit}
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
								{t('enter_password')}
							</Header>
							<Segment stacked>
								<Field
									component={TextInput}
									name="password"
									type="password"
									placeholder={t('new_password')}
								/>
								{submitError && !dirtySinceLastSubmit && (
									<ErrorMessage message={submitError} />
								)}
								<Button color="teal" fluid size="large">
									{t('change')}
								</Button>
							</Segment>
						</Grid.Column>
						<Dimmer active={success} onClickOutside={CloseChangePassword} page>
							<Header as="h2" icon inverted>
								<Icon name="heart" />
								{t('password_changed')}
								<Header.Subheader>
									{t('you_will_be_logged_in')}
								</Header.Subheader>
							</Header>
						</Dimmer>
					</Form>
				</Grid>
			)}
		/>
	);
};

export default observer(ChangePassword);
