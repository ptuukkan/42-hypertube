import { AxiosAgent } from './axiosAgent';

export interface IOSEnvelope {
	total_count: number;
	data: IOSSubtitle[];
}

export interface IOSSubtitle {
	type: string;
	attributes: IOSSubtitleAttributes;
}

export interface IOSSubtitleAttributes {
	language: string;
	fps: number;
	from_trusted: boolean;
	release: string;
	files: IOSSubtitleFile[];
	moviehash_match: boolean;
}

export interface IOSSubtitleFile {
	file_id: number;
	file_name: string | null;
}

export interface IOSDownload {
	link: string;
	file_name: string;
	requests: number;
	remaining: number;
}

const agent = new AxiosAgent(process.env.OS_API, 2000);
const apiKey = process.env.OS_API_KEY ?? '';
agent.axiosInstance.defaults.headers.common['Api-Key'] = apiKey;
agent.axiosInstance.defaults.headers.common.Accept = '*/*';

const searchParams = (
	imdbId: string,
	movieHash: string,
	languages: string[]
) => {
	const params = new URLSearchParams();
	params.append('imdb_id', imdbId);
	params.append('moviehash', movieHash);
	params.append('type', 'movie');
	params.append('languages', languages.join(','));
	params.append('order_by', 'download_count');
	params.append('order_direction', 'desc');
	return params;
};

const dlBody = (fileId: number, fileName: string) => {
	return {
		file_id: fileId,
		file_name: fileName,
		sub_format: 'webvtt',
		strip_html: true,
		cleanup_links: true,
	};
};

const osService = {
	search: (
		imdbId: string,
		movieHash: string,
		languages: string[]
	): Promise<IOSEnvelope> =>
		agent.getParams('subtitles', searchParams(imdbId, movieHash, languages)),
	downloadLink: (fileId: number, fileName: string): Promise<IOSDownload> =>
		agent.postParams('download', dlBody(fileId, fileName)),
};

export default osService;
