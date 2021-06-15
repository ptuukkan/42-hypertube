import React, { createRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'semantic-ui-react';
import ImgPreview from './ImgPreview';

interface IProps {
	fileName: string;
	setImgFile: (file: File | null) => void;
}

const UploadField: React.FC<IProps> = ({ fileName, setImgFile }) => {
	const { t } = useTranslation();
	const [img, setImg] = useState<string | null>(null);
	const inputRef: React.LegacyRef<HTMLInputElement> = createRef();

	const uploadImage = (e: React.FormEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		inputRef.current!.click();
	};

	const removeImage = (e: React.FormEvent<HTMLButtonElement>): void => {
		e.stopPropagation();
		if (img) setImg(null);
		setImgFile(null);
	};

	const fileChange = (e: React.FormEvent<HTMLInputElement>): void => {
		if (e.currentTarget.files && e.currentTarget.files[0]) {
			// TODO validate on frontend too! When have some toast showing logic, then easier to show error
			// 5MB max pic
			// file type image
			// ext only .jpg .png .jpeg
			setImgFile(e.currentTarget.files[0]);
			const reader = new FileReader();
			reader.onload = () => setImg(reader.result as string);
			reader.readAsDataURL(e.currentTarget.files[0]);
		}
	};

	const btnText =
		fileName === 'blank-profile.png' && !img
			? t('upload_pic')
			: t('change_pic');

	return (
		<>
			<Form.Field>
				<Form.Group widths="equal" style={{ alignItems: 'center' }}>
					<Button
						content={btnText}
						labelPosition="left"
						icon="file"
						onClick={uploadImage}
						basic
						color="teal"
						size="small"
						style={{ marginLeft: '7px' }}
					/>
					<input ref={inputRef} type="file" hidden onChange={fileChange} />
					<ImgPreview removeImg={removeImage} img={img} fileName={fileName} />
				</Form.Group>
			</Form.Field>
		</>
	);
};

export default UploadField;
