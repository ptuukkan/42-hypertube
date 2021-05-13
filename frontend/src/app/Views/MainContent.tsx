import { IMovie } from 'app/models/movie';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Dimmer,
	Item,
	Label,
	Loader,
	Rating,
	Segment,
} from 'semantic-ui-react';
import agent from '../services/agent';

export interface MainContetProps {}

const MainContet: React.FC<MainContetProps> = () => {
	const [movies, setMovies] = useState<IMovie[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (movies.length === 0) {
			setLoading(true);
			agent.Browse.top()
				.then((movies) => setMovies(movies.movies))
				.catch((e) => console.log(e))
				.finally(() => setLoading(false));
		}
	}, [movies.length]);

	return loading ? (
		<Dimmer active inverted>
			<Loader />
		</Dimmer>
	) : (
		<Segment style={{ minHeight: 500, padding: 60 }}>
			<Item.Group divided>
				{movies.map((movie) => (
					<Item key={movie.imdb} as={Link} to={movie.imdb}>
						<Item.Image src={movie.coverImage} />
						<Item.Content>
							<Item.Header>{movie.title}</Item.Header>
							<Item.Meta>
								<p>{movie.year}</p>
								<Rating
									size="tiny"
									icon="star"
									defaultRating={movie.rating}
									disabled
									maxRating={10}
								/>
							</Item.Meta>
							<Item.Description>
								{movie.genres.map((genre, i) => (
									<Label key={i}>{genre}</Label>
								))}
							</Item.Description>
						</Item.Content>
					</Item>
				))}
			</Item.Group>
		</Segment>
	);
};

export default MainContet;
