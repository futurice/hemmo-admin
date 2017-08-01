import React from 'react';
import { connect } from 'react-redux';
import rest from '../utils/rest';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui-icons/Edit';
import Delete from 'material-ui-icons/Delete';

import PageHeader from '../components/PageHeader';
import DeleteDialog from '../components/DeleteDialog';
import TableCard from '../components/TableCard';
import EditOrganisationDialog from '../components/EditOrganisationDialog';

const mapStateToProps = state => ({
  organisations: state.organisations,
  organisationUnit: state.organisationUnit,
});

const mapDispatchToProp = dispatch => ({
  getOrganisations: params => {
    dispatch(rest.actions.organisations(params));
  },
  loadOrganisationUnit: organisationId => {
    dispatch(rest.actions.organisationUnit.get({ organisationId }));
  },
  saveOrganisationUnit: (id, body, cb, fail) => {
    console.log(cb);
    dispatch(
      rest.actions.organisationUnit.put(
        { organisationId: id },
        { body: JSON.stringify(body) },
      ),
    )
      .then(cb)
      .catch(fail);
  },
  createOrganisationUnit: (body, cb, fail) => {
    console.log(body);
    dispatch(
      rest.actions.organisationCreate(null, { body: JSON.stringify(body) }),
    )
      .then(cb)
      .catch(fail);
  },
  deleteOrganisationUnit: (id, cb, fail) => {
    dispatch(
      rest.actions.organisationUnit.delete({
        organisationId: id,
      }),
    )
      .then(cb)
      .catch(fail);
  },
});

@injectIntl
class OrganisationManagement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderBy: 'leftId',
      order: 'asc',
      name1: '',
      page: 0,
      pageEntries: 20,
      editDialogOpen: false,
      deleteDialogOpen: false,
      submitting: false,
      unit: {},
    };

    this.saveOrganisationUnit = this.saveOrganisationUnit.bind(this);
    this.editOrganisationUnit = this.editOrganisationUnit.bind(this);
    this.deleteOrganisationUnit = this.deleteOrganisationUnit.bind(this);
    this.notSubmitting = this.notSubmitting.bind(this);
    this.closeAndLoad = this.closeAndLoad.bind(this);
  }

  componentWillMount() {
    this.loadOrganisations();
  }

  loadOrganisations(p = {}) {
    const params = Object.assign(this.state, p);

    this.setState({ ...this.state, params });

    let queryParams = {
      offset: params.page * params.pageEntries,
      limit: params.pageEntries,
      name: params.name1,
      orderBy: params.orderBy,
      order: params.order,
    };

    this.props.getOrganisations(queryParams);
  }

  editOrganisationUnit(row) {
    this.props.loadOrganisationUnit(row.id);
    this.openEditDialog();
  }

  deleteOrganisationUnit(row) {
    this.setState({
      deleteDialogOpen: true,
      unit: row,
    });
  }

  openEditDialog(organisationId) {
    this.setState({
      editDialogOpen: true,
      unit: {},
    });
  }

  closeDialogs() {
    this.setState({
      editDialogOpen: false,
      deleteDialogOpen: false,
      unit: {},
    });
  }

  notSubmitting() {
    this.setState({ submitting: false });
  }

  saveOrganisationUnit(organisationId, data) {
    this.setState({ submitting: true });

    if (organisationId) {
      this.props.saveOrganisationUnit(
        organisationId,
        data,
        this.closeAndLoad,
        this.notSubmitting,
      );
    } else {
      this.props.createOrganisationUnit(
        data,
        this.closeAndLoad,
        this.notSubmitting,
      );
    }
  }

  closeAndLoad() {
    this.closeDialogs();
    this.loadOrganisations();
    this.notSubmitting();
  }

  renderEditDialog = () => {
    const { organisations, organisationUnit } = this.props;

    return this.state.editDialogOpen
      ? <EditOrganisationDialog
          open={this.state.editDialogOpen}
          organisation={organisationUnit.data}
          organisations={organisations.data.entries}
          loading={organisationUnit.loading}
          saving={this.state.submitting}
          onRequestSave={this.saveOrganisationUnit.bind(this)}
          onRequestClose={this.closeDialogs.bind(this)}
        />
      : null;
  };

  renderConfirmDelete = () => {
    const { intl: { formatMessage } } = this.props;

    return this.state.deleteDialogOpen
      ? <DeleteDialog
          handleDelete={() =>
            this.props.deleteOrganisationUnit(
              this.state.unit.id,
              this.closeDialogs,
              this.closeAndLoad,
            )}
          handleClose={event => {
            event.preventDefault();
            event.stopPropagation();

            this.closeDialogs();
          }}
          open={this.state.deleteDialogOpen}
          message={formatMessage({ id: 'deleteOrganisationUnitWarn' })}
        />
      : null;
  };

  render() {
    let hasChilds = false;
    let indentLevel = 0;
    let closingRightIds = [];
    const { organisations, intl: { formatMessage } } = this.props;

    const header = [
      {
        id: 'name',
        value: row => row.name,
        columnTitle: formatMessage({ id: 'organisationUnit' }),
      },
      {
        component: row =>
          <div>
            <IconButton onClick={() => this.editOrganisationUnit(row)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => this.deleteOrganisationUnit(row)}>
              <Delete />
            </IconButton>
          </div>,
        className: 'row-action',
      },
    ];
    const formattedOrganisations = organisations.data.entries.map(org => {
      hasChilds = org.leftId + 1 === org.rightId ? false : true;

      if (closingRightIds.includes(org.leftId - 1)) {
        indentLevel -= 1;
      }

      if (hasChilds) {
        closingRightIds.push(org.rightId);
      }

      const newObj = { ...org, className: `indent-${indentLevel}` };

      // Has child so increate indentation
      if (hasChilds) {
        indentLevel += 1;
      } else if (closingRightIds.includes(org.rightId + 1)) {
        // We're closing indentation; calcuate how much to subtract
        indentLevel -= org.rightId + 1 - org.rightId;
      }

      return newObj;
    });

    return (
      <div className="organisation-management">
        <PageHeader header={formatMessage({ id: 'organisationManagement' })} />

        <Button
          className="add-organisation"
          color="primary"
          onClick={() => this.openEditDialog()}
        >
          {formatMessage({ id: 'addOrganisationUnit' })}
        </Button>

        <TableCard
          order={this.state.order}
          orderBy={this.state.orderBy}
          model={{
            ...organisations,
            data: { entries: formattedOrganisations },
          }}
          header={header}
          refresh={this.loadOrganisations}
          hideToolbar={true}
        />

        {this.renderEditDialog()}
        {this.renderConfirmDelete()}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProp)(
  OrganisationManagement,
);
