import { AxiosAgent } from './../services/axiosAgent';
import fs from 'fs';

export const getRandomString = (endSlice = 2): string =>
	new Date().getTime().toString(36) +
	Math.random().toString(36).slice(endSlice);

export const saveUrlImgToProfileImages = async (
	url: string,
	fileName: string
): Promise<void> => {
	const filePath = `${__dirname}/../../public/profileImages/${fileName}`;
	const writer = fs.createWriteStream(filePath);

	const response = await new AxiosAgent(url).getStream();

	response.data.pipe(writer);

	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
};
