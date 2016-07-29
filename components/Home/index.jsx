import { Component, PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import SessionTable from '../Sessions/SessionTable';

import Paper from 'material-ui/Paper';

class Home extends Component {
  render() {
    return(
      <div style={{
        margin: this.context.muiTheme.spacing.desktopGutter,
        display: 'flex',
        justifyContent: 'center'
      }}>
      <Card style={{marginRight: this.context.muiTheme.spacing.desktopGutter / 2, flex: 1}}>
        <CardHeader title="New feedback" subtitle="Feedback that has been assigned to you" />
        <CardText>
          <SessionTable/>
        </CardText>
      </Card>

      <Card style={{marginLeft: this.context.muiTheme.spacing.desktopGutter / 2, flex: 1}}>
        <CardHeader title="Unassigned feedback" subtitle="Feedback that has not been assigned yet" />
        <CardText>
          <SessionTable/>
        </CardText>
      </Card>
      </div>
    );
  }
}

Home.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default Home;
