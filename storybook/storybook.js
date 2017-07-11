// @flow

import React from 'react';
import { AppRegistry } from 'react-native';

import {
  getStorybookUI,
  configure,
  addDecorator,
} from '@storybook/react-native';

import { ThemeProvider } from 'react-native-material-ui';

import { UI_THEME } from '../app/common/style-constants';

addDecorator(storyFn => {
  return (
    <ThemeProvider uiTheme={UI_THEME}>
      {storyFn()}
    </ThemeProvider>
  );
});

configure(() => {
  require('./storyLoader').loadStories();
}, module);

const StorybookUI = getStorybookUI({ port: 7007, host: 'localhost' });

AppRegistry.registerComponent('bos311', () => StorybookUI);
export default StorybookUI;
