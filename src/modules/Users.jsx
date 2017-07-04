import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from 'material-ui/Table';

import { LinearProgress } from 'material-ui/Progress';
import ListIcon from 'material-ui-icons/List';
import { DialogContentText } from 'material-ui/Dialog';

import DialogWithButtons from '../components/DialogWithButtons';
import rest from '../utils/rest';

// Here we 'connect' the component to the Redux store. This means that the component will receive
// parts of the Redux store as its props. Exactly which parts is chosen by mapStateToProps.

// We should map only necessary values as props, in order to avoid unnecessary re-renders. In this
// case we need the list of users, as returned by the REST API. The component will be able to access
// the users list via `this.props.users`. Additionally, we need details about the selected user,
// which will be available as `this.props.userDetails`.

// The second function (mapDispatchToProps) allows us to 'make changes' to the Redux store, by
// dispatching Redux actions. The functions we define here will be available to the component as
// props, so in our example the component will be able to call `this.props.refresh()` in order to
// refresh the users list, and `this.props.refreshUser(user)` to fetch more info about a specific
// user.

// More details: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options

// The injectIntl decorator makes this.props.intl.formatMessage available to the component, which
// is used for localization.

const mapStateToProps = state => ({
  users: state.users,
  usersLoading: state.users.loading,
  userDetails: state.userDetails,
});

const mapDispatchToProps = dispatch => ({
  refresh: (showAll = false, name = null) => {
    dispatch(rest.actions.users({
      showAll: showAll,
      name: name
    }));
  },
  refreshUser: (user) => {
    dispatch(rest.actions.userDetails({ userId: user.id }));
  },
});

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class Users extends React.Component {
  // Component initial state.
  // Here we keep track of whether the user details dialog is open.
  state = {
    dialogOpen: false,
    showAll: false,
    name: ''
  }

  // Refresh user list when component is first mounted
  componentDidMount() {
    const { refresh } = this.props;

    refresh();
  }

  renderProgressBar() {
    const { usersLoading } = this.props;

    return usersLoading
      ? (
        <div style={{ marginBottom: '-5px' }}>
          <LinearProgress />
        </div>
      ) : null;
  }

  nameSearch() {
    this.props.refresh(this.state.showAll, this.state.name)
  }

  render() {
    const { users, refreshUser, userDetails, intl: { formatMessage } } = this.props;
    const { dialogOpen } = this.state;
    const userList = users.data.length ? users.data[0].users : [];

    // Show the following user details in the dialog
    const userDetailsDescription = (
      <div>
        <DialogContentText>
          <b>{ formatMessage({ id: 'userId' })}</b>{`: ${userDetails.data.id}` }
        </DialogContentText>
        <DialogContentText>
          <b>{ formatMessage({ id: 'email' })}</b>{`: ${userDetails.data.email}` }
        </DialogContentText>
        <DialogContentText>
          <b>{ formatMessage({ id: 'description' })}</b>{`: ${userDetails.data.description}` }
        </DialogContentText>
      </div>
    );

    return (
      <div>
        <DialogWithButtons
          title={formatMessage({ id: 'userDetails' })}
          description={userDetailsDescription}
          submitAction={formatMessage({ id: 'close' })}
          isOpen={dialogOpen}
          loading={userDetails.loading}
          submit={() => this.setState({ dialogOpen: false })}
          close={() => this.setState({ dialogOpen: false })}
        />

        { this.renderProgressBar() }

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{formatMessage({ id: 'name' })}</TableCell>
              <TableCell>{formatMessage({ id: 'lastFeedback' })}</TableCell>
              <TableCell>{formatMessage({ id: 'assignee' })}</TableCell>
              <TableCell>{formatMessage({ id: 'email' })}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {
              // Loop over each user and render a <TableRow>
              userList.map((user, i) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>{user.assignee}</TableCell>
                  <TableCell></TableCell>
                  <TableCell numeric>
                    <Button
                      color="primary"
                      onClick={() => {
                        refreshUser(user);
                        this.setState({ dialogOpen: true });
                      }}
                    >
                      <ListIcon style={{ paddingRight: 10 }} />
                      {formatMessage({ id: 'showUserDetails' })}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}
