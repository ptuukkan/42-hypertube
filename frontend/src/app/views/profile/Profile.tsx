import React, { useContext, useEffect, useState } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import {
	Grid,
	Form,
	Header,
	Segment,
	Button,
	Dimmer,
	Icon,
	Loader,
	Message,
} from 'semantic-ui-react';
import ErrorMessage from 'app/sharedComponents/form/ErrorMessage';
import { observer } from 'mobx-react-lite';
import TextInput, {
	ITextInputProps,
} from 'app/sharedComponents/form/TextInput';
import { RootStoreContext } from 'app/stores/rootStore';
import UploadField from './UploadField';
import { IUser, IUpdateForm } from 'app/models/user';
import { useTranslation } from 'react-i18next';
import { FormApi, FORM_ERROR } from 'final-form';
import { getRegisterFormValidator } from 'app/sharedComponents/form/validators';

const Profile: React.FC = () => {
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(true);
	const [picFile, setPicFile] = useState<File | null>(null);
	const [user, setUser] = useState<IUser | null>(null);
	const [message, setMessage] = useState<null | string>(null);
	const rootStore = useContext(RootStoreContext);
	const { updateUser, getCurrentUser, success } = rootStore.userStore;

	useEffect(() => {
		getCurrentUser().then((res) => {
			if (res?.user) setUser(res.user);
			// TODO show toast that getting user failed!
			setIsLoading(false);
		});
	}, [getCurrentUser]);

	const formValidation = getRegisterFormValidator(t, true);

	const setFile = (file: File | null) => {
		setPicFile(file);
		if (file) setUser({ ...user, removePic: undefined } as IUser);
		if (!file && user?.profilePicName !== 'blank-profile.png') {
			setUser({
				...user,
				profilePicName: 'blank-profile.png',
				removePic: true,
			} as IUser);
		}
	};

	const onSubmit = async (
		data: IUpdateForm,
		form: FormApi
	): Promise<Record<string, any> | void> => {
		const values: IUpdateForm = {};

		if (user?.firstName !== data.firstName)
			values.firstName = data.firstName || '';
		if (user?.lastName !== data.lastName) values.lastName = data.lastName || '';
		if (user?.email !== data.email) values.email = data.email || '';
		if (user?.username !== data.username) values.username = data.username || '';
		if (data.password) values.password = data.password;
		if (picFile) values.profilePic = picFile;
		if (user?.removePic) values.removeProfilePic = 'REMOVE';

		if (Object.keys(values).length !== 0) {
			const formData = new FormData();
			Object.keys(values).forEach((key) => formData.append(key, values[key]));

			const res = await updateUser(formData);
			if (!res.user) return res; // Error
			setUser(res.user as IUser);
			setPicFile(null);
			form.change('password', undefined);
			setMessage(t('profile_change_success'));
			setTimeout(() => {
				window.scrollTo(0, 0);
			}, 0);
			setTimeout(() => setMessage(null), 4000);
		} else {
			return { [FORM_ERROR]: t('profile_no_change') };
		}
	};

	return (
		<>
			{message && (
				<Message style={{ marginTop: 80, marginBottom: -30 }} success>
					<Message.Header>{message}</Message.Header>
				</Message>
			)}
			{isLoading && (
				<Dimmer active page>
					<Loader content={t('getting_user')} size="massive" />
				</Dimmer>
			)}
			{!isLoading && (
				<FinalForm
					onSubmit={onSubmit}
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
										{t('update_title')}
									</Header>
									<Segment stacked>
										<Form.Group widths="equal">
											<Field
												name="firstName"
												placeholder={t('first_name')}
												initialValue={user?.firstName}
											>
												{(props: ITextInputProps) => (
													<TextInput {...props} label={t('first_name')} />
												)}
											</Field>
											<Field
												name="lastName"
												placeholder={t('last_name')}
												initialValue={user?.lastName}
											>
												{(props: ITextInputProps) => (
													<TextInput {...props} label={t('last_name')} />
												)}
											</Field>
										</Form.Group>
										<Field
											name="username"
											placeholder={t('username')}
											defaultValue={user?.username}
										>
											{(props: ITextInputProps) => (
												<TextInput {...props} label={t('username')} />
											)}
										</Field>
										<Field
											name="email"
											placeholder={t('email')}
											defaultValue={user?.email}
										>
											{(props: ITextInputProps) => (
												<TextInput {...props} label={t('email')} />
											)}
										</Field>
										<Field
											name="password"
											placeholder={t('new_password')}
											type="password"
										>
											{(props: ITextInputProps) => (
												<TextInput {...props} label={t('new_password')} />
											)}
										</Field>
										<UploadField
											fileName={user?.profilePicName || 'blank-profile.png'}
											setImgFile={setFile}
										/>
										{submitError && !dirtySinceLastSubmit && (
											<ErrorMessage message={submitError} />
										)}
										<Button
											disabled={submitting}
											color="teal"
											fluid
											size="large"
										>
											{t('update')}
										</Button>
									</Segment>
								</Grid.Column>
								<Dimmer active={success} page>
									<Header as="h2" icon inverted>
										<Icon name="heart" />
										{t('update_success')}
									</Header>
								</Dimmer>
							</Form>
						</Grid>
					)}
				/>
			)}
		</>
	);
};

export default observer(Profile);
