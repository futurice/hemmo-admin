import { Component, PropTypes } from 'react';

import FlatButton from 'material-ui/FlatButton';
import {red300} from 'material-ui/styles/colors';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import Divider from 'material-ui/Divider';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

export default class Error extends Component {
  render() {
    const model = this.props.model;

    let rows = [];

    if (model.error) {
      // redux-api error

      rows.push(String(model.error));
    } else if (model.data && model.data.error) {
      // server returned error

      rows.push(`Status: ${model.data.statusCode}`);
      rows.push(`Error: ${model.data.error}`);
      rows.push(`Message: ${model.data.message}`);
    } else {
      rows.push(`An unknown error occurred. Response: ${JSON.stringify(model)}`);
    }

    return(
      <div style={{
        margin: this.context.muiTheme.spacing.desktopGutter
      }}>

        <Card>
          <CardHeader
            title="Error fetching user data"
            subtitle="Something went wrong when trying to fetch the user table"
            style={{
              backgroundColor: red300
            }}
            avatar={<ErrorOutline/>} />
          <CardTitle title="Additional information" />
          <CardText>
            {rows.map((row, index) => (
              <div key={index}>
                {row}
              </div>
            ))}
          </CardText>
          <CardActions>
            <FlatButton label="Reload"
                        onTouchTap={() => this.props.refresh()}
                        primary={true}
                        icon={<Refresh/>} />
          </CardActions>
        </Card>
      </div>
    );
  }
}

Error.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};
