import mongoose from 'mongoose';

export const connectToDb = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL!, {
			useNewUrlParser: true,
			useFindAndModify: false,
			useCreateIndex: true,
		});
	} catch (error) {
		console.error('Error connecting to mongodb...', error);
		process.exit(1);
	}
};

export const getDbValidationErrors = (
	error: mongoose.Error.ValidationError
) => {
	const errors = Object.keys(error.errors).map<string>((key: string) => {
		const errorData = error.errors[key] as mongoose.Error.ValidatorError;
		const str = errorData.properties.message.split(' Value: `')[0];
		return str.replace('Error, e', 'E').replace('Path', 'Value for');
	});
	return errors;
};
