import { Component, PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Users extends Component {
  render() {
    return(
      <MuiThemeProvider>
        <div>
          Hello world! (Users view)
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Users;
