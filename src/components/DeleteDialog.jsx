import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

// Colors
import { red } from 'material-ui/styles/colors';

export default class DeleteDialog extends React.Component {
  render() {
    return (
      <Dialog open={this.props.open} onRequestClose={this.handleClose}>
        <DialogTitle>
          {this.props.title || <FormattedMessage id="deleteDefaultTitle" />}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {this.props.message || <FormattedMessage id="deleteDefaultWarn" />}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.props.handleClose}>
            <FormattedMessage id="cancel" />
          </Button>

          <Button
            color="accent"
            style={{ color: red[300] }}
            onClick={this.props.handleDelete}
          >
            <FormattedMessage id="delete" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DeleteDialog.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
