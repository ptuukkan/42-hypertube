import React, { useContext, useEffect, useState } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import {
	Grid,
	Form,
	Header,
	Segment,
	Button,
	Dimmer,
	Icon,
	Loader,
} from 'semantic-ui-react';
import { updatePasswordComplexity } from 'app/sharedComponents/form/validators/passwordComplexity';
import ErrorMessage from 'app/sharedComponents/form/ErrorMessage';
import { observer } from 'mobx-react-lite';
import TextInput, {
	ITextInputProps,
} from 'app/sharedComponents/form/TextInput';
import { RootStoreContext } from 'app/stores/rootStore';
import UploadBtn from './UploadBtn';
import { IUser, IUpdateForm } from 'app/models/user';

const validationSchema = {
	field: {
		email: [Validators.required.validator, Validators.email.validator],
		password: [
			{
				validator: updatePasswordComplexity,
			},
		],
	},
};

const formValidation = createFinalFormValidation(validationSchema);

const Profile: React.FC = () => {
	const [picFile, setPicFile] = useState<File | null>(null);
	const [user, setUser] = useState<IUser | null>(null);
	const rootStore = useContext(RootStoreContext);
	const { updateUser, getUser, success } = rootStore.userStore;

	useEffect(() => {
		getUser().then((res) => {
			if (res?.user) setUser(res.user);
		});
	}, [getUser]);

	const onSubmit = (data: IUpdateForm) => {
		const values: IUpdateForm = {};
		if (user?.firstName !== data.firstName) values.firstName = data.firstName;
		if (user?.lastName !== data.lastName) values.lastName = data.lastName;
		if (user?.email !== data.email) values.email = data.email;
		if (user?.username !== data.username) values.username = data.username;
		if (data.password) values.password = data.firstName;
		if (picFile) values.profilePic = picFile;
		if (Object.keys(values).length) {
			const formData = new FormData();
			Object.keys(values).forEach((key) => formData.append(key, values[key]));
			console.log(values);
			formData.forEach((data) => console.log(data));
		} else {
			// TODO let know of error
			console.log('NO CHANGE');
		}
	};

	return (
		<>
			{!user && (
				<Dimmer active page>
					<Loader content="Getting user..." size="massive" />
				</Dimmer>
			)}
			{user && (
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
										Update your profile
									</Header>
									<Segment stacked>
										<Form.Group widths="equal">
											<Field
												name="firstName"
												placeholder="First name"
												initialValue={user.firstName}
											>
												{(props: ITextInputProps) => (
													<TextInput {...props} label="First name" />
												)}
											</Field>
											<Field
												name="lastName"
												placeholder="Last name"
												initialValue={user.lastName}
											>
												{(props: ITextInputProps) => (
													<TextInput {...props} label="Last name" />
												)}
											</Field>
										</Form.Group>
										<Field
											name="username"
											placeholder="Username"
											defaultValue={user.username}
										>
											{(props: ITextInputProps) => (
												<TextInput {...props} label="Username" />
											)}
										</Field>
										<Field
											name="email"
											placeholder="Email"
											defaultValue={user.email}
										>
											{(props: ITextInputProps) => (
												<TextInput {...props} label="Email" />
											)}
										</Field>
										<Field
											name="password"
											placeholder="New Password"
											type="password"
										>
											{(props: ITextInputProps) => (
												<TextInput {...props} label="New Password" />
											)}
										</Field>
										<UploadBtn
											fileName={user.profilePicName}
											setImgFile={setPicFile}
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
											Update
										</Button>
									</Segment>
								</Grid.Column>
								<Dimmer active={success} page>
									<Header as="h2" icon inverted>
										<Icon name="heart" />
										Update was a success!
										<Header.Subheader>
											please check your email!
										</Header.Subheader>
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
