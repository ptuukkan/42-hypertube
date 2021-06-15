import { history } from '../..';
import { RootStoreContext } from 'app/stores/rootStore';
import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import {
	Button,
	Dimmer,
	Form,
	Grid,
	Header,
	Icon,
	Image,
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
	const CloseChangePassword = () => history.push('/');
	const { id } = useParams<IParams>();

	const formValidation = getChangePasswordFormValidator(t);

	const onSubmit = (data: IResetPassword) => {
		sendResetPassword(data, id);
	};

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
								<Image src="/logo_128.png" />
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
								<Header.Subheader>{t('you_can_login')}</Header.Subheader>
							</Header>
						</Dimmer>
					</Form>
				</Grid>
			)}
		/>
	);
};

export default observer(ChangePassword);
