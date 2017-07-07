import React from 'react';

import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

const mapStateToProps = (state, ownProps) => ({

});

const mapDispatchToProps = dispatch => ({
  
});

@connect(mapStateToProps, mapDispatchToProps)
export default class NotFound extends React.Component {
  render() {

    return (
      <div className="not-found">
        <Paper elevation={4}>
          <Typography type="headline" component="h3">
            Page you tried to load could't be found
          </Typography>
        </Paper>
      </div>
    );
  }
}
