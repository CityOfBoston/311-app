// @flow

import React from 'react';
import { Button, ScrollView, StyleSheet } from 'react-native';
import { observer } from 'mobx-react/native';

import type {
  RequestNavigationProps,
  ChosenServiceParams,
  SubmissionParams,
} from './RequestModal';

import AttributeField from './AttributeField';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#B1A5E5',
    padding: 20,
  },
  descriptionField: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    fontSize: 20,
    padding: 20,
    height: '50%',
    marginTop: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageThumb: {
    width: 64,
    height: 64,
    marginLeft: 5,
    marginRight: 5,
  },
});

const NextButton = observer(
  ({
    navigation: { navigate },
    screenProps: { request, submitRequestFunc },
  }: RequestNavigationProps) =>
    <Button
      title="Submit"
      disabled={!request.questionRequirementsMet}
      onPress={() => {
        const submitRequestResult = submitRequestFunc();
        navigate('SubmitRequest', ({ submitRequestResult }: SubmissionParams));
      }}
    />,
);

@observer
export default class QuestionsScreen extends React.Component {
  props: RequestNavigationProps;

  static navigationOptions = (props: RequestNavigationProps) => {
    const { service } = (props.navigation.state.params: ChosenServiceParams);
    return {
      title: service.name,
      headerRight: <NextButton {...props} />,
    };
  };

  render() {
    const { request } = this.props.screenProps;

    return (
      <ScrollView style={styles.container}>
        {request.questions.map(q =>
          <AttributeField key={q.code} question={q} />,
        )}
      </ScrollView>
    );
  }
}
