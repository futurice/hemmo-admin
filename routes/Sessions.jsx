import { Component, PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Sessions extends Component {
  render() {
    return(
      <MuiThemeProvider>
        <div>
          Hello world! (Sessions view)
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Sessions;
