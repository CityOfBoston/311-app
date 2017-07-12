// @flow

import React from 'react';
import { inject } from 'mobx-react/native';

import type Ui from '../store/Ui';
import type { RequestNavigationProps } from './RequestModal';

import QuestionsScreen from './QuestionsScreen';

@inject('ui')
export default class QuestionsScreenController extends React.Component {
  props: {
    ...RequestNavigationProps,
    ui: Ui,
  };

  advance = () => {};

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
        submitFunc={this.advance}
      />
    );
  }
}
