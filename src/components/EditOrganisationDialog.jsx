import React from 'react';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions,
} from 'material-ui/Dialog';
import FullscreenSpinner from './FullscreenSpinner';
import FormControl from 'material-ui/Form/FormControl';
import Radio from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';

import SelectMenu from '../components/SelectMenu';

@injectIntl
export default class EditOrganisationDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      name: '',
      position: 'after',
      parent: null,
      parentName: '',
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      id: newProps.organisation.id || null,
      name: newProps.organisation.name || '',
    });
  }

  closeDialog() {
    this.props.onRequestClose();
  }

  saveUnit() {
    let body = {
      name: this.state.name,
    };

    if (!this.state.id) {
      body = {
        ...body,
        position: this.state.position,
        parent: this.state.parent,
      };
    }

    this.props.onRequestSave(this.state.id, body);
  }

  canSubmit() {
    return (
      this.state.name.length > 0 &&
      (this.state.id || (!this.state.id && this.state.parent !== null))
    );
  }

  updateAttr(event) {
    const value = event.target.value;
    const field = event.target.name;

    this.setState({ ...this.state, [field]: value });
  }

  selectParent(id) {
    this.setState({
      parent: id,
      parentName: this.props.organisations.filter(org => {
        return org.id === id;
      })[0].name,
    });
  }

  render() {
    let hasChilds = false;
    let indentLevel = 0;
    let closingRightIds = [];

    const {
      organisations,
      open,
      loading,
      intl: { formatMessage },
    } = this.props;
    const formattedOrganisations = organisations.map(org => {
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
      <Dialog
        onRequestClose={this.closeDialog.bind(this)}
        open={open}
        className="dialog"
      >
        <DialogTitle>
          {this.state.id
            ? formatMessage({ id: 'editOrganisationUnit' })
            : formatMessage({ id: 'addOrganisationUnit' })}
        </DialogTitle>
        <DialogContent className="dialog-content">
          {loading
            ? <FullscreenSpinner />
            : <div>
                <FormControl className="form-control">
                  <TextField
                    className="full-width-text-field"
                    name="name"
                    value={this.state.name}
                    label={formatMessage({ id: 'name' })}
                    onChange={this.updateAttr.bind(this)}
                  />
                </FormControl>
                {!this.state.id
                  ? <div>
                      <FormControl className="form-control">
                        <FormControlLabel
                          control={
                            <Radio
                              checked={this.state.position === 'child'}
                              value="child"
                              onChange={this.updateAttr.bind(this)}
                              name="position"
                            />
                          }
                          label={formatMessage({ id: 'addUnitUnder' })}
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              checked={this.state.position === 'after'}
                              value="after"
                              onChange={this.updateAttr.bind(this)}
                              name="position"
                            />
                          }
                          label={formatMessage({ id: 'addUnitAfter' })}
                        />
                      </FormControl>
                      <FormControl className="form-control">
                        <SelectMenu
                          id="organisation-position"
                          selectedId={this.state.parent || 0}
                          loading={loading}
                          data={formattedOrganisations}
                          label={this.state.parentName}
                          onSelect={this.selectParent.bind(this)}
                        />
                      </FormControl>
                    </div>
                  : null}
              </div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog.bind(this)}>
            {formatMessage({ id: 'close' })}
          </Button>
          <Button
            onClick={this.saveUnit.bind(this)}
            disabled={!this.canSubmit()}
            color="primary"
          >
            {formatMessage({ id: 'save' })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
