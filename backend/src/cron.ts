import MovieModel, { IMovieDocument } from 'models/movie';
import cron from 'node-cron';
import Fs from 'fs';
import Path from 'path';
import Debug from 'debug';

interface ICron {
	[key: string]: cron.ScheduledTask;
}

class CronScheduler {
	private activeCrons: ICron = {};
	private debug = Debug('cron');

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
		if (this.activeCrons[movieDocument.imdbCode]) {
			this.activeCrons[movieDocument.imdbCode].stop();
		}
		const newDate = new Date(movieDocument.lastViewed);
		newDate.setMonth(newDate.getMonth() + 1);
		newDate.setMinutes(newDate.getMinutes() + 1);
		if (newDate > new Date()) {
			const time = `${newDate.getMinutes()} ${newDate.getHours()} ${newDate.getDate()} ${
				newDate.getMonth() + 1
			} *`;
			this.activeCrons[movieDocument.imdbCode] = cron.schedule(time, async () =>
				this.deleteMovie(movieDocument)
			);
			this.debug(`Added cron job for ${movieDocument.imdbCode}`);
		} else {
			this.deleteMovie(movieDocument);
		}
	};

	deleteMovie = async (movieDocument: IMovieDocument) => {
		this.debug(`Deleting ${movieDocument.imdbCode} movie file`);
		if (this.activeCrons[movieDocument.imdbCode]) {
			this.activeCrons[movieDocument.imdbCode].stop();
			delete this.activeCrons[movieDocument.imdbCode];
		}
		const path = Path.resolve(__dirname, `../movies/${movieDocument.imdbCode}`);
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
