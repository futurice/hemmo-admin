import { Component, PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Preferences extends Component {
  render() {
    return(
      <MuiThemeProvider>
        <div>
          Hello world! (Preferences view)
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Preferences;
