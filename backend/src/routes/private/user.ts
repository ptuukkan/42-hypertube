import {
	getProfileController,
	updateProfileController,
} from './../../controllers/profile';
import { logoutController } from 'controllers/preAuth/login';
import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', getProfileController);
userRouter.post('/', updateProfileController);
userRouter.post('/logout', logoutController);
// TODO add other user routes like update user

export default userRouter;
