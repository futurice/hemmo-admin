import React from 'react';

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Snackbar from 'material-ui/Snackbar';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import { connect } from 'react-redux';
import { createAction, createReducer } from 'redux-act';

const mapStateToProps = state => ({
  err: state.err,
});

class ErrorSnackbar extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      detailsOpen: false,
      id: -1,
      msg: '',
      details: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.err.id !== this.state.id) {
      this.setState({
        open: true,
        msg: nextProps.err.msg,
        details: nextProps.err.details,
        id: nextProps.err.id,
      });
    }
  }

  handleRequestClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      open: false,
    });
  };

  openDetails = () => {
    this.setState({
      detailsOpen: true,
    });
  };

  closeDetails = () => {
    this.setState({
      detailsOpen: false,
    });
  };

  renderSnackbar = (open, msg) =>
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={6000}
      message={
        <span id="error-snackbar">
          {msg}
        </span>
      }
      onRequestClose={this.handleRequestClose}
      action={[
        <Button key="undo" color="accent" onClick={this.openDetails}>
          DETAILS
        </Button>,
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={this.handleRequestClose}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />;

  renderDetails = (open, msg) =>
    <Dialog open={open} onRequestClose={this.closeDetails}>
      <DialogTitle>
        {'Error details'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {msg}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={this.closeDetails} color="primary">
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>;

  render() {
    const { open, msg, detailsOpen, details } = this.state;

    return (
      <div>
        {this.renderSnackbar(open, msg)}
        {this.renderDetails(detailsOpen, details)}
      </div>
    );
  }
}

// Action creators
export const showError = createAction('Show error message');

// Initial state
const initialState = {
  msg: null,
  details: {},
  id: -1,
};

// Reducer
export const reducer = createReducer(
  {
    [showError]: (state, payload) => ({
      msg: payload.msg,
      details: payload.details,
      id: state.id + 1,
    }),
  },
  initialState,
);

export default connect(mapStateToProps)(ErrorSnackbar);
