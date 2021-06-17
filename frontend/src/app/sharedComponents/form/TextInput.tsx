import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Form, FormFieldProps, Label } from 'semantic-ui-react';

export interface ITextInputProps
	extends FieldRenderProps<string>,
		FormFieldProps {
	label?: string;
	value?: string;
}

const TextInput: React.FC<ITextInputProps> = ({
	label,
	input,
	width,
	type,
	placeholder,
	meta: { touched, error, submitError, dirtySinceLastSubmit },
}) => {
	return (
		<Form.Field error={touched && !!error} type={type} width={width}>
			{label && <label>{label}</label>}
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
