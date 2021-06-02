import React from 'react';
import { Message, Segment } from 'semantic-ui-react';

const ConfirmSuccess: React.FC = () => {
	return (
		<Segment style={{ minHeight: 500, padding: 60 }}>
			<Message success content="Account verified!" />
		</Segment>
	);
};

export default ConfirmSuccess;
