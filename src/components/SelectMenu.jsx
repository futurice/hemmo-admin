import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import ArrowDropDown from 'material-ui-icons/ArrowDropDown';

@injectIntl
export default class SelectMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: undefined,
      selectedIndex: props.selectedId,
      open: false,
    };

    this.closeMenu = this.closeMenu.bind(this);
    this.openMenu = this.openMenu.bind(this);
  }

  openMenu(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  closeMenu() {
    this.setState({
      open: false,
    });
  }

  selectItem(event, id) {
    this.props.onSelect(id);

    this.setState({
      selectedIndex: id,
      open: false,
    });
  }

  render() {
    const { intl: { formatMessage } } = this.props;

    return (
      <span style={{ display: 'inline-flex' }}>
        <List>
          <ListItem
            button
            aria-haspopup="true"
            aria-controls={this.props.id}
            aria-label={this.props.label}
            onClick={this.openMenu}
          >
            <ListItemText
              primary={this.props.label || formatMessage({ id: 'selectValue' })}
            />
            <ArrowDropDown />
          </ListItem>
        </List>
        <Menu
          id={this.props.id}
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onRequestClose={this.closeMenu}
        >
          {!this.props.loading
            ? this.props.data.map((opt, i) =>
                <MenuItem
                  key={i}
                  className={opt.className}
                  selected={opt.id === this.state.selectedIndex}
                  onClick={event => this.selectItem(event, opt.id)}
                >
                  {opt.name}
                </MenuItem>,
              )
            : null}
        </Menu>
      </span>
    );
  }
}

SelectMenu.propTypes = {
  id: PropTypes.string.isRequired,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  label: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};
