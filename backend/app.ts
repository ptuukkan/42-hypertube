import yts from './services/yts';

const params = new URLSearchParams();
yts.Movies.list(params)
	.then((movies) => console.log(movies))
	.catch((error) => console.log(error));
