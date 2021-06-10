import React, { createRef, useState } from 'react';
import { Button, Form, Image } from 'semantic-ui-react';

interface IProps {
	// TODO must not be with ? !!
	fileName: string;
	setImgFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const UploadBtn: React.FC<IProps> = ({ fileName, setImgFile }) => {
	const [img, setImg] = useState<string | null>(null);
	const inputRef: React.LegacyRef<HTMLInputElement> = createRef();

	const uploadImage = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		inputRef.current!.click();
	};

	const fileChange = (e: React.FormEvent<HTMLInputElement>) => {
		if (e.currentTarget.files && e.currentTarget.files[0]) {
			// TODO VALIDATE UPLOAD!
			setImgFile(e.currentTarget.files[0]);
			const reader = new FileReader();
			reader.onload = () => setImg(reader.result as string);
			reader.readAsDataURL(e.currentTarget.files[0]);
		}
	};

	const imgUrl = () => {
		if (img) return img;
		return `http://localhost:8080/profileImages/${fileName}`;
	};

	const btnText =
		img || fileName?.includes('blank')
			? 'Upload Profile Pic'
			: 'Change Profile Pic';

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
					<Image
						rounded
						size="tiny"
						src={imgUrl()}
						bordered
						centered
						onClick={uploadImage}
						style={{ cursor: 'pointer' }}
					/>
				</Form.Group>
			</Form.Field>
		</>
	);
};

export default UploadBtn;
