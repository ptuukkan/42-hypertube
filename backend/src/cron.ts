import MovieModel, { IMovieDocument } from 'models/movie';
import cron from 'node-cron';
import Fs from 'fs';
import Path from 'path';

interface ICron {
	[key: string]: cron.ScheduledTask;
}

class CronScheduler {
	private activeCrons: ICron = {};

	addJobsForEachMovie = async (): Promise<void> => {
		try {
			const movieDocuments = await MovieModel.find({ status: { $gte: 1 } });
			movieDocuments.forEach((movieDocument) => {
				this.addCronJob(movieDocument);
			});
		} catch (error) {
			console.log(error);
		}
	};

	addCronJob = (movieDocument: IMovieDocument): void => {
		if (this.activeCrons[movieDocument.imdbCode])
			this.activeCrons[movieDocument.imdbCode].destroy();
		const newDate = new Date(movieDocument.lastViewed);
		newDate.setMonth(newDate.getMonth() + 1);
		newDate.setMinutes(newDate.getMinutes() + 1);
		if (newDate > new Date()) {
			const time = `${newDate.getMinutes()} ${newDate.getHours()} ${newDate.getDay()} ${newDate.getMonth()} *`;
			this.activeCrons[movieDocument.imdbCode] = cron.schedule(time, async () =>
				this.deleteMovie(movieDocument)
			);
		} else {
			this.deleteMovie(movieDocument);
		}
	};

	deleteMovie = async (movieDocument: IMovieDocument) => {
		const path = Path.resolve(
			__dirname,
			`../../movies/${movieDocument.imdbCode}/${movieDocument.fileName}`
		);
		console.log(path);
		if (Fs.existsSync(path)) {
			Fs.rmdirSync(path, { recursive: true });
		}
		movieDocument.status = 0;
		try {
			await movieDocument.save();
		} catch (error) {
			console.log(error);
		}
	};
}

const cronScheduler = new CronScheduler();

export default cronScheduler;
