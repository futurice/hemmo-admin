import { connect } from 'react-redux';
import { Component, PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import SessionTable from '../Sessions/SessionTable';

import { FormattedMessage } from 'react-intl';

import Paper from 'material-ui/Paper';

class Home extends Component {
  render() {
    return(
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: this.context.muiTheme.spacing.desktopGutter / 2
      }}>
      <Card style={{
        margin: this.context.muiTheme.spacing.desktopGutter / 2,
        flex: 1,
        flexBasis: '450px'
      }}>
        <CardHeader
          title={ <FormattedMessage id='newFeedback' /> }
          subtitle={ <FormattedMessage id='newFeedbackDesc' /> } />
        <CardText>
          <SessionTable filter={{
            reviewed: 0,
            assignee: this.props.employeeId,
            small: true
          }} noFeedbackMsg={ <FormattedMessage id='newFeedbackEmpty' /> } small={true}/>
        </CardText>
      </Card>

      <Card style={{
        margin: this.context.muiTheme.spacing.desktopGutter / 2,
        flex: 1,
        flexBasis: '450px'
      }}>
        <CardHeader
          title={ <FormattedMessage id='unhandledFeedback' /> }
          subtitle={ <FormattedMessage id='unhandledFeedbackDesc' /> }
        />
        <CardText>
          <SessionTable extra={true} filter={{
            reviewed: 0,
            small: true
          }} noFeedbackMsg={ <FormattedMessage id='unhandledFeedbackEmpty' /> } small={true}/>
        </CardText>
      </Card>
      </div>
    );
  }
}

Home.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

function select(state, ownProps) {
  return {
    employeeId: state.auth.data.employeeId
  };
}

export default connect(select)(Home);
