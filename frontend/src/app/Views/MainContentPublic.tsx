import { Link } from 'react-router-dom';
import { Header, Segment, Container, Button } from 'semantic-ui-react';

const MainContentPublic = () => {
	return (
		<Segment
			textAlign="center"
			style={{ minHeight: 700, padding: '1em 0em' }}
			vertical
		>
			<Container text>
				<Header
					as="h1"
					content="HyperTube"
					style={{
						fontSize: '4em',
						fontWeight: 'normal',
						marginBottom: 0,
						marginTop: '3em',
					}}
				/>
				<Header
					as="h2"
					content="Watch all moveis you like!"
					style={{
						fontSize: '1.7em',
						fontWeight: 'normal',
						marginTop: '1.5em',
					}}
				/>
				<Button primary as={Link} to="/register" size="huge">
					Get Started
				</Button>
			</Container>
		</Segment>
	);
};

export default MainContentPublic;
