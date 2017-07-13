// @flow

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import type { IPromiseBasedObservable } from 'mobx-utils';
import { Toolbar } from 'react-native-material-ui';

import type { SubmittedRequest } from '../types';
import type Ui from '../store/ui';
import type { RequestNavigationProps } from './RequestModal';

export type RouteParams = {|
  submitRequestResult: IPromiseBasedObservable<SubmittedRequest>,
|};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
});

@inject('ui')
@observer
export default class SubmitRequestScreen extends React.Component {
  props: {
    ui: Ui,
    ...RequestNavigationProps,
  };

  render() {
    const {
      ui,
      screenProps: { closeModalFunc },
      navigation: { state },
    } = this.props;
    const { statusBarHeight, toolbarHeight } = ui;

    const { submitRequestResult } = (state.params: RouteParams);

    let centerElement;
    let contents;

    switch (submitRequestResult.state) {
      case 'pending':
        centerElement = 'Submitting…';
        contents = <ActivityIndicator />;
        break;
      case 'rejected':
        centerElement = 'Submission error';
        contents = <Text>{submitRequestResult.value.toString()}</Text>;
        break;
      case 'fulfilled':
        centerElement = 'Success';
        contents = <Text>Case ID: {submitRequestResult.value.id}</Text>;
        break;
    }

    return (
      <View style={styles.container}>
        <Toolbar
          leftElement={'close'}
          onLeftElementPress={closeModalFunc}
          centerElement={centerElement}
          style={{
            container: {
              paddingTop: statusBarHeight,
              height: toolbarHeight,
            },
          }}
        />

        <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>
          {contents}
        </View>
      </View>
    );
  }
}
