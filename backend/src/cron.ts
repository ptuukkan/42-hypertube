import cron from 'node-cron';

interface ICron {
	[key: string]: cron.ScheduledTask;
}

class CronScheduler {
	private activeCrons: ICron = {};

	addJobsForEachMovie(): void {
		// TODO fetch donwloaded movies from DB and add cron jobs for its deletion
		// movies.forEach(({ name, lastWatched }}) => {
		//   const newDate = lastWatched
		//     .setMonth(lastWatched.getMonth() + 1)
		//     .setMinutes(lastWatched.getMinutes() + 1)
		//
		//   might need to check if date is in the past just in case? delete the movie
		//
		//   const time = `${newDate.getMinutes()} ${newDate.getHour()} ${newDate.getDay()} ${newDate.getMonth()} *`
		//   this.addCronJob(name, time, () => deleteTheMovie())
		// })
	}

	// TODO if movie is fully downloaded, add cron for it
	// TODO when update lastWatched time then add new date cron for it
	addCronJob = (name: string, cronTime: string, fun: () => void): void => {
		if (this.activeCrons[name]) this.activeCrons[name].destroy();
		this.activeCrons[name] = cron.schedule(cronTime, fun);
	};
}

const cronScheduler = new CronScheduler();

export default cronScheduler;
