import React from 'react';
import MovieLoader from 'app/views/movieDetails/MovieLoader';
import { RootStoreContext } from 'app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	Grid,
	GridColumn,
	Item,
	ItemExtra,
	Rating,
	Segment,
	Header,
	Embed,
	Label,
} from 'semantic-ui-react';
import { IActorObj } from 'app/models/movie';

interface IParams {
	id: string;
}

const Movie = () => {
	const { id } = useParams<IParams>();
	const rootStore = useContext(RootStoreContext);
	const [loading, setLoading] = useState(true);
	const { movie, getMovie } = rootStore.movieStore;

	useEffect(() => {
		if (movie === null || movie.imdb !== id) getMovie(id);
		if (movie && movie.imdb === id) setLoading(false);
	}, [id, getMovie, movie]);

	if (loading) return <MovieLoader />;

	return (
		movie && (
			<Segment style={{ marginTop: '60px' }}>
				<Grid>
					<Grid.Row columns="1">
						<GridColumn>
							<Header as="h1">{movie.title}</Header>
							<Embed
								id="LsGZ_2RuJ2A"
								placeholder={movie.coverImage}
								source="youtube"
							/>
						</GridColumn>
						<Grid.Column style={{ marginTop: '10px' }}>
							<Item.Content>
								<Rating
									icon="star"
									disabled
									maxRating={10}
									rating={movie.rating}
								/>
								<ItemExtra>Directed by: {movie.director}</ItemExtra>
								<ItemExtra>Runtime: {movie.runtime} min</ItemExtra>
								<Item.Content>Year: {movie.year}</Item.Content>
								<Item.Meta>{movie.summary}</Item.Meta>
								<ItemExtra>Written by: {movie.writer}</ItemExtra>
								{typeof movie.actors !== 'undefined' && (
									<Header as="h5">Actors:</Header>
								)}
								{typeof movie.actors === 'string' && <div>{movie.actors}</div>}
								{typeof movie.actors === 'object' &&
									movie.actors.map((actor: IActorObj) => (
										<Label
											image
											key={actor.imdb_code}
											as="a"
											href={`https://www.imdb.com/name/nm${actor.imdb_code}`}
										>
											<img
												src={actor.url_small_image || '/NoImage.png'}
												alt={actor.name}
											/>
											{` ${actor.name} `}
										</Label>
									))}
							</Item.Content>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		)
	);
};

export default observer(Movie);
