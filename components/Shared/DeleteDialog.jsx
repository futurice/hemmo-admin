import { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

// Colors
import {
  red300
} from 'material-ui/styles/colors';

export default class DeleteDialog extends Component {
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.props.handleClose}
      />,
      <FlatButton
        label="Delete"
        style={{color: red300}}
        onTouchTap={this.props.handleDelete}
      />
    ];

    return (
      <Dialog
        title="Are you sure?"
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.handleClose}
      >
        {this.props.message || 'Deleting this item will destroy it forever! Only proceed if you are absolutely sure.'}
      </Dialog>
    );
  }
}

DeleteDialog.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}
