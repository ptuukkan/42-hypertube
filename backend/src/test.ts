import Fs from 'fs';
import Path from 'path';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');

const sourcePath = Path.resolve(__dirname, '../movies/test1.mkv');
const destPath = Path.resolve(__dirname, '../movies/test1.mp4');
const readStream = Fs.createReadStream(sourcePath);
const writeStream = Fs.createWriteStream(destPath);

ffmpeg(readStream)
	.outputOptions(['-c', 'copy'])
	.format('mp4')
	.on('error', (error) => console.log(error))
	.pipe(writeStream);

// readStream.on('data', (buffer: Buffer) => {
// 	console.log(buffer);
// });
