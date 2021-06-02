import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from 'app/stores/rootStore';
import { Menu } from 'semantic-ui-react';

const PrivateMenuItems: React.FC = () => {
	const rootStore = useContext(RootStoreContext);
	const { logoutUser } = rootStore.userStore;

	return (
		<Menu.Menu position="right">
			<Menu.Item as={Link} to="/my_profile">
				My Profile
			</Menu.Item>
			<Menu.Item onClick={logoutUser}>Logout</Menu.Item>
		</Menu.Menu>
	);
};

export default PrivateMenuItems;
