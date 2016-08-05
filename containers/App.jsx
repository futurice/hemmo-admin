import React from 'react';
import { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import MenuDrawer from '../components/MenuDrawer';
import Header from '../components/Header';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        <MenuDrawer/>
        <Header/>
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
