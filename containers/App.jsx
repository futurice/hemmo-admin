import React from 'react';
import { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MenuDrawer from '../components/MenuDrawer';
import Header from '../components/Header';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drawerOpened: false,
      activeView: 'Sessions'
    }
  }

  toggleDrawer() {
    this.setState({
      drawerOpened: !this.state.drawerOpened
    });
  }

  closeDrawer() {
    this.setState({
      drawerOpened: false
    });
  }

  setView(view) {
    this.setState({
      activeView: view
    });
  }

  render() {
    return(
      <MuiThemeProvider>
        <div>
          <MenuDrawer
            open={this.state.drawerOpened}
            closeDrawer={this.closeDrawer.bind(this)}
            setView={this.setView.bind(this)}
          />
          <Header
            toggleDrawer={this.toggleDrawer.bind(this)}
            activeView={this.state.activeView}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

import * as TodoActions from '../actions/todos';
/*
*/

/*
class App extends Component {
  render() {
    const { todos, actions } = this.props;
    console.log(<MenuDrawer />);
    return (
      <div>
        <MenuDrawer />
        <MainSection todos={todos} actions={actions} />
      </div>
    );
  }
}


App.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

*/
function mapStateToProps(state) {
  return {
    todos: state.todos
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
