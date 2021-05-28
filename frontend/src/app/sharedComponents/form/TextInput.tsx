import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Form, FormFieldProps, Label } from 'semantic-ui-react';

interface IProps extends FieldRenderProps<string>, FormFieldProps {}

const TextInput: React.FC<IProps> = ({
	input,
	width,
	type,
	placeholder,
	meta: { touched, error, submitError, dirtySinceLastSubmit },
}) => {
	return (
		<Form.Field error={touched && !!error} type={type} width={width}>
			<input {...input} placeholder={placeholder} />
			{touched && (error || (submitError && !dirtySinceLastSubmit)) && (
				<Label basic color="red">
					{error || submitError}
				</Label>
			)}
		</Form.Field>
	);
};

export default TextInput;
