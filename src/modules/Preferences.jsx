import React from 'react';
import { injectIntl } from 'react-intl';

import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import FormControl from 'material-ui/Form/FormControl';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { green } from 'material-ui/styles/colors';
import ArrowDropDown from 'material-ui-icons/ArrowDropDown';

import { connect } from 'react-redux';
import { updateIntl } from 'react-intl-redux';
import rest from '../utils/rest';
import { languages, storeLocaleForUser } from '../utils/intl';

import PageHeader from '../components/PageHeader';
import EmployeeManagement from '../components/EmployeeManagement';
import { reset } from './Logout';

const mapStateToProps = state => ({
  activeLanguage: state.intl.locale,
  userDetails: state.employee,
  user: state.auth.data.decoded,
});

const mapDispatchToProps = dispatch => ({
  changeLanguage: (user, locale) => {
    storeLocaleForUser(user.email, locale);
    dispatch(
      updateIntl({
        locale,
        messages: languages[locale].translations,
      }),
    );
  },
  doClearState: () => {
    dispatch(dispatch(reset()));
  },
  updateDetails: (id, data, cb) => {
    dispatch(
      rest.actions.employee.patch({ id: id }, { body: JSON.stringify(data) }),
    ).then(cb);
  },
  renewAuth: cb => {
    dispatch(rest.actions.renewAuth()).then(cb);
  },
});

@injectIntl
class Preferences extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      languageMenuOpen: false,
      languageMenuAnchor: null,
      user: {
        name: props.user.name || '',
        email: props.user.email || '',
        password: '',
        password2: '',
      },
      passwordMismatch: false,
      detailsUpdated: false,
      submitting: false,
    };

    this.canSubmit = this.canSubmit.bind(this);
    this.preUpdate = this.preUpdate.bind(this);
    this.postUpdate = this.postUpdate.bind(this);
    this.checkPasswords = this.checkPasswords.bind(this);
  }

  updateAttr(event) {
    const value = event.target.value;
    const field = event.target.name;

    this.setState({ user: { ...this.state.user, [field]: value } });
  }

  checkPasswords() {
    this.setState({
      passwordMismatch:
        this.state.user.password &&
        this.state.user.password2 &&
        this.state.user.password !== this.state.user.password2
          ? true
          : false,
    });
  }

  canSubmit() {
    const emailRegexp = new RegExp(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
      'i',
    );

    return (
      !this.state.submitting &&
      !this.state.passwordMismatch &&
      this.state.user.name.length &&
      this.state.user.email.length &&
      emailRegexp.test(this.state.user.email)
    );
  }

  preUpdate() {
    const body = {
      name: this.state.user.name,
      email: this.state.user.email,
      password: this.state.user.password,
    };

    this.setState({ submitting: true });
    this.props.updateDetails(this.props.user.id, body, () =>
      this.props.renewAuth(this.postUpdate),
    );
  }

  postUpdate() {
    this.setState(
      {
        submitting: false,
        detailsUpdated: true,
        user: { ...this.state.user, password: '', password2: '' },
      },
      () => {
        setTimeout(() => this.setState({ detailsUpdated: false }), 3000);
      },
    );
  }

  render() {
    const {
      activeLanguage,
      changeLanguage,
      doClearState,
      user,
      intl: { formatMessage },
    } = this.props;

    const passwordError = this.state.passwordMismatch
      ? <Typography>
          {formatMessage({ id: 'passwordMismatch' })}
        </Typography>
      : null;

    return (
      <div>
        <PageHeader header={formatMessage({ id: 'Preferences' })} />

        <Grid container gutter={24}>
          <Grid item xs={12} sm={6}>
            <Paper className="paper" elevation={1}>
              <Typography type="headline">
                {formatMessage({ id: 'ownDetails' })}
              </Typography>

              <FormControl className="form-control">
                <TextField
                  required={true}
                  name="name"
                  value={this.state.user.name}
                  label={formatMessage({ id: 'name' })}
                  onChange={this.updateAttr.bind(this)}
                />
              </FormControl>

              <FormControl className="form-control">
                <TextField
                  required={true}
                  name="email"
                  value={this.state.user.email}
                  label={formatMessage({ id: 'email' })}
                  onChange={this.updateAttr.bind(this)}
                />
              </FormControl>

              <Typography className="new-password-explain">
                {formatMessage({ id: 'newPasswordExplain' })}
              </Typography>
              <FormControl
                className="form-control"
                error={this.state.passwordMismatch}
              >
                <TextField
                  name="password"
                  type="password"
                  value={this.state.user.password}
                  label={formatMessage({ id: 'newPassword' })}
                  onBlur={this.checkPasswords}
                  onChange={this.updateAttr.bind(this)}
                />
                {passwordError}
              </FormControl>

              <FormControl
                className="form-control"
                error={this.state.passwordMismatch}
              >
                <TextField
                  name="password2"
                  type="password"
                  value={this.state.user.password2}
                  label={formatMessage({ id: 'confirmPassword' })}
                  onBlur={this.checkPasswords}
                  onChange={this.updateAttr.bind(this)}
                />
                {passwordError}
              </FormControl>

              <FormControl className="form-control row">
                <Button
                  raised
                  disabled={!this.canSubmit()}
                  color="primary"
                  onClick={this.preUpdate}
                >
                  {formatMessage({ id: 'save' })}
                </Button>

                {this.state.detailsUpdated
                  ? <span
                      className="details-updated"
                      style={{ color: green[600] }}
                    >
                      {formatMessage({ id: 'detailsUpdated' })}
                    </span>
                  : ''}
              </FormControl>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper className="paper">
              <Typography type="headline">
                {formatMessage({ id: 'appLanguage' })}
              </Typography>
              <Typography>
                {formatMessage({ id: 'appLanguageExplain' })}
              </Typography>
              <div className="language-selection">
                <List>
                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="language-menu"
                    aria-label="App language"
                    onClick={e =>
                      this.setState({
                        languageMenuOpen: true,
                        languageMenuAnchor: e.currentTarget,
                      })}
                  >
                    <ListItemText
                      primary={formatMessage({ id: 'selectedLanguage' })}
                      secondary={
                        languages[activeLanguage]
                          ? languages[activeLanguage].name
                          : 'unknown'
                      }
                    />
                    <ArrowDropDown />
                  </ListItem>
                </List>

                <Menu
                  id="language-menu"
                  anchorEl={this.state.languageMenuAnchor}
                  open={this.state.languageMenuOpen}
                  onRequestClose={() =>
                    this.setState({ languageMenuOpen: false })}
                >
                  {Object.keys(languages).map(language =>
                    <MenuItem
                      key={language}
                      selected={language === activeLanguage}
                      onClick={() => {
                        changeLanguage(user, language);
                        this.setState({ languageMenuOpen: false });
                      }}
                    >
                      {languages[language].name}
                    </MenuItem>,
                  )}
                </Menu>
              </div>

              <Typography type="headline">
                {formatMessage({ id: 'resetState' })}
              </Typography>
              <Typography>
                {formatMessage({ id: 'resetStateExplanation' })}
              </Typography>

              <Button raised color="accent" onClick={doClearState}>
                {formatMessage({ id: 'resetStateButton' })}
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {user.scope.includes('admin') ? <EmployeeManagement /> : ''}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
