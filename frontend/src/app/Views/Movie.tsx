import { RootStoreContext } from 'app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
	Grid,
	GridColumn,
	Item,
	ItemExtra,
	Rating,
	Segment,
	Image,
	Header,
	Dimmer,
	Loader,
} from 'semantic-ui-react';

interface IParams {
	id: string;
}
const Movie = () => {
	const { id } = useParams<IParams>();
	const rootStore = useContext(RootStoreContext);
	const [loading, setLoading] = useState(true);
	const { movie, getMovie } = rootStore.movieStore;
	const [buffering, setBuffering] = useState(false);

	useEffect(() => {
		getMovie(id)
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	}, [id, getMovie]);

	if (loading)
		return (
			<Dimmer active={loading} inverted>
				<Loader size="large">Loading</Loader>
			</Dimmer>
		);

	return (
		movie && (
			<Segment style={{ marginTop: '60px' }}>
				<Grid>
					<Grid.Row columns="1">
						<GridColumn>
							<Header as="h1">{movie.title}</Header>
							<Loader inverted active={buffering} size="huge">
								Buffering
							</Loader>
							<ReactPlayer
								muted={true}
								onBufferEnd={() => {
									setBuffering(false);
									console.log('bufferend');
								}}
								onBuffer={() => {
									setBuffering(true);
									console.log('buffer');
								}}
								onError={(error) => console.dir(error)}
								width="1000px"
								height="418px"
								controls
								url={`http://localhost:8080/api/movies/${movie.imdb}/stream`}
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
												<Image
													src={actor.url_small_image || '/NoImage.png'}
													fluid
												/>
												<Item.Content
													as="a"
													href={`https://www.imdb.com/name/nm${actor.imdb_code}`}
												>
													{actor.name} as {actor.character_name}
												</Item.Content>
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
