import { Request, Response } from 'express';
import Path from 'path';
import Fs from 'fs';
import { IMovieDocument } from 'models/movie';
import Debug from 'debug';
import { InternalServerError } from 'http-errors';
import { pipeline } from 'stream';
import { Readable } from 'stream';
import { torrentEngine } from 'app';
import { TorrentInstance } from './torrentEngine/instance';
// import ffmpegInstall from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
ffmpeg.setFfprobePath('/usr/bin/ffprobe');
const debug = Debug('stream');

interface IRange {
	start: number;
	end: number;
}

export const readRangeHeader = (range: string, fileSize: number): IRange => {
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

	if (videoRange.end < 0) videoRange.end = 0;

	return videoRange;
};

export const movieStream = (
	req: Request,
	res: Response,
	movieDocument: IMovieDocument
): void => {
	if (movieDocument.status === 2) {
		streamFile(req, res, movieDocument);
	} else {
		const instance = torrentEngine.instances.get(movieDocument.torrentHash);
		if (!instance) throw new InternalServerError('No torrent instance');
		streamTorrent(req, res, instance);
	}
};

const streamFile = (
	req: Request,
	res: Response,
	movieDocument: IMovieDocument
) => {
	const videoPath = Path.resolve(
		__dirname,
		`../../movies/${movieDocument.imdbCode}/${movieDocument.fileName}`
	);
	const videoStat = Fs.statSync(videoPath);

	const convert = !movieDocument.fileName.endsWith('.mp4');

	if (req.headers.range) {
		try {
			const videoRange = readRangeHeader(req.headers.range, videoStat.size);
			debug(
				`Creating a stream for bytes ${videoRange.start}-${videoRange.end}`
			);
			const stream = Fs.createReadStream(videoPath, {
				start: videoRange.start,
				end: videoRange.end,
			});
			createResponse(stream, res, videoStat.size, convert, videoRange);
		} catch (_error) {
			const head = {
				'Content-Range': `bytes */${videoStat.size}`,
			};
			res.writeHead(416, head);
			res.end();
		}
	} else {
		const stream = Fs.createReadStream(videoPath);
		createResponse(stream, res, videoStat.size, convert);
	}
};

const streamTorrent = (
	req: Request,
	res: Response,
	instance: TorrentInstance
) => {
	const convert = !instance.metadata.file.name.endsWith('.mp4');
	if (req.headers.range) {
		try {
			const videoRange = readRangeHeader(
				req.headers.range,
				instance.metadata.file.length
			);
			debug(
				`Creating a stream for bytes ${videoRange.start}-${videoRange.end}`
			);
			const stream = instance.file.stream(videoRange.start, videoRange.end);
			createResponse(
				stream,
				res,
				instance.metadata.file.length,
				convert,
				videoRange
			);
		} catch (_error) {
			const head = {
				'Content-Range': `bytes */${instance.metadata.file.length}`,
			};
			res.writeHead(416, head);
			res.end();
		}
	} else {
		const stream = instance.file.stream();
		createResponse(stream, res, instance.metadata.file.length, convert);
	}
};

const createResponse = (
	stream: Readable,
	res: Response,
	size: number,
	convert: boolean,
	videoRange?: IRange
) => {
	if (videoRange) {
		const head = {
			'Content-Range': `bytes ${videoRange.start}-${videoRange.end}/${size}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': videoRange.end - videoRange.start + 1,
			'Content-Type': `video/${convert ? 'webm' : 'mp4'}`,
		};
		res.writeHead(206, head);
	} else {
		const head = {
			'Content-Length': size,
			'Content-Type': `video/${convert ? 'webm' : 'mp4'}`,
		};
		res.writeHead(200, head);
	}
	if (convert) {
		ffmpeg(stream)
			// .outputOptions('-c', 'copy')
			.format('webm')
			.on('error', (error) => debug(error))
			.pipe(res);
	} else {
		pipeline(stream, res, (err) => {
			if (err) {
				debug('Pipeline failed', err);
			} else {
				debug('Pipeline succeeded');
			}
		});
	}
};
