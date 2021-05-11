import { checkCode } from './../middleware/checkCode';
import { confirmUserController } from 'controllers/preAuth/confirmUser';
import { loginController } from 'controllers/preAuth/login';
import { registerController } from 'controllers/preAuth/register';
import { Router } from 'express';
import {
	resetPasswordController,
	sendResetPasswordController,
	validResetCodeController,
} from 'controllers/preAuth/reserPassword';

const preAuthRouter = Router();

preAuthRouter.get('/login', loginController);

preAuthRouter.post('/register', registerController);

preAuthRouter.post('/send-reset-password', sendResetPasswordController);

// Confirm user from email link and redirect to frontend
preAuthRouter.get('/confirm-email/:code', checkCode, confirmUserController);

// Check user is eligible to reset password
preAuthRouter.get('/reset-password/:code', checkCode, validResetCodeController);

// Update users password in db
preAuthRouter.put('/reset-password/:code', checkCode, resetPasswordController);

export default preAuthRouter;
