import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { LinearProgress } from 'material-ui/Progress';

import ImageUpload from '../components/ImageUpload';

const styles = {
  container: {
    position: 'relative',
  },
  fadeContainer: {
    opacity: 0,
  },
  opaqueContainer: {
    opacity: 1,
    maxHeight: 200,
    transition: 'all .5s',
  },
  refreshContainer: {
    flex: 1,
    textAlign: 'center',
    padding: 20,
  },
};

class DialogWithButtons extends React.Component {
  // Here we specify which props the component requires. This is especially useful in larger
  // projects. When someone else uses your component and if they forget to pass a required prop,
  // React will warn the developer through the console.

  // See https://facebook.github.io/react/docs/typechecking-with-proptypes.html for more info.

  static propTypes = {
    textField: PropTypes.shape({
      label: PropTypes.string.isRequired,
      textAfter: PropTypes.string,
    }),
    imageUpload: PropTypes.shape({
      label: PropTypes.string.isRequired,
      textAfter: PropTypes.string,
    }),
    title: PropTypes.string.isRequired,
    cancelAction: PropTypes.string,
    submitAction: PropTypes.string.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    submit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    textField: null,
    imageUpload: null,
    description: '',
    cancelAction: null,
    loading: false,
  };

  state = {
    value: '',
    file: null,
  };

  setImageUrl = file =>
    this.setState({
      file,
    });

  keyDown = event => {
    const { submit, close } = this.props;

    if (event.keyCode === 13) {
      submit(this.state);
      close();
    }
  };

  handleChange = event => {
    this.setState({
      value: event.target.value,
    });
  };

  render() {
    const {
      title,
      imageUpload,
      cancelAction,
      submitAction,
      submit,
      close,
      isOpen,
      description,
      textField,
      loading,
    } = this.props;

    const progress = loading ? <LinearProgress /> : null;

    const actions = [];
    if (cancelAction) {
      actions.push(
        <Button color="primary" key="cancel" onClick={close}>
          {cancelAction}
        </Button>,
      );
    }

    actions.push(
      <Button
        color="primary"
        key="submit"
        disabled={
          (textField && !this.state.value) || (imageUpload && !this.state.file)
        }
        onClick={() => {
          submit(this.state);
          close();
        }}
      >
        {submitAction}
      </Button>,
    );

    const dialogContents = (
      <div style={styles.container}>
        <div style={loading ? styles.fadeContainer : styles.opaqueContainer}>
          {description}

          {textField
            ? <DialogContentText>
                <TextField
                  floatingLabelText={textField.label}
                  value={this.state.value}
                  onChange={this.handleChange}
                  autoFocus
                  onKeyDown={this.keyDown}
                />
              </DialogContentText>
            : null}

          <DialogContentText>
            {textField && textField.textAfter}
          </DialogContentText>

          {imageUpload
            ? <DialogContentText>
                <ImageUpload
                  setImageUrl={this.setImageUrl}
                  label={imageUpload.label}
                />
              </DialogContentText>
            : null}

          <DialogContentText>
            {imageUpload && imageUpload.textAfter}
          </DialogContentText>
        </div>
      </div>
    );

    return (
      <Dialog open={isOpen} onRequestClose={close}>
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          {dialogContents}
        </DialogContent>
        <DialogActions>
          {actions}
        </DialogActions>

        {progress}
      </Dialog>
    );
  }
}

export default DialogWithButtons;
