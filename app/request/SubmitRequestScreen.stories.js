// @flow

import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { fromPromise } from 'mobx-utils';

import type { SubmittedRequest } from '../types';

import Request from '../store/Request';
import Ui from '../store/Ui';

import SubmitRequestScreen from './SubmitRequestScreen';
import type { RouteParams } from './SubmitRequestScreen';

const DEFAULT_PROPS = {
  ui: new Ui(),
  screenProps: {
    closeModalFunc: action('close modal'),
    submitRequestFunc: action('submit request'),
    request: new Request(),
  },
};

function makeNavigation(submitRequestPromise: Promise<SubmittedRequest>) {
  return {
    navigate: action('navigate'),
    state: {
      routeName: 'SubmitRequest',
      key: '',
      params: ({
        submitRequestResult: fromPromise(submitRequestPromise),
      }: RouteParams),
    },
  };
}

storiesOf('SubmitRequestScreen', module).add('loading', () =>
  <SubmitRequestScreen
    {...DEFAULT_PROPS}
    navigation={makeNavigation(new Promise(() => {}))}
  />,
);
