import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

@injectIntl
class SnoozeDialog extends React.Component {
  constructor(props) {
    super(props);

    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleRequestClose(event) {
    this.props.handleRequestClose(event.currentTarget.value);
  }

  render() {
    const { open, intl: { formatMessage } } = this.props;

    return (
      <Dialog open={open} onRequestClose={this.handleRequestClose}>
        <DialogTitle>
          {formatMessage({ id: 'snoozeAlerts' })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {formatMessage({ id: 'snoozeAlertsExplain' })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleRequestClose}
            value="30days"
            color="primary"
          >
            {formatMessage({ id: 'next30days' })}
          </Button>
          <Button
            onClick={this.handleRequestClose}
            value="forever"
            color="primary"
          >
            {formatMessage({ id: 'forever' })}
          </Button>
          <Button
            onClick={this.handleRequestClose}
            value=""
            raised
            color="primary"
          >
            {formatMessage({ id: 'cancel' })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SnoozeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
  childId: PropTypes.string.isRequired,
};

export default SnoozeDialog;
