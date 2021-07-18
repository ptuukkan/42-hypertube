import osService, { IOSSubtitle } from 'services/openSubtitles';
import Path from 'path';
import Fs from 'fs';
import lodash from 'lodash';
import Debug from 'debug';
import { IMovieDocument } from 'models/movie';
import { AxiosAgent } from 'services/axiosAgent';
import { IUserDocument } from 'models/user';

const debug = Debug('subtitles');

const subtitleDir = Path.resolve(__dirname, '../../public/subtitles/');

const searchSubtitles = async (
	movieDocument: IMovieDocument,
	languages: string[]
) => {
	debug(movieDocument.movieHash);

	const subtitles = await osService.search(
		movieDocument.imdbCode,
		movieDocument.movieHash,
		languages
	);

	const subtitlesByLanguage = lodash.groupBy(
		subtitles.data,
		(d) => d.attributes.language
	);

	return subtitlesByLanguage;
};

const checkSubtitles = async (movieDocument: IMovieDocument, languages: string[]) => {
	const subtitles = languages.reduce((list: string[], current) => {
		if (!movieDocument.subtitles.includes(current)) return [...list, current];
		const path = Path.resolve(
			subtitleDir,
			`${movieDocument.imdbCode}/${current}.webvtt`
		);
		if (Fs.existsSync(path) && Fs.statSync(path).size > 1000) {
			return list;
		}
		movieDocument.subtitles = movieDocument.subtitles.filter(
			(s) => s !== current
		);
		return [...list, current];
	}, []);
	await movieDocument.save();
	return subtitles;
};

const downloadSubtitleFile = async (
	subtitle: IOSSubtitle,
	imdbCode: string
) => {
	const fileName = `${subtitle.attributes.language}.webvtt`;
	const path = Path.resolve(subtitleDir, imdbCode, fileName);
	const downloadLink = await osService.downloadLink(
		subtitle.attributes.files[0].file_id,
		fileName
	);

	const writer = Fs.createWriteStream(path);
	const response = await new AxiosAgent(downloadLink.link).getStream();
	response.data.pipe(writer);
	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
};

export const downloadSubtitles = async (
	movieDocument: IMovieDocument,
	user: IUserDocument
): Promise<string[]> => {
	if (!Fs.existsSync(Path.resolve(subtitleDir, movieDocument.imdbCode))) {
		Fs.mkdirSync(Path.resolve(subtitleDir, movieDocument.imdbCode), {
			recursive: true,
		});
	}

	const languages = [user.language ?? 'en'];
	if (!languages.includes('en')) languages.push('en');
	const languagesToGet = await checkSubtitles(movieDocument, languages);
	if (languagesToGet.length === 0) return languages;
	const subtitlesByLanguage = await searchSubtitles(
		movieDocument,
		languagesToGet
	);

	const promiseList = await Promise.allSettled(
		languagesToGet.map(async (language) => {
			if (!subtitlesByLanguage[language])
				return Promise.reject(`No subtitles for language: ${language}`);
			let chosenSubtitle = subtitlesByLanguage[language].find(
				(s) =>
					s.attributes.files[0] &&
					!s.attributes.files[1] &&
					s.attributes.moviehash_match
			);
			if (!chosenSubtitle) {
				chosenSubtitle = subtitlesByLanguage[language].find(
					(s) => s.attributes.files[0] && !s.attributes.files[1]
				);
			}
			if (!chosenSubtitle)
				return Promise.reject(`No subtitles for language: ${language}`);
			try {
				await downloadSubtitleFile(chosenSubtitle, movieDocument.imdbCode);
				return language;
			} catch (error) {
				return Promise.reject(error);
			}
		})
	);

	promiseList.forEach((promise) => {
		if (promise.status === 'fulfilled' && promise.value) {
			if (!movieDocument.subtitles.includes(promise.value)) {
				movieDocument.subtitles.push(promise.value);
			}
		} else {
			debug(promise);
		}
	});

	await movieDocument.save();

	return movieDocument.subtitles;
};
