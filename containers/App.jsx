import React from 'react';
import { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import rest from '../reducers/api';

import RaisedButton from 'material-ui/RaisedButton';
import MenuDrawer from '../components/MenuDrawer';
import Header from '../components/Header';

// 1 hour
const jwtRefreshInterval = 1000 * 60 * 60;

class App extends Component {
  constructor(props) {
    super(props);

    this.jwtTimer = null;
  }

  componentDidMount() {
    this.jwtTimer = setInterval(_ => {
      console.log('renewing auth token');
      this.props.dispatch(rest.actions.renewAuth());
    }, jwtRefreshInterval);

    console.log('renewing auth token');
    this.props.dispatch(rest.actions.renewAuth());
  }

  componentWillUnmount() {
    if (this.jwtTimer) {
      clearInterval(this.jwtTimer);
    }

    this.jwtTimer = null;
  }

  render() {
    return(
      <div>
        <MenuDrawer pathname={this.props.location.pathname} />
        <Header pathname={this.props.location.pathname} params={this.props.params} />
        {React.cloneElement(this.props.children, this.props)}
      </div>
    );
  }
}

function select(state, ownProps) {
  return {
    location: ownProps.location,
    params: ownProps.params
  };
}

export default connect(select)(App);
