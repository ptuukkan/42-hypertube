import React from 'react';
import { Message } from 'semantic-ui-react';

interface IProps {
	message: string;
}

const ErrorMessage: React.FC<IProps> = ({ message }) => {
	return <Message error>{message}</Message>;
};

export default ErrorMessage;
