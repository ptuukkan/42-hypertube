import { IMovie } from 'app/models/movie';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
	Dimmer,
	Header,
	Item,
	Label,
	Rating,
	Segment,
	Loader,
} from 'semantic-ui-react';

export interface BrowseProps {
	movies: IMovie[];
	loading: boolean;
}

const Browse: React.FC<BrowseProps> = ({ movies, loading }) => {
	const { t } = useTranslation();

	return (
		<Segment>
			<Dimmer active={loading} inverted>
				<Loader size="large">{t('searching')}</Loader>
			</Dimmer>

			{movies.length === 0 ? (
				<Header>{t('no_results')}</Header>
			) : (
				<Item.Group divided>
					{movies.map((movie) => (
						<Item key={movie.imdb} as={Link} to={`/movies/${movie.imdb}`}>
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
											<Label key={i}>{t(genre.toLowerCase())}</Label>
										))}
								</Item.Description>
							</Item.Content>
						</Item>
					))}
				</Item.Group>
			)}
		</Segment>
	);
};

export default Browse;
