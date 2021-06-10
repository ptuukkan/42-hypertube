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
	Loader,
	Dimmer,
	Image,
} from 'semantic-ui-react';
import { IActorObj } from 'app/models/movie';
import { useTranslation } from 'react-i18next';

interface IParams {
	id: string;
}

const Movie = () => {
	const { t } = useTranslation();
	const { id } = useParams<IParams>();
	const rootStore = useContext(RootStoreContext);
	const [loading, setLoading] = useState(true);
	const [playerLoader, setPlayerLoader] = useState(false);
	const [playMovie, setPlayMovie] = useState(false);
	const { movie, getMovie } = rootStore.movieStore;

	useEffect(() => {
		if (movie === null || movie.imdb !== id) getMovie(id);
		if (movie && movie.imdb === id) setLoading(false);
	}, [id, getMovie, movie]);

	const startPlay = () => {
		setPlayerLoader(true);
		setInterval(() => {
			setPlayMovie(true);
			setPlayerLoader(false);
		}, 5000);
	};

	if (loading) return <MovieLoader />;

	return (
		movie && (
			<Segment style={{ marginTop: '60px' }}>
				<Grid>
					<Grid.Row columns="1">
						<GridColumn>
							<Header as="h1">{movie.title}</Header>
							{!playMovie && (
								<Dimmer.Dimmable
									dimmed={playerLoader}
									style={{
										backgroundImage: `url(${movie.coverImage})`,
										backgroundSize: 'cover',
										backgroundPosition: 'right 0px bottom 0px',
										cursor: 'pointer',
									}}
								>
									<Dimmer active={playerLoader} inverted>
										<Loader>
											{t('movie_loading', { movieName: movie.title })}
										</Loader>
									</Dimmer>
									<Image src="/background.png" onClick={() => startPlay()} />
								</Dimmer.Dimmable>
							)}

							{!playerLoader && playMovie && (
								<Embed
									id="LsGZ_2RuJ2A"
									placeholder="/background.png"
									source="youtube"
									autoplay
								/>
							)}
						</GridColumn>
						<Grid.Column style={{ marginTop: '10px' }}>
							<Item.Content>
								<Rating
									icon="star"
									disabled
									maxRating={10}
									rating={movie.rating}
								/>
								<ItemExtra>
									{t('directed', { director: movie.director })}
								</ItemExtra>
								<ItemExtra>{t('runtime', { time: movie.runtime })}</ItemExtra>
								<Item.Content>{t('year', { year: movie.year })}</Item.Content>
								<Item.Meta>{movie.summary}</Item.Meta>
								<ItemExtra>{t('written', { writer: movie.writer })}</ItemExtra>
								{typeof movie.actors !== 'undefined' && (
									<Header as="h5">{t('actors')}</Header>
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
