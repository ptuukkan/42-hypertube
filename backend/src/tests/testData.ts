import { IBayMovie } from 'services/bay';
import { IYtsMovie } from 'services/yts';

export const ytsMovieList: IYtsMovie[] = [
	{
		id: 8462,
		imdb_code: 'tt4154756',
		title_english: 'Avengers: Infinity War',
		year: 2018,
		rating: 8.4,
		genres: ['Action', 'Adventure', 'Drama', 'Fantasy', 'Sci-Fi'],
		medium_cover_image:
			'https://yts.mx/assets/images/movies/avengers_infinity_war_2018/medium-cover.jpg',
	},
	{
		id: 7709,
		imdb_code: 'tt1825683',
		title_english: 'Black Panther',
		year: 2018,
		rating: 7.3,
		genres: ['Action', 'Adventure', 'Sci-Fi'],
		medium_cover_image:
			'https://yts.mx/assets/images/movies/black_panther_2018/medium-cover.jpg',
	},
	{
		id: 8539,
		imdb_code: 'tt5463162',
		title_english: 'Deadpool 2',
		year: 2018,
		rating: 7.7,
		genres: ['Action', 'Adventure', 'Comedy', 'Sci-Fi'],
		medium_cover_image:
			'https://yts.mx/assets/images/movies/deadpool_2_2018/medium-cover.jpg',
	},
];

export const bayMovieList: IBayMovie[] = [
	{
		id: 44900854,
		info_hash: '481154F75C8F18A9EBFC481AA6B0EB540A8F8256',
		name: 'Demon.Slayer.Kimetsu.no.Yaiba.The.Movie.Mugen/Infinity.Train.264',
		seeders: 1970,
		leechers: 412,
		imdb: 'tt11032374',
	},
	{
		id: 44094798,
		info_hash: '135E2BE1F525D30AAC80E413F371AD171E81C68D',
		name: 'Nobody (2021) [1080p] [WEBRip] [5.1]',
		seeders: 1929,
		leechers: 388,
		imdb: 'tt7888964',
	},
	{
		id: 43342755,
		info_hash: '2EDC556DBD0F63FA7D37A5689002AA65F26CC025',
		name: 'Godzilla.vs.Kong.2021.1080p.WEB-DL.DDP5.1.Atmos.x264-EVO[TGx]',
		seeders: 953,
		leechers: 190,
		imdb: 'tt5034838',
	},
];

export const dupBayMovieList: IBayMovie[] = [
	{
		id: 44900854,
		info_hash: '481154F75C8F18A9EBFC481AA6B0EB540A8F8256',
		name: 'Demon.Slayer.Kimetsu.no.Yaiba.The.Movie.Mugen/Infinity.Train.264',
		seeders: 1970,
		leechers: 412,
		imdb: 'tt4154756',
	},
	{
		id: 44094798,
		info_hash: '135E2BE1F525D30AAC80E413F371AD171E81C68D',
		name: 'Nobody (2021) [1080p] [WEBRip] [5.1]',
		seeders: 1929,
		leechers: 388,
		imdb: 'tt1825683',
	},
	{
		id: 43342755,
		info_hash: '2EDC556DBD0F63FA7D37A5689002AA65F26CC025',
		name: 'Godzilla.vs.Kong.2021.1080p.WEB-DL.DDP5.1.Atmos.x264-EVO[TGx]',
		seeders: 953,
		leechers: 190,
		imdb: 'tt5463162',
	},
];

