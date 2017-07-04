import React from 'react';
import PropTypes from 'prop-types';

import Toolbar, {
  ToolbarGroup,
  ToolbarTitle
} from 'material-ui/Toolbar';

import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import MiniArrowBack from 'material-ui-icons/KeyboardArrowLeft';
import MiniArrowForward from 'material-ui-icons/KeyboardArrowRight';
import ArrowDropDown from 'material-ui-icons/ArrowDropDown';
import Typography from 'material-ui/Typography';
import { LabelSwitch } from 'material-ui/Switch';
import TextField from 'material-ui/TextField';

import { injectIntl } from 'react-intl';


@injectIntl
export default class CardToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      pageEntries: 20,
      pageEntriesOpen: false,
      name: '',
      showAll: false
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

  setPageEntries(event, pageEntries) {
    this.setState({
      page: 0,
      pageEntries: pageEntries,
      pageEntriesOpen: false
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

  refresh() {
    this.props.refresh({
      showAll: this.state.showAll,
      name: this.state.name,
      page: this.state.page,
      pageEntries: this.state.pageEntries});
  }

  render() {
    const { intl: { formatMessage } } = this.props;
    const pageEntries = this.state.pageEntries;
    const totalEntries = this.props.totalEntries;
    const page = this.state.page;
    const pages = Math.ceil(totalEntries / pageEntries);

    let leftToolbarItems = [];
    let rightToolbarItems = [];

    /*if (this.props.containerWidth >= 800) {
      leftToolbarItems.push(
        <FormattedMessage key='name' id={this.props.modelName.toLowerCase()}>
          { text => <ToolbarTitle text={text} /> }
        </FormattedMessage>
      );
    }*/

    leftToolbarItems.push(
      <span key="filter-rows">
        <LabelSwitch
          checked={this.state.showAll}
          onChange={(event, checked) => {
            this.setState({ showAll: checked }, this.refresh);
          }}
          label={formatMessage({ id: 'showAll' })}
        />
        <TextField
          id="name"
          className="text-field"
          label={formatMessage({ id: 'name' })}
          onKeyUp={event => {
            this.setState({ name: event.target.value }, this.refresh);
          }}
          marginForm
        />
      </span>
    );

    rightToolbarItems.push(
      <Typography type="body1" key="rows-per-page">
        { formatMessage({ id: 'rowsPerPage' }) }
      </Typography>
    );

    rightToolbarItems.push(
      <span key="select-rows-per-page">
        <Button aria-owns="simple-menu" aria-haspopup="true" onClick={(e) => this.setState({pageEntriesOpen: true, anchorEl: e.currentTarget})}>
          {this.state.pageEntries}
          <ArrowDropDown />
        </Button>
        <Menu anchorEl={this.state.anchorEl} open={this.state.pageEntriesOpen} onRequestClose={this.setPageEntries}>
          {[5, 20, 50, 100].map((opt, index) => (
            <MenuItem
              key={opt}
              selected={opt === this.state.pageEntries}
              onClick={event => this.setPageEntries(event, opt)}>
              {opt}
            </MenuItem>
          ))}
        </Menu>
      </span>
    );

    rightToolbarItems.push(
      <Button key='back' disabled={this.state.page <= 0} onClick={(e) => {
        this.changePage(-1);
      }}>
        <MiniArrowBack />
      </Button>
    );

    rightToolbarItems.push(
      <Typography type="body1" key='currentPageNum'>
        {`${page + 1} / ${pages}`}
      </Typography>
    );
        
    rightToolbarItems.push(
      <Button key='forward' disabled={this.state.page >= pages - 1} onClick={(e) => {
        this.changePage(1);
      }}>
        <MiniArrowForward/>
      </Button>
    );

    return(
      <Toolbar className="toolbar">
          { leftToolbarItems }
          <span className="pull-right">
            { rightToolbarItems }
          </span>
      </Toolbar>
      /*
      <Toolbar>
        <ToolbarGroup>
          { leftToolbarItems }
        </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
          { rightToolbarItems }
        </ToolbarGroup>
      </Toolbar>
      */
    );
  }
}

CardToolbar.propTypes = {
  refresh: PropTypes.func.isRequired,
  totalEntries: PropTypes.number.isRequired,
  modelName: PropTypes.string.isRequired
};
