import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Segment } from 'semantic-ui-react';

const NotFound = () => {
	return (
		<Segment
			textAlign="center"
			style={{ minHeight: 700, padding: '1em 0em' }}
			vertical
		>
			<Container text>
				<Header
					as="h1"
					content="404 - Not Found"
					style={{
						fontSize: '4em',
						fontWeight: 'normal',
						marginBottom: 0,
						marginTop: '3em',
					}}
				/>
				<Header
					as="h2"
					content="Go to main page"
					style={{
						fontSize: '1.7em',
						fontWeight: 'normal',
						marginTop: '1.5em',
					}}
				/>
				<Button
					primary
					as={Link}
					to={'/'}
					size="huge"
					content={'Main page'}
				></Button>
			</Container>
		</Segment>
	);
};

export default NotFound;
