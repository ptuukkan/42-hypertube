import nodemailer from 'nodemailer';

const sendEmail = (
	to: string,
	subject: string,
	html: string
): Promise<void> => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'ollesusteem',
			pass: 'vironialukutaha19',
		},
	});

	const options = {
		from: '"Raymond From Hypertube" raymond.holt@hypertube.com',
		to: to,
		subject: subject,
		html: html,
	};

	return new Promise((resolve, reject) => {
		transporter.sendMail(options, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
};

export const sendConfirmAccountEmail = (
	to: string,
	subject: string,
	userId: string,
	code: string
): Promise<void> => {
	const PORT = process.env.PORT;
	const link = `http://localhost:${PORT}/api/preAuth/confirm-email/${userId}_${code}`;
	const html = `<html><body><p>Hello!<br><br>
  Glad you have joined our amazing movie site. We will need you to confirm your
  account to get access to the site. To do that you need to tap the link below
  to confirm your account for Hypertube website!</p>
  <a href='${link}'>Tap here to Confirm account</a>
  <br><br>Sincerely,<br>Raymond Holt<br><i>CEO of Hypertube</i></body></html>`;

	return sendEmail(to, subject, html);
};

export const sendResetPasswordEmail = (
	to: string,
	subject: string,
	userId: string,
	code: string
): Promise<void> => {
	const PORT = process.env.PORT;
	const link = `http://localhost:${PORT}/api/preAuth/reset-password/${userId}_${code}`;
	const html = `<html><body><p>Hello!<br><br>
	You have requested a link to reset your password, because presumably you
	forgot it. Tap the link below to reset your passoword. If this wasn't you
	who requested this link, please contact us!</p>
	<a href='${link}'>Tap here to Reset Password</a>
	<br><br>Sincerely,<br>Raymond Holt<br><i>CEO of Hypertube</i></body></html>`;

	return sendEmail(to, subject, html);
};
