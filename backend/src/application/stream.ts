import { Request, Response } from 'express';
import Path from 'path';
import Fs from 'fs';
import MovieModel from 'models/movie';
import Debug from 'debug';
import { NotFound } from 'http-errors';
const debug = Debug('stream');

interface IRange {
	start: number;
	end: number;
}

const readRangeHeader = (range: string, fileSize: number): IRange => {
	const parts = range.split(/bytes=([0-9]*)-([0-9]*)/);
	const start = parseInt(parts[1]);
	const end = parseInt(parts[2]);

	const videoRange: IRange = {
		start: isNaN(start) ? 0 : start,
		end: isNaN(end) ? fileSize - 1 : end,
	};

	if (videoRange.end > fileSize - 1) {
		videoRange.end = fileSize - 1;
	}
	if (videoRange.start > videoRange.end) {
		throw new Error();
	}
	if (isNaN(start) && !isNaN(end)) {
		videoRange.start = fileSize - end;
		videoRange.end = fileSize - 1;
	}

	return videoRange;
};

export const streamMovieFile = async (
	req: Request,
	res: Response
): Promise<void> => {
	const movieDocument = await MovieModel.findOne({
		imdbCode: req.params.imdbCode,
	});
	if (!movieDocument) throw new NotFound('Movie document not found');

	if (!movieDocument.status)
		throw new NotFound('Movie file not yet downloading');

	const videoPath = Path.resolve(
		__dirname,
		`../../public/movies/${movieDocument.imdbCode}/${movieDocument.path}`
	);

	if (!Fs.existsSync(videoPath)) throw new NotFound('Movie file not found');

	const videoStat = Fs.statSync(videoPath);
	const fileSize = videoStat.size;
	if (req.headers.range) {
		try {
			const videoRange = readRangeHeader(req.headers.range, fileSize);
			const chunkSize = videoRange.end - videoRange.start + 1;
			const file = Fs.createReadStream(videoPath, {
				start: videoRange.start,
				end: videoRange.end,
			});
			const head = {
				'Content-Range': `bytes ${videoRange.start}-${videoRange.end}/${movieDocument.size}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunkSize,
				'Content-Type': 'video/mp4',
			};
			res.writeHead(206, head);
			file.pipe(res);
		} catch (_error) {
			const head = {
				'Content-Range': `bytes */${movieDocument.size}`,
			};
			res.writeHead(416, head);
			res.end();
		}
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		};
		res.writeHead(200, head);
		Fs.createReadStream(videoPath).pipe(res);
	}
};
