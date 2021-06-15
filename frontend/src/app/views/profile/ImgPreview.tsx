import React from 'react';
import { Image } from 'semantic-ui-react';
import './imgPreview.css';

interface IProps {
	removeImg: (e: React.FormEvent<HTMLButtonElement>) => void;
	img: string | null;
	fileName: string;
}

const ImgPreview: React.FC<IProps> = ({ removeImg, img, fileName }) => {
	const imgUrl = () => {
		if (img) return img;
		return `http://localhost:8080/profileImages/${fileName}`;
	};

	const getLabel = () => {
		if (fileName === 'blank-profile.png' && !img) return undefined;
		return {
			corner: 'right',
			icon: 'delete',
			size: 'mini',
			color: 'red',
			onClick: removeImg,
			style: { cursor: 'pointer' },
		};
	};

	return (
		<Image
			rounded
			size="tiny"
			src={imgUrl()}
			bordered
			centered
			label={getLabel()}
		/>
	);
};

export default ImgPreview;
