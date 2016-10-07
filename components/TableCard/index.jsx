import { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import rest from '../../reducers/api';
import { push } from 'react-router-redux'
import Error from '../Error';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import MiniArrowBack from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import MiniArrowForward from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import Account from 'material-ui/svg-icons/action/account-circle';
import Dimensions from '../dimensions'

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import CardToolbar from './CardToolbar';
import ModelTable from './ModelTable';

class TableCard extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.small) {
      this.props.refresh({
        page: 0,
        pageEntries: 20
      });
    }
  }

  render() {
    const { model } = this.props;

    const palette = this.context.muiTheme.palette;
    const spacing = this.context.muiTheme.spacing;

    let body = null;
    if (model.loading) {
      body = (
        <div style={{textAlign: 'center'}}>
          <CircularProgress/>
        </div>
      );
    } else if (!model.sync || !model.data || !model.data.entries || model.data.error) {
      body = (
        <Error refresh={this.props.refresh} model={model}/>
      );
    } else if (!this.props.model.data.entries.length && this.props.emptyMsg) {
      return (
        <div>
          { this.props.emptyMsg }
        </div>
      );
    } else {
      body = (
        <ModelTable
          header={this.props.header}
          entries={this.props.model.data.entries}
          onClickRow={this.props.onClickRow}
        />
      );
    }

    let toolbar = this.props.small ? null : (
      <CardToolbar
        refresh={this.props.refresh}
        totalEntries={this.props.model.data.totalEntries}
        modelName={this.props.model.data.name}
        initialPage={ parseInt(this.props.initialPage) }
        pageEntries={ parseInt(this.props.pageEntries) }
      />
    );

    return(
      <div>
        { toolbar }
        { body }
      </div>
    );

  }
}

TableCard.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

TableCard.propTypes = {
  model: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      entries: PropTypes.array.isRequired,
      totalEntries: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  header: PropTypes.arrayOf(PropTypes.object).isRequired,
  refresh: PropTypes.func.isRequired,
  onClickRow: PropTypes.func.isRequired,
  margin: PropTypes.number
};

export default TableCard;
