// @flow

import React from 'react';
import mobx from 'mobx';
import { Provider } from 'mobx-react/native';
import { NativeRouter } from 'react-router-native';
import { ThemeProvider } from 'react-native-material-ui';

import {
  YELLOW,
  OPTIMISTIC_BLUE,
  PRIMARY_TEXT_COLOR,
  SECONDARY_TEXT_COLOR,
  DISABLED_TEXT_COLOR,
} from './app/common/style-constants';

import fetchGraphql from './app/fetch-graphql';

import Ui from './app/store/Ui';
import CaseSearch from './app/store/CaseSearch';

import Routes from './app/Routes';

mobx.useStrict(true);

const UI_THEME = {
  palette: {
    primaryColor: YELLOW,
    accentColor: OPTIMISTIC_BLUE,
    primaryTextColor: PRIMARY_TEXT_COLOR,
    secondaryTextColor: SECONDARY_TEXT_COLOR,
    disabledTextColor: DISABLED_TEXT_COLOR,
  },
};

export default class App extends React.Component {
  ui: Ui = new Ui();
  caseSearch: CaseSearch = new CaseSearch();

  componentWillMount() {
    this.ui.attach();
    this.caseSearch.attach(fetchGraphql);
  }

  componentWillUnmount() {
    this.ui.detach();
    this.caseSearch.detach();
  }

  render() {
    return (
      <NativeRouter>
        <ThemeProvider uiTheme={UI_THEME}>
          <Provider ui={this.ui} caseSearch={this.caseSearch}>
            <Routes />
          </Provider>
        </ThemeProvider>
      </NativeRouter>
    );
  }
}
