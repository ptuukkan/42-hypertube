import mongoose from 'mongoose';

export const connectToDb = async (): Promise<void> => {
	try {
		await mongoose.connect(process.env.MONGODB_URL!, {
			useUnifiedTopology: true,
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
): string[] => {
	const errors = Object.keys(error.errors).reduce((obj: any, key: string) => {
		const errorData = error.errors[key] as mongoose.Error.ValidatorError;
		const str = errorData.properties.message.split(' Value: `')[0];
		obj[key] = str.replace('Error, e', 'E').replace('Path', 'Value for');
		return obj;
	}, {});
	return errors;
};
