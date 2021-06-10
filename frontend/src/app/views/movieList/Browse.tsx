import { IMovie } from 'app/models/movie';
import BrowseLoader from 'app/views/movieList/BrowseLoader';
import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Item, Label, Rating, Segment } from 'semantic-ui-react';

export interface BrowseProps {
	movies: IMovie[];
	loading: boolean;
}

const Browse: React.FC<BrowseProps> = ({ movies, loading }) => {
	return (
		<Segment>
			{loading && <BrowseLoader />}

			{movies.length === 0 ? (
				<Header>No results</Header>
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
										movie.genres.map((genre) => (
											<Label key={genre}>{genre}</Label>
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
