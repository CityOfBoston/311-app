// @flow

import React from 'react';
import { reaction, observable, runInAction } from 'mobx';
import { inject } from 'mobx-react/native';
import { fromPromise } from 'mobx-utils';
import type { IPromiseBasedObservable } from 'mobx-utils';

import type { ServiceSummary } from '../types';
import fetchGraphql from '../fetch-graphql';
import loadServiceSuggestions from '../queries/load-service-suggestions';
import loadService from '../queries/load-service';

import Question from '../store/Question';

import type Ui from '../store/Ui';
import type {
  RequestNavigationProps,
  ChosenServiceParams,
} from './RequestModal';

import DescriptionScreen from './DescriptionScreen';

@inject('ui')
export default class DescriptionScreenController extends React.Component {
  props: {
    ...RequestNavigationProps,
    ui: Ui,
  };

  @observable
  serviceSummaries: ?IPromiseBasedObservable<Array<ServiceSummary>> = null;
  serviceSummariesDisposer: ?Function;

  componentDidMount() {
    this.serviceSummariesDisposer = reaction(
      () => this.props.screenProps.request.description,
      (description: string) => {
        if (description) {
          this.serviceSummaries = fromPromise(
            loadServiceSuggestions(fetchGraphql, description),
          );
        } else {
          this.serviceSummaries = null;
        }
      },
      {
        fireImmediately: true,
        delay: 250,
      },
    );
  }

  componentWillUnmount() {
    if (this.serviceSummariesDisposer) {
      this.serviceSummariesDisposer();
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
      navigate('Questions', ({ service }: ChosenServiceParams));
    });
  };

  render() {
    const { serviceSummaries, chooseService } = this;
    const { ui, screenProps: { request, closeModalFunc } } = this.props;

    return (
      <DescriptionScreen
        ui={ui}
        request={request}
        serviceSuggestionsObservable={serviceSummaries}
        closeModalFunc={closeModalFunc()}
        chooseServiceFunc={chooseService}
      />
    );
  }
}
