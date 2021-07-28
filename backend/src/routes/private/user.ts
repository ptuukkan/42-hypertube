import {
	getCurrentProfileController,
	getProfileController,
	updateProfileController,
	updateLanguageController,
} from 'controllers/profile';
import { logoutController } from 'controllers/preAuth/login';
import { Router } from 'express';
import updateProfileMulter from 'application/multer';

const userRouter = Router();

userRouter.get('/:username', getProfileController);
userRouter.get('/', getCurrentProfileController);
userRouter.post('/language', updateLanguageController);
userRouter.post('/', updateProfileMulter, updateProfileController);
userRouter.post('/logout', logoutController);

export default userRouter;
