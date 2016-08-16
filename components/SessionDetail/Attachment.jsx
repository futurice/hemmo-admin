import { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import config from 'config';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';

class Attachment extends Component {
  constructor() {
    super();

    this.state = {
      blobUrl: '',
      error: ''
    };
  }

  componentDidMount() {
    let url = `${config.API_ROOT}/attachment/${this.props.contentId}`;

    let request = new XMLHttpRequest();
    let audio = this.refs.audio;

    request.open('GET', url);
    request.setRequestHeader('Authorization', `Bearer ${this.props.token}`);
    request.responseType = 'blob';

    request.onreadystatechange = () => {
      if(request.readyState === 4) {
        if(request.status === 200) {
          let blobUrl = window.URL.createObjectURL(request.response);

          this.setState({blobUrl});
        } else {
          this.setState({error: 'An error occurred while fetching attachment. Please try again later.'});
        }
      }
    };

    request.send();
  }

  render() {
    if (this.state.error) {
      return <div style={{textAlign: 'center'}} >
        { this.state.error }
      </div>;
    } else if (!this.state.blobUrl) {
      return <div style={{textAlign: 'center'}} >
        <CircularProgress />
      </div>;
    } else {
      return(
        <div>
          <audio ref={'audio'} src={this.state.blobUrl} controls autoPlay style={{
            width: '100%',
            paddingBottom: '24px'
          }} />

          <FlatButton download={'attachment.mp4'} href={this.state.blobUrl}
            label="Download attachment" icon={<FileDownload/>} primary={false}/>
        </div>
      );
    }
  }
}

function select(state, ownProps) {
  return {
    token: state.auth.data.token
  };
}

export default connect(select)(Attachment);
