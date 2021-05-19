import { checkCode } from 'middleware/checkCode';
import { confirmUserController } from 'controllers/preAuth/confirmUser';
import { loginController } from 'controllers/preAuth/login';
import { registerController } from 'controllers/preAuth/register';
import { Router } from 'express';
import {
	resetPasswordController,
	sendResetPasswordController,
	validResetCodeController,
} from 'controllers/preAuth/resetPassword';

const preAuthRouter = Router();

preAuthRouter.get('/login', loginController);
preAuthRouter.post('/register', registerController);
preAuthRouter.post('/send-reset-password', sendResetPasswordController);

// Confirm link from email, check code and redirect to frontend
preAuthRouter.get('/confirm-email/:code', checkCode, confirmUserController);

// Reset link from email, check code and redirect to frontend
preAuthRouter.get('/reset-password/:code', checkCode, validResetCodeController);

// Update users password in db
preAuthRouter.put('/reset-password/:code', checkCode, resetPasswordController);

export default preAuthRouter;
