import { IMovie } from 'app/models/movie';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Dimmer,
	Header,
	Item,
	Label,
	Loader,
	Rating,
	Segment,
} from 'semantic-ui-react';
import agent from '../services/agent';

export interface MainContetProps {
	searchQuery: string;
}

const MainContent: React.FC<MainContetProps> = ({ searchQuery }) => {
	const [movies, setMovies] = useState<IMovie[]>([]);
	const [lastQuery, setLastQuery] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (movies.length === 0 || searchQuery !== lastQuery) {
			setLoading(true);
			agent.Movies.search(searchQuery)
				.then((movies) => setMovies(movies.movies))
				.catch((e) => console.log(e))
				.finally(() => {
					setLoading(false);
					setLastQuery(searchQuery);
				});
		}
	}, [movies.length, searchQuery, lastQuery]);
	console.log(movies);
	if (loading) {
		return (
			<Dimmer inverted>
				<Loader />
			</Dimmer>
		);
	}

	if (movies.length === 0)
		return (
			<Segment style={{ minHeight: 500, padding: 60 }}>
				<Header>No results :(</Header>
			</Segment>
		);

	return (
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
								{movie.genres &&
									movie.genres.map((genre, i) => (
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

export default MainContent;
