import { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
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
        label={<FormattedMessage id='cancel' />}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.props.handleClose}
      />,
      <FlatButton
        label={<FormattedMessage id='delete' />}
        style={{color: red300}}
        onTouchTap={this.props.handleDelete}
      />
    ];

    return (
      <FormattedMessage id='areYouSure'>
      { title => (
        <Dialog
          title={title}
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
        >
          {this.props.message || <FormattedMessage id='deleteDefaultWarn' />}
        </Dialog>
      )}
      </FormattedMessage>
    );
  }
}

DeleteDialog.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}
