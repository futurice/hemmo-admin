import { Component, PropTypes } from 'react';
import UserTable from './UserTable';

class Users extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <UserTable/>
    );
  }
}

export default Users;
