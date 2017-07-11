import React from 'react';
import { injectIntl } from 'react-intl';

import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Card, { CardContent } from 'material-ui/Card';

import { connect } from 'react-redux';
import { updateIntl } from 'react-intl-redux';
import { languages, storeLocaleForUser } from '../utils/intl';

import CardGridWrapper from '../components/CardGridWrapper';
import PageHeader from '../components/PageHeader';
import EmployeeManagement from '../components/EmployeeManagement';
import { reset } from './Logout';

const mapStateToProps = state => ({
  activeLanguage: state.intl.locale,
  user: state.auth.data.decoded,
});

const mapDispatchToProps = dispatch => ({
  changeLanguage: (user, locale) => {
    storeLocaleForUser(user.email, locale);
    dispatch(updateIntl({
      locale,
      messages: languages[locale].translations,
    }));
  },
  doClearState: () => {
    dispatch(reset());
  },
});

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class Preferences extends React.Component {
  static defaultProps = {
    user: {
      email: 'Default user',
      scope: 'user',
    },
  };

  state = {
    languageMenuOpen: false,
    languageMenuAnchor: null,
  };

  render() {
    const {
      activeLanguage,
      changeLanguage,
      doClearState,
      user,
      intl: { formatMessage },
    } = this.props;

    return (
      <div>
        <PageHeader header={formatMessage({id: 'Preferences'})} />
        <CardGridWrapper>
          <Card>
            <CardContent>
              <Typography type="headline">{formatMessage({ id: 'language' })}</Typography>
              <List>
                <ListItem
                  button
                  aria-haspopup="true"
                  aria-controls="language-menu"
                  aria-label="App language"
                  onClick={e => this.setState({
                    languageMenuOpen: true,
                    languageMenuAnchor: e.currentTarget,
                  })}
                >
                  <ListItemText
                    primary={formatMessage({ id: 'selectedLanguage' })}
                    secondary={languages[activeLanguage] ? languages[activeLanguage].name : 'unknown'}
                  />
                </ListItem>
              </List>
              <Menu
                id="language-menu"
                anchorEl={this.state.languageMenuAnchor}
                open={this.state.languageMenuOpen}
                onRequestClose={() => this.setState({ languageMenuOpen: false })}
              >
                {
                  Object.keys(languages).map(language => (
                    <MenuItem
                      key={language}
                      selected={language === activeLanguage}
                      onClick={() => {
                        changeLanguage(user, language);
                        this.setState({ languageMenuOpen: false });
                      }}
                    >
                      {languages[language].name}
                    </MenuItem>
                  ))
                }
              </Menu>
            </CardContent>
            <CardContent>
              <Typography type="headline">{formatMessage({ id: 'resetState' })}</Typography>
              <Typography>{formatMessage({ id: 'resetStateExplanation' })}</Typography>
            </CardContent>
            <CardContent>
              <Button
                raised
                color="accent"
                onClick={doClearState}
              >
                {formatMessage({ id: 'resetStateButton' })}
              </Button>
            </CardContent>
          </Card>
        </CardGridWrapper>

        {user.scope.includes('admin') ? <EmployeeManagement /> : ''}
      </div>
    );
  }
}
