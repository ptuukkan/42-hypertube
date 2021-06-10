import React, { useEffect, useContext, useState } from 'react';
import {
	Button,
	Dimmer,
	Divider,
	Icon,
	Image,
	Loader,
} from 'semantic-ui-react';
import { RootStoreContext } from 'app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { LinkType } from 'app/stores/oAuthStore';

interface IProps {
	disabled: boolean;
}

const OAuthButtons: React.FC<IProps> = ({ disabled }) => {
	const rootStore = useContext(RootStoreContext);
	const { link42, linkGithub, getLinks, setLinkClicked } = rootStore.oAuthStore;
	const [showDimmer, setShowDimmer] = useState(false);

	useEffect(() => {
		if (!link42 && !linkGithub) getLinks();
	}, [getLinks, link42, linkGithub]);

	const clickedGithub = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		setLinkClicked(LinkType.GITHUB);
		setShowDimmer(true);
		window.location.href = linkGithub!;
	};

	const clicked42 = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		setLinkClicked(LinkType.CODE_42);
		setShowDimmer(true);
		window.location.href = link42!;
	};

	return (
		<>
			<Divider horizontal>Or</Divider>
			<Button
				disabled={disabled || !linkGithub}
				fluid
				basic
				color="teal"
				size="large"
				onClick={clickedGithub}
			>
				<Icon name="github" color="black" />
				Continue with Github
			</Button>
			<Divider hidden fitted />
			<Button
				disabled={disabled || !link42}
				fluid
				basic
				color="teal"
				size="large"
				onClick={clicked42}
			>
				<Image src="/42_logo.png" style={{ width: '16px' }} circular spaced />{' '}
				Continue with 42
			</Button>
			<Dimmer active={showDimmer} page>
				<Loader content="Getting data..." size="massive" />
			</Dimmer>
		</>
	);
};

export default observer(OAuthButtons);
