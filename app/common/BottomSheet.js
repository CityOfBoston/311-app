// @flow

import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default class BottomSheet extends React.Component {
  props: {
    style?: any,
    children?: any,
  };

  render() {
    return (
      <View
        style={StyleSheet.flatten([
          {
            alignSelf: 'stretch',
            shadowColor: '#000000',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            shadowOffset: {
              height: -2,
              width: 0,
            },
            backgroundColor: '#ffffff',
          },
          this.props.style || {},
        ])}>
        {this.props.children}
      </View>
    );
  }
}

export const AnimatedBottomSheet = Animated.createAnimatedComponent(
  BottomSheet,
);
