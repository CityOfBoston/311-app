// @flow

import { StackNavigator } from 'react-navigation';
import type { IPromiseBasedObservable } from 'mobx-utils';

import type { Service, SubmittedRequest } from '../types';
import type Request from '../store/Request';

import PhotoScreen from './PhotoScreen';
import DescriptionScreenController from './DescriptionScreenController';
import QuestionsScreenController from './QuestionsScreenController';
import SubmitRequestScreen from './SubmitRequestScreen';

export type RequestScreenProps = {|
  closeModalFunc: () => void,
  submitRequestFunc: () => IPromiseBasedObservable<SubmittedRequest>,
  request: Request,
|};

export type ChosenServiceParams = {|
  service: Service,
|};

export type SubmissionParams = {|
  submitRequestResult: IPromiseBasedObservable<SubmittedRequest>,
|};

export type RequestNavigationProps = {|
  navigation: {
    navigate: (
      routeName: string,
      params?: { [key: string]: any },
      action?: string,
    ) => void,
    state: {
      routeName: string,
      key: string,
      params: any,
    },
  },
  screenProps: RequestScreenProps,
|};

export default StackNavigator(
  {
    Photo: { screen: PhotoScreen },
    Description: { screen: DescriptionScreenController },
    Questions: { screen: QuestionsScreenController },
    SubmitRequest: { screen: SubmitRequestScreen },
  },
  {
    initialRouteName: 'Photo',
    headerMode: 'none',
  },
);
