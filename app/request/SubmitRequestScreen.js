// @flow

import React from 'react';
import { Button, Text, View } from 'react-native';
import { observer } from 'mobx-react/native';

import type {
  RequestNavigationProps,
  ChosenServiceParams,
  SubmissionParams,
} from './RequestModal';

type AccumulatedParams = {|
  ...ChosenServiceParams,
  ...SubmissionParams,
|};

const DoneButton = observer(
  ({
    navigation: { state },
    screenProps: { closeModalFunc },
  }: RequestNavigationProps) => {
    const { submitRequestResult } = (state.params: AccumulatedParams);
    return (
      <Button
        title="Done"
        disabled={submitRequestResult.state === 'pending'}
        onPress={closeModalFunc}
      />
    );
  },
);

type State = {|
  submitting: boolean,
|};

@observer
export default class SubmitRequestScreen extends React.Component {
  props: RequestNavigationProps;
  state: State = {
    submitting: false,
  };

  static navigationOptions = (props: RequestNavigationProps) => ({
    // headerLeft: null,
    title: 'Submitting…',
    headerRight: <DoneButton {...props} />,
  });

  props: RequestNavigationProps;

  componentDidMount() {}

  render() {
    return (
      <View>
        <Text>Please wait…</Text>
      </View>
    );
  }
}
