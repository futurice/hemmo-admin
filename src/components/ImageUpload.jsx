import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';

const styles = {
  preview: {
    padding: 32,
    width: 128,
    height: 128,
    borderRadius: '50%',
  },
};

class ImageUpload extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    setImageUrl: PropTypes.func.isRequired,
  };

  state = {
    imagePreviewUrl: '',
  };

  handleImageChange(e) {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result,
      });
      this.props.setImageUrl(file);
    };

    reader.readAsDataURL(file);
  }

  render() {
    const { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
        <img alt="Preview" style={styles.preview} src={imagePreviewUrl} />
      );
    }

    return (
      <div className="previewComponent">
        <div>
          {$imagePreview}
        </div>
        <div>
          <Button
            raised
            color="primary"
            onClick={() => this.fileUpload.click()}
          >
            {this.props.label}
          </Button>
          <input
            type="file"
            ref={fileUpload => (this.fileUpload = fileUpload)}
            style={{ display: 'none' }}
            onChange={e => this.handleImageChange(e)}
          />
        </div>
      </div>
    );
  }
}

export default ImageUpload;
