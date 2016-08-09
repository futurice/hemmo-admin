import { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'

const mimeCodec = 'audio/aac';

class Attachment extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      audio: null,
      mediaSource: null
    };
  }

  componentDidMount() {
    window.MediaSource = window.MediaSource || window.WebKitMediaSource;

    if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
      const mediaSource = new MediaSource();
      const audio = document.querySelector('audio');
      this.state.mediaSource = mediaSource;
      audio.src = window.URL.createObjectURL(mediaSource);
      this.state.audio = audio;
      mediaSource.addEventListener('sourceopen', this.onSourceOpen.bind(this), false);

    } else {
      console.log("NOT SUPPORTED");
      return;
    }
  }

  onSourceOpen() {
    const mediaSource = this.state.mediaSource;
    const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    const audio = this.state.audio;
    console.log(audio);
    const assetURL = 'http://localhost:3001/attachment/' + this.props.contentId;

    this.fetchAudioAsset(assetURL, function (buf) {
      sourceBuffer.addEventListener('updateend', function (_) {
        mediaSource.endOfStream();
        audio.play();

        //console.log(mediaSource.readyState); // ended
      });
      sourceBuffer.appendBuffer(buf);
    });
  }

  fetchAudioAsset(url, callback) {

    let auth = JSON.parse(localStorage.getItem('auth'));
    if (!auth) {
      browserHistory.push('/login');
    }

    const token = 'Bearer ' + auth.token;
    console.log(url);
    console.log(auth);

    const xhr = new XMLHttpRequest;
    xhr.open('get', url);
    xhr.responseType = 'arraybuffer';
    xhr.setRequestHeader('Authorization', token);
    xhr.onload = function () {
      callback(xhr.response);
    };
    xhr.send();
  }


  render() {
    return(
      <div>
        <audio controls autoPlay></audio>
      </div>
    );
  }
}

export default connect()(Attachment);
