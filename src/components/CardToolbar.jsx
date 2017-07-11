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
    let toolbarItems = [];

    // Show all rows rgardless are they "own" or now
    if (this.props.showAll !== false) {
      toolbarItems.push(<LabelSwitch
        labelClassName="show-all"
        label={ formatMessage({ id: 'showAll' }) }
        checked={this.state.showAll}
        onChange={(event, checked) => {
          this.setState({ showAll: checked }, this.refresh);
        }}
      />);
    }

    // Free name search
    toolbarItems.push(
      <TextField
        id="name"
        className="text-field"
        label={formatMessage({ id: 'name' })}
        onKeyUp={event => {
          const val = event.target.value;
          const keyword = (val.length >= 3) ? val : '';

          if (keyword !== this.state.name) {
            this.setState({
              name: val.length >= 3 ? val : ''
            }, this.refresh);
          }
        }}
        marginForm
      />
    );

    // Rows per page
    toolbarItems.push(
      <span className="select-page-entries">
        <Typography type="body1" key="rows-per-page">
          { formatMessage({ id: 'rowsPerPage' }) }
        </Typography>

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

    // Pagination
    toolbarItems.push(
      <span className="pagination">
        <Button key='back' disabled={this.state.page <= 0} onClick={(e) => {
          this.changePage(-1);
        }}>
          <MiniArrowBack />
        </Button>

        <Typography type="body1" key='currentPageNum'>
          {`${page + 1} / ${pages}`}
        </Typography>

        <Button key='forward' disabled={this.state.page >= pages - 1} onClick={(e) => {
          this.changePage(1);
        }}>
          <MiniArrowForward/>
        </Button>
      </span>
    );

    return(
      <Toolbar className="toolbar">
          { toolbarItems }
      </Toolbar>
    );
  }
}

CardToolbar.propTypes = {
  refresh: PropTypes.func.isRequired,
  totalEntries: PropTypes.number.isRequired,
  modelName: PropTypes.string.isRequired,
  showAll: PropTypes.bool
};