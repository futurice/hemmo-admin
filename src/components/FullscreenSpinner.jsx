import React from 'react';
import { CircularProgress } from 'material-ui/Progress';

export default class FullscreenSpinner extends React.Component {
  render() {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </div>
    );
  }
}
