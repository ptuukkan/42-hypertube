import { IUser } from 'app/models/user';
import { RootStoreContext } from 'app/stores/rootStore';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Modal,
	Image,
	Header,
	Dimmer,
	Loader,
	Button,
} from 'semantic-ui-react';

interface IProps {
	show: boolean;
	usersId: string;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const UsersProfileModal: React.FC<IProps> = ({ show, usersId, setShow }) => {
	const { t } = useTranslation();
	const rootStore = useContext(RootStoreContext);
	const { getUsersProfile } = rootStore.userStore;
	const [user, setUser] = useState<IUser | null>(null);

	useEffect(() => {
		if (show && (!user || user._id !== usersId)) {
			getUsersProfile(usersId).then((res) => {
				if (res?.user) {
					setUser(res.user);
				} else {
					// TODO show toast that fetching failed and close modal!
				}
			});
		}
	}, [show, usersId, getUsersProfile, user]);

	return (
		<>
			{show && !user && (
				<Dimmer active>
					<Loader size="massive">{t('getting_user')}</Loader>
				</Dimmer>
			)}
			{show && user && (
				<Modal
					onClose={() => setShow(false)}
					open={show}
					size="tiny"
					closeIcon
					closeOnDimmerClick={false}
				>
					<Header>
						{user.firstName} {user.lastName} - {user.username}
					</Header>
					<Modal.Content>
						<Image
							size="medium"
							src={`http://localhost:8080/profileImages/${user.profilePicName}`}
							centered
						/>
					</Modal.Content>
					<Modal.Actions>
						<Button
							content={t('close')}
							color="teal"
							onClick={() => setShow(false)}
						/>
					</Modal.Actions>
				</Modal>
			)}
		</>
	);
};

export default UsersProfileModal;
