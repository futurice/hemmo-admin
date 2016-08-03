import { Component, PropTypes } from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchSession from '../../actions/api/sessionsDetail';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {red500} from 'material-ui/styles/colors';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';

class SessionDetail extends Component {
  constructor(props) {
    super(props);

    // for toggles states
    this.state = {};
  }

  componentDidMount() {
    this.props.actions.start();
  }

  render() {
    const { session, loading, error } = this.props;

    if (loading) {
      return(
        <div style={{textAlign: 'center'}}>
          <CircularProgress/>
        </div>
      );
    } else if (error || !session) {
      return(
        <div style={{
          margin: this.context.muiTheme.spacing.desktopGutter
        }}>
          <Card>
            <CardHeader
              title="Error fetching session data"
              subtitle="Something went wrong when trying to fetch the session data"
              style={{
                backgroundColor: red500
              }}
              avatar={<ErrorOutline/>} />
            <CardTitle title="Additional information" />
            <CardText>
              {String(error)}
            </CardText>
            <CardActions>
              <FlatButton label="Reload"
                          onTouchTap={() => this.props.actions.start()}
                          primary={true}
                          icon={<Refresh/>} />
            </CardActions>
          </Card>
        </div>
      );
    } else {
      console.log(session)
      return(
        <Table multiSelectable={true}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>User</TableHeaderColumn>
              <TableHeaderColumn>Session started</TableHeaderColumn>
              <TableHeaderColumn>Reviewed</TableHeaderColumn>
              <TableHeaderColumn>Open session</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true}>

          </TableBody>
        </Table>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    session: state.sessionDetailApi.get('data').session,
    loading: state.sessionDetailApi.get('loading'),
    error: state.sessionDetailApi.get('error')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(fetchSession, dispatch)
  };
}

SessionDetail.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionDetail);
