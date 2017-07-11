// @flow

import React from 'react';
import mobx from 'mobx';
import { Provider } from 'mobx-react/native';
import { NativeRouter } from 'react-router-native';
import { ThemeProvider } from 'react-native-material-ui';

import { UI_THEME } from './app/common/style-constants';

import fetchGraphql from './app/fetch-graphql';

import Ui from './app/store/Ui';
import CameraRoll from './app/store/CameraRoll';
import CaseSearch from './app/store/CaseSearch';

import Routes from './app/Routes';

mobx.useStrict(true);

export default class App extends React.Component {
  ui: Ui = new Ui();
  caseSearch: CaseSearch = new CaseSearch();
  cameraRoll: CameraRoll = new CameraRoll();

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
          <Provider
            ui={this.ui}
            caseSearch={this.caseSearch}
            cameraRoll={this.cameraRoll}>
            <Routes />
          </Provider>
        </ThemeProvider>
      </NativeRouter>
    );
  }
}
