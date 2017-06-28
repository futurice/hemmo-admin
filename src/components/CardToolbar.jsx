import React from 'react';
import PropTypes from 'prop-types';

import {
  Toolbar,
  ToolbarGroup,
  ToolbarTitle
} from 'material-ui/Toolbar';

import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';

import MiniArrowBack from 'material-ui-icons/KeyboardArrowLeft';
import MiniArrowForward from 'material-ui-icons/KeyboardArrowRight';

import { FormattedMessage } from 'react-intl';

export default class CardToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      pageEntries: 20
    };

    this.changePage = this.changePage.bind(this);
    this.setPageEntries = this.setPageEntries.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.page || prevState.pageEntries !== this.state.pageEntries) {
      this.props.refresh(this.state);
    }
  }

  changePage(offset) {
    this.setState({
      page: parseInt(this.state.page, 10) + offset
    });
  }

  setPageEntries(event, index, pageEntries) {
    this.setState({
      page: 0,
      pageEntries
    });
  }

  componentDidMount() {
    let pagination = {
      page: this.props.initialPage || 0,
      pageEntries: this.props.pageEntries || 20
    };

    this.setState(pagination);
    this.props.refresh(pagination);
  }

  render() {
    const palette = this.context.muiTheme.palette;

    const pageEntries = this.state.pageEntries;
    const totalEntries = this.props.totalEntries;
    const page = this.state.page;
    const pages = Math.ceil(totalEntries / pageEntries);

    let leftToolbarItems = [];

    if (this.props.containerWidth >= 800) {
      leftToolbarItems.push(
        <FormattedMessage key='name' id={this.props.modelName.toLowerCase()}>
          { text => <ToolbarTitle text={text} /> }
        </FormattedMessage>
      );
    }

    let rightToolbarItems = [];

    if (this.props.containerWidth >= 640) {
      rightToolbarItems.push(
        <FormattedMessage key='rowsText' id='rowsPerPage'>
          { text => <ToolbarTitle text={text} /> }
        </FormattedMessage>
      );
    }

    if (this.props.containerWidth >= 480) {
      rightToolbarItems.push(
        <Menu key='dropdown' iconStyle={{ fill: palette.textColor }} value={this.state.pageEntries} onChange={this.setPageEntries}>
          <MenuItem value={5} primaryText="5"/>
          <MenuItem value={20} primaryText="20"/>
          <MenuItem value={50} primaryText="50"/>
          <MenuItem value={100} primaryText="100"/>
        </Menu>
      );
    }

    rightToolbarItems.push(
      <Button key='back' disabled={this.state.page <= 0} onTouchTap={(e) => {
          this.changePage(-1);
      }} icon={<MiniArrowBack/>} />
    );

    if (this.props.containerWidth >= 540) {
      rightToolbarItems.push(
        <ToolbarTitle key='currentPageNum' text={`${page + 1} / ${pages}`}/>
      );
    }

    rightToolbarItems.push(
      <Button key='forward' disabled={this.state.page >= pages - 1} onTouchTap={(e) => {
          this.changePage(1);
      }} icon={<MiniArrowForward/>} />
    );

    return(
      <Toolbar>
        <ToolbarGroup>
          { leftToolbarItems }
        </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
          { rightToolbarItems }
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

CardToolbar.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

CardToolbar.propTypes = {
  refresh: PropTypes.func.isRequired,
  totalEntries: PropTypes.number.isRequired,
  modelName: PropTypes.string.isRequired
};
