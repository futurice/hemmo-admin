import React from 'react';
import { injectIntl } from 'react-intl';

import Typography from 'material-ui/Typography';

@injectIntl
export default class NotFound extends React.Component {
  render() {
    const { intl: { formatMessage } } = this.props;

    return (
      <div className="not-found">
        <Typography type="display1" component="h3">
          {formatMessage({ id: 'pageNotFound' })}
        </Typography>
      </div>
    );
  }
}
