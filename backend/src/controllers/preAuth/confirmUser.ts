import LinkModel from 'models/link';
import asyncHandler from 'express-async-handler';
import Usermodel from 'models/user';

export const confirmUserController = asyncHandler(async (req, res) => {
	const { userId, code } = req.codePayload!;

	try {
		await Usermodel.updateOne({ _id: userId }, { isConfirmed: true });
	} catch (err) {
		console.error(err);
		return res.redirect(302, 'http://localhost:3000/?confirm-email=error');
	}

	try {
		await LinkModel.deleteOne({ code });
	} catch (err) {
		console.error(err);
	}

	res.redirect(302, 'http://localhost:3000/?confirm-email=success');
});
