import React from 'react';

import Typography from 'material-ui/Typography';


export default class PageHeader extends React.Component {
  render() {

    return (
      <Typography type="display1" className="page-header">
        {this.props.header}
      </Typography>
    );
  }
}