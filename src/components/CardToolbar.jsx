import React from 'react';
import PropTypes from 'prop-types';

import Toolbar from 'material-ui/Toolbar';
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
      page: props.initialPage,
      pageEntries: props.pageEntries,
      pageEntriesOpen: false,
      name1: '',
      name2: '',
      showAll: false,
    };

    this.changePage = this.changePage.bind(this);
    this.setPageEntries = this.setPageEntries.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: nextProps.initialPage,
      pageEntries: nextProps.pageEntries,
    });
  }

  changePage(offset) {
    this.setState(
      {
        page: parseInt(this.state.page, 10) + offset,
      },
      this.refresh,
    );
  }

  setPageEntries(event, pageEntries) {
    this.setState({
      page: 0,
      pageEntries: pageEntries || this.state.pageEntries,
      pageEntriesOpen: false,
    });
  }

  refresh() {
    this.props.refresh({
      showAll: this.state.showAll,
      name1: this.state.name1,
      name2: this.state.name2,
      page: this.state.page,
      pageEntries: this.state.pageEntries,
    });
  }

  setAttribute(name, value) {
    this.setState({ [name]: value }, this.refresh);
  }

  handleKeywordSearch(event) {
    const name = event.target.name;
    const value = event.target.value;
    const keyword = value.length >= 3 ? value : '';

    if (keyword !== this.state[name]) {
      this.setAttribute(name, value);
    }
  }

  render() {
    const { customLabels, hideElems, intl: { formatMessage } } = this.props;
    const pageEntries = this.state.pageEntries;
    const totalEntries = this.props.totalEntries;
    const pages = Math.ceil(totalEntries / pageEntries);
    let toolbarItems = [];

    // Show all rows rgardless are they "own" or now
    if (hideElems && !hideElems.includes('showAll')) {
      toolbarItems.push(
        <LabelSwitch
          key="show-all"
          labelClassName="show-all"
          label={formatMessage({ id: 'showAll' })}
          checked={this.state.showAll}
          onChange={(event, checked) => {
            this.setAttribute('showAll', checked);
          }}
        />,
      );
    }

    // Free textfield search for name #1
    if (hideElems && !hideElems.includes('name1')) {
      toolbarItems.push(
        <TextField
          key="name1"
          name="name1"
          className="text-field"
          label={formatMessage({
            id: customLabels.name1 ? customLabels.name1 : 'name',
          })}
          onChange={this.handleKeywordSearch.bind(this)}
          marginForm
        />,
      );
    }

    // Free textfield search for name #2
    if (hideElems && !hideElems.includes('name2')) {
      toolbarItems.push(
        <TextField
          key="name2"
          name="name2"
          className="text-field"
          label={formatMessage({
            id: customLabels.name2 ? customLabels.name2 : 'name',
          })}
          onChange={this.handleKeywordSearch.bind(this)}
          marginForm
        />,
      );
    }

    // Rows per page
    toolbarItems.push(
      <span key="page-entries" className="select-page-entries">
        <Typography type="body1" key="rows-per-page">
          {formatMessage({ id: 'rowsPerPage' })}
        </Typography>

        <Button
          aria-owns="simple-menu"
          aria-haspopup="true"
          onClick={e =>
            this.setState({ pageEntriesOpen: true, anchorEl: e.currentTarget })}
        >
          {this.state.pageEntries}
          <ArrowDropDown />
        </Button>

        <Menu
          anchorEl={this.state.anchorEl}
          open={this.state.pageEntriesOpen}
          onRequestClose={this.setPageEntries}
        >
          {[5, 20, 50, 100].map((opt, index) =>
            <MenuItem
              key={opt}
              selected={opt === this.state.pageEntries}
              onClick={event => this.setPageEntries(event, opt)}
            >
              {opt}
            </MenuItem>,
          )}
        </Menu>
      </span>,
    );

    // Pagination
    toolbarItems.push(
      <span key="pagination" className="pagination">
        <Button
          key="back"
          disabled={this.state.page <= 0}
          onClick={e => {
            this.changePage(-1);
          }}
        >
          <MiniArrowBack />
        </Button>

        <Typography type="body1" key="currentPageNum">
          {`${this.state.page + 1} / ${pages}`}
        </Typography>

        <Button
          key="forward"
          disabled={this.state.page >= pages - 1}
          onClick={e => {
            this.changePage(1);
          }}
        >
          <MiniArrowForward />
        </Button>
      </span>,
    );

    return (
      <Toolbar className="toolbar">
        {toolbarItems}
      </Toolbar>
    );
  }
}

CardToolbar.propTypes = {
  refresh: PropTypes.func.isRequired,
  totalEntries: PropTypes.number.isRequired,
  hideElems: PropTypes.array.isRequired,
  customLabels: PropTypes.object.isRequired,
};
