import React from "react";
import { Message, Segment } from "semantic-ui-react";

export interface ConfirmSuccessProps {

}

const ConfirmSuccess: React.FC<ConfirmSuccessProps> = () => {
	return (
		<Segment style={{ minHeight: 500, padding: 60 }}>
			<Message success content="Account verified!" />
		</Segment>
	);
};

export default ConfirmSuccess;
