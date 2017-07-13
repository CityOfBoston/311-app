// @flow

import React from 'react';
import { reaction, runInAction } from 'mobx';
import { inject } from 'mobx-react/native';
import { fromPromise } from 'mobx-utils';
import type { IPromiseBasedObservable } from 'mobx-utils';

import type { ServiceSummary } from '../types';
import fetchGraphql from '../fetch-graphql';
import loadServiceSuggestions from '../queries/load-service-suggestions';
import loadService from '../queries/load-service';

import Question from '../store/Question';

import type Ui from '../store/Ui';
import type { RequestNavigationProps } from './RequestModal';
import type { RouteParams as QuestionsScreenRouteParams } from './QuestionsScreenController';

import DescriptionScreen from './DescriptionScreen';

@inject('ui')
export default class DescriptionScreenController extends React.Component {
  props: {
    ...RequestNavigationProps,
    ui: Ui,
  };

  state: {
    serviceSuggestionsResult: ?IPromiseBasedObservable<ServiceSummary[]>,
  } = {
    serviceSuggestionsResult: null,
  };

  serviceSuggestionsDisposer: ?Function;

  componentDidMount() {
    this.serviceSuggestionsDisposer = reaction(
      () => this.props.screenProps.request.description,
      (description: string) => {
        let serviceSuggestionsResult;
        if (description) {
          serviceSuggestionsResult = fromPromise(
            loadServiceSuggestions(fetchGraphql, description),
          );
        } else {
          serviceSuggestionsResult = null;
        }

        this.setState({ serviceSuggestionsResult });
      },
      {
        fireImmediately: true,
        delay: 250,
      },
    );
  }

  componentWillUnmount() {
    if (this.serviceSuggestionsDisposer) {
      this.serviceSuggestionsDisposer();
    }
  }

  chooseService = async (code: string) => {
    const { screenProps: { request }, navigation: { navigate } } = this.props;

    const service = await loadService(fetchGraphql, code);
    if (!service) {
      return;
    }

    runInAction(() => {
      request.serviceCode = code;
      request.questions = Question.buildQuestions(service.attributes);
      navigate('Questions', ({ service }: QuestionsScreenRouteParams));
    });
  };

  render() {
    const { ui, screenProps: { request, closeModalFunc } } = this.props;
    const { serviceSuggestionsResult } = this.state;

    return (
      <DescriptionScreen
        ui={ui}
        request={request}
        serviceSuggestionsResult={serviceSuggestionsResult}
        closeModalFunc={closeModalFunc}
        chooseServiceFunc={this.chooseService}
      />
    );
  }
}
