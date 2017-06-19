// @flow
/* eslint react/prefer-stateless-function: 0, react-native/no-color-literals: 0 */

import React from 'react';
import mobx from 'mobx';

import HomeScreen from './app/home/HomeScreen';

mobx.useStrict(true);

export default class App extends React.Component {
  render() {
    return <HomeScreen />;
  }
}
