import React from 'react';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import Hidden from 'material-ui/Hidden';

import withWidth, { isWidthDown } from 'material-ui/utils/withWidth';

import { withStyles, createStyleSheet } from 'material-ui/styles';

const styleSheet = createStyleSheet('CardGridWrapper', {
  mobileContainer: {
    marginTop: 12,
    paddingBottom: 12,
  },
  desktopContainer: {
    padding: 12,
    display: 'flex',
    justifyContent: 'center',
  },
  desktopGrid: {
    maxWidth: '80%',
  },
});

@withWidth()
@withStyles(styleSheet)
export default class CardGridWrapper extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    // eslint-disable-next-line
    classes: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired,
  };

  renderChildDesktop = (component, index) =>
    <Hidden key={index} xsDown>
      <Grid item sm={12} md={10} lg={6} xl={4}>
        {component}
      </Grid>
    </Hidden>;

  renderChildMobile = component =>
    <Grid item xs={12}>
      {component}
    </Grid>;

  render() {
    const { children, classes, width } = this.props;

    // Justify center if only one column present
    const desktopJustify =
      React.Children.count(children) === 1 || isWidthDown('md', width)
        ? 'center'
        : 'flex-start';

    return (
      <div>
        <Hidden xsDown>
          <div className={classes.desktopContainer}>
            <Grid
              container
              justify={desktopJustify}
              className={classes.desktopGrid}
            >
              {React.Children.map(children, this.renderChildDesktop)}
            </Grid>
          </div>
        </Hidden>
        <Hidden smUp>
          <div className={classes.mobileContainer}>
            <Grid container>
              {React.Children.map(children, this.renderChildMobile)}
            </Grid>
          </div>
        </Hidden>
      </div>
    );
  }
}
