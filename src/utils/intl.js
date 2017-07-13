import { addLocaleData } from 'react-intl';

import localeEn from 'react-intl/locale-data/en';
import localeFi from 'react-intl/locale-data/fi';

import { intlReducer } from 'react-intl-redux';

import en from '../translations/en';
import fi from '../translations/fi';

// TODO: move these into redux?
export const storeLocaleForUser = (user, locale) =>
  localStorage.setItem(`locale#${user}`, locale);
export const getLocaleForUser = user => localStorage.getItem(`locale#${user}`);

addLocaleData([...localeEn, ...localeFi]);
export const languages = {
  en: {
    translations: en,
    name: 'English',
  },
  fi: {
    translations: fi,
    name: 'Suomi',
  },
};

export const defaultLang =
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage;

const languageWithoutRegionCode = defaultLang.toLowerCase().split(/[_-]+/)[0];

const initialState = {
  messages: null,
  locale: null,
};

if (languages[languageWithoutRegionCode]) {
  initialState.messages = languages[languageWithoutRegionCode].translations;
  initialState.locale = languageWithoutRegionCode;
} else if (languages[defaultLang]) {
  initialState.messages = languages[defaultLang].translations;
  initialState.locale = defaultLang;
} else {
  // default to 'en' locale
  initialState.messages = languages.en.translations;
  initialState.locale = 'en';
}

export const reducer = (state = initialState, action) =>
  intlReducer(state, action);
