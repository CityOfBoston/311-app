// @flow

import React from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableHighlight,
} from 'react-native';

import { fromPromise } from 'mobx-utils';
import type { IPromiseBasedObservable } from 'mobx-utils';

import Request from '../store/Request';

import { OPTIMISTIC_BLUE } from '../common/style-constants';

import type { SubmittedRequest } from '../types';
import fetchGraphql from '../fetch-graphql';
import submitRequest from '../queries/submit-request';

import RecentRequestsMap from './RecentRequestsMap';

import RequestModal from '../request/RequestModal';
import type { RequestScreenProps } from '../request/RequestModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  startButton: {
    backgroundColor: OPTIMISTIC_BLUE,
    aspectRatio: 1,
    width: 150,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 75,
    flexDirection: 'column',
  },
  startButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export type State = {|
  modalVisible: boolean,
  request: Request,
|};

export default class HomeScreen extends React.Component {
  state: State = {
    modalVisible: false,
    request: new Request(),
  };

  openModal = () => {
    this.setState({
      modalVisible: true,
      request: new Request(),
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  submitRequest = (): IPromiseBasedObservable<SubmittedRequest> => {
    const { request } = this.state;

    if (!request.serviceCode) {
      throw new Error('submitRequest called without a serviceCode');
    }

    const args = {
      serviceCode: request.serviceCode,
      description: request.description,
      firstName: 'Fin',
      lastName: 'Hopkins',
      email: 'fin.hopkins@boston.gov',
      phone: null,
      location: null,
      address: null,
      addressId: null,
      questions: request.questions,
      mediaUrl: '',
    };

    return fromPromise(submitRequest(fetchGraphql, args));
  };

  render() {
    const { modalVisible, request } = this.state;

    return (
      <View style={styles.container}>
        <RecentRequestsMap />

        <Modal
          animationType={'slide'}
          transparent={false}
          visible={modalVisible}>
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <RequestModal
              screenProps={
                ({
                  closeModalFunc: this.closeModal,
                  submitRequestFunc: this.submitRequest,
                  request,
                }: RequestScreenProps)
              }
            />
          </KeyboardAvoidingView>
        </Modal>

        <TouchableHighlight style={styles.startButton} onPress={this.openModal}>
          <Text style={styles.startButtonText}>Start Request</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
