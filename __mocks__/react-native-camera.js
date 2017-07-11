// @flow

import React from 'react';

export default class Camera extends React.Component {
  static constants = {
    Aspect: {
      fill: 'fill',
    },
  };

  capture = jest.fn();

  render() {
    return React.createElement('Camera', this.props);
  }
}
