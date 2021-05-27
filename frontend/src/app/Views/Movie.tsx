import { RootStoreContext } from 'app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
	Grid,
	GridColumn,
	Item,
	ItemExtra,
	Rating,
	Segment,
	Image,
	Header,
	Button,
} from 'semantic-ui-react';

interface IParams {
	id: string;
}
const Movie = () => {
	const { id } = useParams<IParams>();
	const rootStore = useContext(RootStoreContext);
	const { movie, getMovie } = rootStore.movieStore;

	useEffect(() => {
		if (movie === null) {
			getMovie(id);
		}
	}, [id, getMovie, movie]);

	return (
		movie && (
			<Segment style={{ marginTop: '60px' }}>
				<Grid>
					<Grid.Row columns="1">
						<GridColumn
							style={{
								backgroundImage: `url(${movie.coverImage})`,
								backgroundSize: 'cover',
								height: '450px',
								textAlign: 'center',
							}}
						>
							<Header inverted as="h1">
								{movie.title}
							</Header>

							<Button
								style={{ marginTop: '150px' }}
								content="Play"
								color="green"
								icon="play"
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
								<Item.Content>{movie.year}</Item.Content>
								<Item.Meta>{movie.summary}</Item.Meta>
								<Grid>
									<Grid.Row columns={4}>
										{movie.actors.map((actor, i) => (
											<GridColumn key={i}>
												<Image src={actor.url_small_image} fluid />
												<a
													href={`https://www.imdb.com/name/nm${actor.imdb_code}`}
												>
													{actor.name} as {actor.character_name}
												</a>
											</GridColumn>
										))}
									</Grid.Row>
									<ItemExtra>Written by: {movie.writer}</ItemExtra>
								</Grid>
							</Item.Content>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		)
	);
};

export default observer(Movie);
