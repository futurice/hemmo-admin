import React from 'react';
import { injectIntl } from 'react-intl';

import Card, { CardActions, CardContent } from 'material-ui/Card';
import { LabelSwitch } from 'material-ui/Switch';
import { red } from 'material-ui/styles/colors';
import Button from 'material-ui/Button';
import FormControl from 'material-ui/Form/FormControl';
import Grid from 'material-ui/Grid';

import DeleteDialog from '../components/DeleteDialog';

@injectIntl
export default class ChildBasic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpen: false,
    };
  }

  updateAlertSetting(event, checked) {
    this.props.onUpdate(this.props.child.id, {
      showAlerts: checked,
    });
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString(navigator.languages, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  handleDelete() {
    this.props.onDelete(this.props.child.id);
  }

  render() {
    const { intl: { formatMessage } } = this.props;

    return (
      <div>
        <Card>
          <CardContent>
            <FormControl className="form-control">
              {formatMessage({ id: 'createdAt' })}:{' '}
              {this.formatDate(this.props.child.createdAt)}
            </FormControl>
            <FormControl className="form-control" />
          </CardContent>
          <CardActions>
            <Grid item xs={12} sm={9}>
              <LabelSwitch
                checked={this.props.child.showAlerts}
                label={formatMessage({ id: 'showAlerts' })}
                onChange={this.updateAlertSetting.bind(this)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                color="accent"
                style={{ color: red[300] }}
                onClick={() => this.setState({ dialogOpen: true })}
              >
                {formatMessage({ id: 'deleteChild' })}
              </Button>
            </Grid>
          </CardActions>
        </Card>

        <DeleteDialog
          handleDelete={this.handleDelete.bind(this)}
          handleClose={() => {
            this.setState({
              dialogOpen: false,
            });
          }}
          open={this.state.dialogOpen}
          message={formatMessage({ id: 'deleteChildWarn' })}
        />
      </div>
    );
  }
}
