import React from 'react';
import { Link } from 'react-router-dom';
import { Item, Segment } from 'semantic-ui-react';

export interface MainContetProps {}

const MainContet: React.FC<MainContetProps> = () => {
	return (
		<Segment style={{ minHeight: 500, padding: 60 }}>
			<Item.Group divided>
				<Item as={Link} to="#">
					<Item.Image src="/movie.png" />
					<Item.Content>
						<Item.Header>12 Years a Slave</Item.Header>
						<Item.Meta>
							<span className="cinema">Union Square 14</span>
						</Item.Meta>
						<Item.Description>
							12 Years a Slave on vuonna 2013 ensi-iltansa saanut Steve
							McQueenin ohjaama historiallinen draamaelokuva, joka perustuu
							Solomon Northupin samannimiseen omaelämäkertaan vuodelta 1853.
							Northup oli vapaa afroamerikkalainen mies, kun hänet kaapattiin
							Washingtonissa vuonna 1841 ja myytiin
						</Item.Description>
					</Item.Content>
				</Item>

				<Item as={Link} to="#">
					<Item.Image src="/movie.png" />

					<Item.Content>
						<Item.Header >My Neighbor Totoro</Item.Header>
						<Item.Meta>
							<span className="cinema">IFC Cinema</span>
						</Item.Meta>
						<Item.Description>
							Naapurini Totoro on japanilainen Hayao Miyazakin käsikirjoittama
							ja ohjaama fantasia-aiheinen anime-elokuva vuodelta 1988. Elokuvan
							tuotti Studio Ghibli.
						</Item.Description>
					</Item.Content>
				</Item>

				<Item as={Link} to="#">
					<Item.Image src="/movie.png" />

					<Item.Content>
						<Item.Header>Watchmen</Item.Header>
						<Item.Meta>
							<span className="cinema">IFC</span>
						</Item.Meta>
						<Item.Description>
							Watchmen on yhdysvaltalainen supersankarisarja, joka perustuu DC
							Comicsin sarjakuvaromaaniin Vartijat. Televisiosarjan on luonut
							Damon Lindelof, ja sen yhdeksänjaksoinen ensimmäinen tuotantokausi
							alkoi HBO:lla 20. lokakuuta 2019. Wikipedia
						</Item.Description>
					</Item.Content>
				</Item>
			</Item.Group>
		</Segment>
	);
};

export default MainContet;
