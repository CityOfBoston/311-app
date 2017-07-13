// @flow

import React from 'react';
import { inject } from 'mobx-react/native';

import type { Service } from '../types';
import type Ui from '../store/Ui';
import type { RequestNavigationProps } from './RequestModal';
import type { RouteParams as SubmitRequestScreenRouteParams } from './SubmitRequestScreen';

import QuestionsScreen from './QuestionsScreen';

export type RouteParams = {|
  service: Service,
|};

@inject('ui')
export default class QuestionsScreenController extends React.Component {
  props: {
    ...RequestNavigationProps,
    ui: Ui,
  };

  advance = () => {
    const {
      navigation: { navigate },
      screenProps: { submitRequestFunc },
    } = this.props;

    const submitRequestResult = submitRequestFunc();

    navigate(
      'SubmitRequest',
      ({ submitRequestResult }: SubmitRequestScreenRouteParams),
    );
  };

  render() {
    const {
      ui,
      screenProps: { request, closeModalFunc },
      navigation: { state: { params: { service } } },
    } = this.props;

    return (
      <QuestionsScreen
        ui={ui}
        request={request}
        service={service}
        closeModalFunc={closeModalFunc}
        advanceFunc={this.advance}
      />
    );
  }
}
