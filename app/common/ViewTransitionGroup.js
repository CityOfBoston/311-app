// @flow

import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import TransitionGroup from 'react-transition-group/TransitionGroup';

type ChildProps = {|
  transitionStyle?: ?(val: Animated.Value, leaving: boolean) => any,
  runOnMount?: boolean,
  duration?: number,
  useNativeDriver?: boolean,
  children?: any,
|};

type ChildState = {|
  val: Animated.Value,
  leaving: boolean,
|};

class ViewTransitionGroupAnimateChild extends React.Component {
  props: ChildProps;
  state: ChildState = {
    val: new Animated.Value(0),
    leaving: false,
  };

  static defaultProps = {
    duration: 250,
    useNativeDriver: false,
  };

  componentWillAppear(doneFn) {
    doneFn();

    const { runOnMount, duration, useNativeDriver } = this.props;
    const { val } = this.state;

    val.removeAllListeners();
    this.setState({ leaving: false });

    if (runOnMount) {
      Animated.timing(val, {
        toValue: 1,
        duration: duration,
        useNativeDriver,
      }).start();
    } else {
      val.setValue(1);
    }
  }

  componentWillEnter(doneFn) {
    doneFn();

    const { duration, useNativeDriver } = this.props;
    const { val } = this.state;

    val.removeAllListeners();
    this.setState({ leaving: false });

    Animated.timing(val, {
      toValue: 1,
      duration,
      useNativeDriver,
    }).start();
  }

  componentWillLeave(doneFn) {
    const { duration, useNativeDriver } = this.props;
    const { val } = this.state;

    this.setState({ leaving: true });
    val.removeAllListeners();

    val.addListener(({ value }) => {
      if (value === 0) {
        doneFn();
      }
    });

    Animated.timing(val, {
      toValue: 0,
      duration,
      useNativeDriver,
    }).start();
  }

  render() {
    const { transitionStyle, children } = this.props;
    const { val, leaving } = this.state;
    const child = React.Children.only(children);

    const style = StyleSheet.flatten([
      child ? child.props.style : null,
      transitionStyle && transitionStyle(val, leaving),
    ]);

    return React.cloneElement(child, {
      style,
    });
  }
}

export default class ViewTransitionGroup extends React.Component {
  props: any;

  static Animate = ViewTransitionGroupAnimateChild;

  render() {
    return <TransitionGroup component={View} {...this.props} />;
  }
}
