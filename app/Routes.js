// @flow

import React from 'react';
import { Animated, StatusBar } from 'react-native';
import { Route, Redirect, matchPath, withRouter } from 'react-router-native';
import type { ContextRouter } from 'react-router-native';

import ViewTransitionGroup from './common/ViewTransitionGroup';

import HomeScreen from './home/HomeScreen';
import CaseScreen from './case/CaseScreen';

const navTransitionStyle = val => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  opacity: val,
});

type Props = {
  ...ContextRouter,
};

export class Routes extends React.Component {
  props: Props;

  renderRoute(Component: any, routeProps: Object) {
    const { location, history } = this.props;

    if (!location || !history) {
      return null;
    }

    const match = matchPath(location.pathname, routeProps);

    if (match) {
      return (
        <ViewTransitionGroup.Animate transitionStyle={navTransitionStyle}>
          <Animated.View>
            <Component match={match} location={location} history={history} />
          </Animated.View>
        </ViewTransitionGroup.Animate>
      );
    } else {
      return null;
    }
  }

  render() {
    const { location } = this.props;

    if (!location) {
      return null;
    }

    return (
      <ViewTransitionGroup style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />

        <Route path="/" exact render={() => <Redirect to="/search" />} />

        {this.renderRoute(HomeScreen, { path: '/search/:id?' })}
        {this.renderRoute(CaseScreen, { path: '/case/:id' })}
      </ViewTransitionGroup>
    );
  }
}

export default withRouter(Routes);
