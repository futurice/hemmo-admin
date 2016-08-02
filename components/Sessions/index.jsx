import { Component, PropTypes } from 'react';
import SessionTable from './SessionTable';

class Sessions extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <SessionTable/>
    );
  }
}

export default Sessions;
