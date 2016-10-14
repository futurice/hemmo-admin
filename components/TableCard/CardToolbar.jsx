import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

import MiniArrowBack from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import MiniArrowForward from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import Dimensions from '../dimensions';

class CardToolbar extends Component {
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
      page: parseInt(this.state.page) + offset
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
    const spacing = this.context.muiTheme.spacing;

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
        <DropDownMenu key='dropdown' iconStyle={{ fill: palette.textColor }} value={this.state.pageEntries} onChange={this.setPageEntries}>
          <MenuItem value={5} primaryText="5"/>
          <MenuItem value={20} primaryText="20"/>
          <MenuItem value={50} primaryText="50"/>
          <MenuItem value={100} primaryText="100"/>
        </DropDownMenu>
      );
    }

    rightToolbarItems.push(
      <FlatButton key='back' disabled={this.state.page <= 0} onTouchTap={(e) => {
          this.changePage(-1);
      }} icon={<MiniArrowBack/>} />
    );

    if (this.props.containerWidth >= 540) {
      rightToolbarItems.push(
        <ToolbarTitle key='currentPageNum' text={`${page + 1} / ${pages}`}/>
      );
    }

    rightToolbarItems.push(
      <FlatButton key='forward' disabled={this.state.page >= pages - 1} onTouchTap={(e) => {
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

export default Dimensions()(CardToolbar);
