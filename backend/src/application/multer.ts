import { getRandomString } from 'utils';
import path from 'path';
import multer, { MulterError } from 'multer';

export const NOT_VALID_FILE = 'not_valid_file';

const getProfileImageName = (originalName: string) =>
	`${getRandomString(10)}-${Date.now()}-profile${path.extname(originalName)}`;

const storage = multer.diskStorage({
	destination: `${__dirname}/../../public/profileImages/`,
	filename: (req, file, cb) => cb(null, getProfileImageName(file.originalname)),
});

const updateProfileMulter = multer({
	storage,
	limits: { fileSize: 5000000 },
	fileFilter: (req, file, cb) => {
		const [fileType, fileExt] = file.mimetype.split('/');
		if (
			!(
				fileType === 'image' &&
				(fileExt === 'png' || fileExt === 'jpeg' || fileExt === 'jpg')
			)
		)
			return cb(new MulterError('LIMIT_UNEXPECTED_FILE', NOT_VALID_FILE));
		return cb(null, true);
	},
}).single('profilePic');

export default updateProfileMulter;
