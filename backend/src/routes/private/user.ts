import {
	getCurrentProfileController,
	getProfileController,
	updateProfileController,
} from './../../controllers/profile';
import { logoutController } from 'controllers/preAuth/login';
import { Router } from 'express';
import updateProfileMulter from 'application/multer';

const userRouter = Router();

userRouter.get('/:id', getProfileController);
userRouter.get('/', getCurrentProfileController);
userRouter.post('/', updateProfileMulter, updateProfileController);
userRouter.post('/logout', logoutController);

export default userRouter;
