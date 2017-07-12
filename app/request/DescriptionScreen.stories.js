// @flow

import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { fromPromise } from 'mobx-utils';

import type { ServiceSummary } from '../types';

import Ui from '../store/Ui';
import Request from '../store/Request';

import DescriptionScreen from './DescriptionScreen';

const DEFAULT_PROPS = {
  ui: new Ui(),
  closeModalFunc: action('close modal'),
  chooseServiceFunc: action('choose service'),
};

const SERVICE_SUGGESTIONS: ServiceSummary[] = [
  {
    name: 'Needle Removal',
    code: 'SRTV-00000057',
    description: 'Remove needles',
    group: null,
  },
  {
    name: 'Park Lighting Issues',
    code: 'SRTV-00000066',
    description: 'Light the park',
    group: null,
  },
  {
    name: 'Illegal Vending',
    code: 'SRTV-00000080',
    description: 'Vend illegally',
    group: null,
  },
  {
    name: 'Empty Litter Basket',
    code: 'SRTV-00000086',
    description: 'Empty a litter basket',
    group: null,
  },
  {
    name: 'Sidewalk Repair',
    code: 'SRTV-00000092',
    description: 'Sidewalk a repair',
    group: null,
  },
];

function requestWithDescription() {
  const request = new Request();
  request.description = 'Thanos is knocking down buildings';
  return request;
}

storiesOf('DescriptionScreen', module)
  .add('no description', () =>
    <DescriptionScreen
      {...DEFAULT_PROPS}
      request={new Request()}
      serviceSuggestionsObservable={null}
    />,
  )
  .add('loading suggestions', () =>
    <DescriptionScreen
      {...DEFAULT_PROPS}
      request={requestWithDescription()}
      serviceSuggestionsObservable={fromPromise(new Promise(() => {}))}
    />,
  )
  .add('no suggestions', () =>
    <DescriptionScreen
      {...DEFAULT_PROPS}
      request={requestWithDescription()}
      serviceSuggestionsObservable={fromPromise(Promise.resolve([]))}
    />,
  )
  .add('suggestions', () =>
    <DescriptionScreen
      {...DEFAULT_PROPS}
      request={requestWithDescription()}
      serviceSuggestionsObservable={fromPromise(
        Promise.resolve(SERVICE_SUGGESTIONS),
      )}
    />,
  );
