import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import FileDownload from 'material-ui-icons/FileDownload';
import Typography from 'material-ui/Typography';

import { root } from '../utils/rest';

const mapStateToProps = state => ({
  token: state.auth.data.token,
});

@injectIntl
class Attachment extends React.Component {
  xhr = null;
  state = {
    error: false,
    attachment: null,
  };

  componentDidMount() {
    const url = `${root}/attachments/${this.props.id}`;
    const isAudio = this.props.mime.includes('audio');

    this.xhr = new XMLHttpRequest();

    this.xhr.open('GET', url);
    this.xhr.setRequestHeader('Authorization', `Bearer ${this.props.token}`);

    if (isAudio) {
      this.xhr.responseType = 'blob';
    }

    this.xhr.onreadystatechange = () => {
      if (this.xhr.readyState === 4) {
        if (this.xhr.status === 200) {
          this.setState({
            attachment: isAudio
              ? window.URL.createObjectURL(this.xhr.response)
              : this.xhr.response,
            error: false,
          });
        } else {
          this.setState({
            error: true,
            blobUrl: null,
          });
        }
      }
    };

    this.xhr.send();
  }

  componentWillUnmount() {
    this.xhr.abort();
  }

  render() {
    const { mime, intl: { formatMessage } } = this.props;

    if (this.state.error) {
      return (
        <div className="error">
          {formatMessage({ id: 'attachmentFetchError' })}
        </div>
      );
    } else if (mime.includes('audio')) {
      return (
        <div>
          <audio
            src={this.state.attachment}
            type={mime}
            controls
            autoPlay={false}
            style={{
              width: '100%',
            }}
          />

          <Button download="attachment.mp4" dense href={this.state.attachment}>
            <FileDownload />
            {formatMessage({ id: 'downloadAttachment' })}
          </Button>
        </div>
      );
    } else if (mime.includes('text')) {
      return (
        <Typography
          type="body1"
          component="p"
          style={{ margin: '0.5rem 0 1rem 0' }}
        >
          {this.state.attachment}
        </Typography>
      );
    }
  }
}

export default connect(mapStateToProps)(Attachment);
