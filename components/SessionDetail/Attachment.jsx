import { Component, PropTypes } from 'react';

export default class Attachment extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  render() {
    return(
      <div>
        {this.props.contentId}
      </div>
    );
  }
}
