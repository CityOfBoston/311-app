// @flow

import React from 'react';
import { Button } from 'react-native';

export default class CloseButton extends React.Component {
  props: {
    actionFunc: Function,
  };

  render() {
    const { actionFunc } = this.props;
    return <Button onPress={actionFunc} title="Close" />;
  }
}
