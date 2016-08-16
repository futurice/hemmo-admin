import { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import config from 'config';

class Attachment extends Component {
  render() {
    return(
      <div>
        <audio crossorigin={ 'use-credentials' } controls autoPlay src={`${config.API_ROOT}/attachment/${this.props.contentId}`} style={{
          width: '100%'
        }}></audio>
      </div>
    );
  }
}

export default connect()(Attachment);
