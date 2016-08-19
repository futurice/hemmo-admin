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
      page: this.state.page + offset
    });
  }

  setPageEntries(event, index, pageEntries) {
    this.setState({
      page: 0,
      pageEntries
    });
  }

  componentDidMount() {
    this.props.refresh(this.state);
  }

  render() {
    const palette = this.context.muiTheme.palette;
    const spacing = this.context.muiTheme.spacing;

    const pageEntries = this.state.pageEntries;
    const totalEntries = this.props.totalEntries;
    const page = this.state.page;
    const pages = Math.ceil(totalEntries / pageEntries);

    return(
      <Toolbar>
        <ToolbarGroup>
          <ToolbarTitle text={ this.props.modelName }/>
        </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
          <ToolbarTitle text="Rows per page:" />
          <DropDownMenu iconStyle={{ fill: palette.textColor }} value={this.state.pageEntries} onChange={this.setPageEntries}>
            <MenuItem value={5} primaryText="5"/>
            <MenuItem value={20} primaryText="20"/>
            <MenuItem value={50} primaryText="50"/>
            <MenuItem value={100} primaryText="100"/>
          </DropDownMenu>

          <ToolbarTitle text={`${1 + pageEntries * page}-${pageEntries + pageEntries * page} of ${totalEntries}`}/>

          <FlatButton disabled={this.state.page <= 0} onTouchTap={(e) => {
              this.changePage(-1);
          }} icon={<MiniArrowBack/>} />
          <FlatButton disabled={this.state.page >= pages - 1} onTouchTap={(e) => {
              this.changePage(1);
          }} icon={<MiniArrowForward/>} />
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

export default CardToolbar;
