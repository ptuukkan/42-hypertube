import { IMovieThumbnail } from 'models/movie';
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

export const thumbnailList20: IMovieThumbnail[] = [
	{
			"title": "Aladdin",
			"year": 2019,
			"coverImage": "https://yts.mx/assets/images/movies/aladdin_2019/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Comedy",
					"Family",
					"Fantasy",
					"Musical",
					"Romance"
			],
			"rating": 6.9,
			"imdb": "tt6139732"
	},
	{
			"title": "Alita: Battle Angel",
			"year": 2019,
			"coverImage": "https://yts.mx/assets/images/movies/alita_battle_angel_2019/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Sci-Fi",
					"Thriller"
			],
			"rating": 7.3,
			"imdb": "tt0437086"
	},
	{
			"title": "Ant-Man and the Wasp",
			"year": 2018,
			"coverImage": "https://yts.mx/assets/images/movies/ant_man_and_the_wasp_2018/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Comedy",
					"Sci-Fi"
			],
			"rating": 7,
			"imdb": "tt5095030"
	},
	{
			"title": "Aquaman",
			"year": 2018,
			"coverImage": "https://yts.mx/assets/images/movies/aquaman_2018/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Fantasy",
					"Sci-Fi"
			],
			"rating": 6.9,
			"imdb": "tt1477834"
	},
	{
			"title": "Avengers: Endgame",
			"year": 2019,
			"coverImage": "https://yts.mx/assets/images/movies/avengers_endgame_2019/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Drama",
					"Sci-Fi"
			],
			"rating": 8.4,
			"imdb": "tt4154796"
	},
	{
			"title": "Avengers: Infinity War",
			"year": 2018,
			"coverImage": "https://yts.mx/assets/images/movies/avengers_infinity_war_2018/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Drama",
					"Fantasy",
					"Sci-Fi"
			],
			"rating": 8.4,
			"imdb": "tt4154756"
	},
	{
			"title": "Beauty and the Beast",
			"year": 2017,
			"coverImage": "https://yts.mx/assets/images/movies/beauty_and_the_beast_2017/medium-cover.jpg",
			"genres": [
					"Action",
					"Family",
					"Fantasy",
					"Musical",
					"Romance"
			],
			"rating": 7.1,
			"imdb": "tt2771200"
	},
	{
			"title": "Big Hero 6",
			"year": 2014,
			"coverImage": "https://yts.mx/assets/images/movies/big_hero_6_2014/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Animation",
					"Comedy",
					"Drama",
					"Family",
					"Sci-Fi"
			],
			"rating": 7.8,
			"imdb": "tt2245084"
	},
	{
			"title": "Black Panther",
			"year": 2018,
			"coverImage": "https://yts.mx/assets/images/movies/black_panther_2018/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Sci-Fi"
			],
			"rating": 7.3,
			"imdb": "tt1825683"
	},
	{
			"title": "Captain Marvel",
			"year": 2019,
			"coverImage": "https://yts.mx/assets/images/movies/captain_marvel_2019/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Sci-Fi"
			],
			"rating": 6.9,
			"imdb": "tt4154664"
	},
	{
			"title": "Deadpool",
			"year": 2016,
			"coverImage": "https://yts.mx/assets/images/movies/deadpool_2016/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Comedy",
					"Romance",
					"Sci-Fi"
			],
			"rating": 8,
			"imdb": "tt1431045"
	},
	{
			"title": "Deadpool 2",
			"year": 2018,
			"coverImage": "https://yts.mx/assets/images/movies/deadpool_2_2018/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Comedy",
					"Sci-Fi"
			],
			"rating": 7.7,
			"imdb": "tt5463162"
	},
	{
			"title": "Doctor Strange",
			"year": 2016,
			"coverImage": "https://yts.mx/assets/images/movies/doctor_strange_2016/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Fantasy",
					"Sci-Fi"
			],
			"rating": 7.5,
			"imdb": "tt1211837"
	},
	{
			"title": "Fantastic Beasts and Where to Find Them",
			"year": 2016,
			"coverImage": "https://yts.mx/assets/images/movies/fantastic_beasts_and_where_to_find_them_2016/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Family",
					"Fantasy"
			],
			"rating": 7.3,
			"imdb": "tt3183660"
	},
	{
			"title": "Fast & Furious Presents: Hobbs & Shaw",
			"year": 2019,
			"coverImage": "https://yts.mx/assets/images/movies/fast_furious_presents_hobbs_shaw_2019/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Thriller"
			],
			"rating": 6.4,
			"imdb": "tt6806448"
	},
	{
			"title": "Guardians of the Galaxy",
			"year": 2014,
			"coverImage": "https://yts.mx/assets/images/movies/Guardians_of_the_Galaxy_2014/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Comedy",
					"Sci-Fi"
			],
			"rating": 8,
			"imdb": "tt2015381"
	},
	{
			"title": "Guardians of the Galaxy Vol. 2",
			"year": 2017,
			"coverImage": "https://yts.mx/assets/images/movies/guardians_of_the_galaxy_vol_2_2017/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Comedy",
					"Sci-Fi"
			],
			"rating": 7.6,
			"imdb": "tt3896198"
	},
	{
			"title": "How to Train Your Dragon: The Hidden World",
			"year": 2019,
			"coverImage": "https://yts.mx/assets/images/movies/how_to_train_your_dragon_the_hidden_world_2019/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Animation",
					"Comedy",
					"Family",
					"Fantasy"
			],
			"rating": 7.5,
			"imdb": "tt2386490"
	},
	{
			"title": "Incredibles 2",
			"year": 2018,
			"coverImage": "https://yts.mx/assets/images/movies/incredibles_2_2018/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Animation",
					"Comedy",
					"Family",
					"Sci-Fi"
			],
			"rating": 7.6,
			"imdb": "tt3606756"
	},
	{
			"title": "Interstellar",
			"year": 2014,
			"coverImage": "https://yts.mx/assets/images/movies/interstellar_2014/medium-cover.jpg",
			"genres": [
					"Action",
					"Adventure",
					"Drama",
					"Sci-Fi",
					"Thriller"
			],
			"rating": 8.6,
			"imdb": "tt0816692"
	}
]
