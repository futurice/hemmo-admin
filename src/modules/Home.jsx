import React from 'react';

import Card, {
  CardContent,
  CardActions,
  CardMedia,
} from 'material-ui/Card';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import CardGridWrapper from '../components/CardGridWrapper';

import theme from '../utils/theme';

import chilicorn from '../assets/chilicorn/chilicorn_no_text-256.png';
import placeholder from '../assets/placeholder.png';

const styles = {
  chilicornHeader: {
    height: 240,
    background: `url(${chilicorn})`,
    backgroundColor: theme.palette.primary[100],
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  loremHeader: {
    height: 240,
    background: `url(${placeholder})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    objectFit: 'cover',
    width: '100%',
  },
};

export default class Home extends React.Component {
  renderChilicornCard = () => (
    <Card>
      <CardMedia>
        <div style={styles.chilicornHeader} />
      </CardMedia>
      <CardContent>
        <Typography type="headline" component="h2">Title 1</Typography>

        <Typography component="p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lobortis, diam id
          dapibus auctor, augue urna bibendum ligula, id finibus est tortor vel dolor.
          Phasellus a nulla tellus. Phasellus augue ante, consequat vel condimentum eu,
          vulputate vitae nulla. Morbi ut finibus risus. Etiam gravida felis lectus, eu
          sagittis dolor auctor et. Vivamus nec leo non ligula tincidunt vulputate quis
          efficitur mi. In est eros, dignissim ut aliquet ut, ultrices eget nisi.
        </Typography>
      </CardContent>
      <CardActions>
        <Button color="primary">Share</Button>
        <Button color="primary">Learn More</Button>
      </CardActions>
    </Card>
  );

  renderPlaceholderCard = () => (
    <Card>
      <CardMedia>
        <div style={styles.loremHeader} />
      </CardMedia>
      <CardContent>
        <Typography type="headline" component="h2">Title 2</Typography>

        <Typography component="p">
          Proin odio dolor, aliquet ac tellus sit amet, blandit venenatis massa. Phasellus
          id aliquet dui, eu rutrum lectus. Suspendisse hendrerit sollicitudin mauris, sed
          venenatis augue tristique et. Proin sed tortor lacinia, finibus diam eget,
          vulputate elit. Sed venenatis nunc nec urna molestie aliquet a at tortor. Proin
          dignissim diam ac turpis viverra auctor. Sed ac faucibus mauris, at consequat
          ipsum. Nunc cursus nunc id augue aliquet, sed vulputate nisl commodo.
        </Typography>
      </CardContent>
      <CardActions>
        <Button color="primary">Share</Button>
        <Button color="primary">Learn More</Button>
      </CardActions>
    </Card>
  );

  render() {
    return (
      <CardGridWrapper>
        { this.renderChilicornCard() }
        { this.renderPlaceholderCard() }
      </CardGridWrapper>
    );
  }
}
