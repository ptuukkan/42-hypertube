import React from 'react';
import { useTranslation } from 'react-i18next';
import { Message, Segment } from 'semantic-ui-react';

export interface ConfirmSuccessProps {}

const ConfirmSuccess: React.FC<ConfirmSuccessProps> = () => {
	const { t } = useTranslation();

	return (
		<Segment style={{ minHeight: 500, padding: 60 }}>
			<Message success content={t('account_verified')} />
		</Segment>
	);
};

export default ConfirmSuccess;
