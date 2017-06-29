// @flow

import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react/native';

import type {
  RequestNavigationProps,
  ChosenServiceParams,
} from './RequestModal';
import type { ServiceSummary } from '../types';

import Question from '../store/Question';

import fetchGraphql from '../fetch-graphql';
import loadServiceSuggestions from '../queries/load-service-suggestions';
import loadService from '../queries/load-service';

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

type State = {
  serviceSummaries: ?Array<ServiceSummary>,
  error: ?Error,
};

@observer
export default class ChooseServiceScreen extends React.Component {
  static navigationOptions = {
    title: 'Choose a Service',
  };

  props: RequestNavigationProps;
  state: State = {
    serviceSummaries: null,
    error: null,
  };

  componentDidMount() {
    const { request } = this.props.screenProps;

    loadServiceSuggestions(fetchGraphql, request.description).then(
      (serviceSummaries: ServiceSummary[]) => {
        this.setState({ serviceSummaries });
      },
      (error: Error) => {
        this.setState({ error });
      },
    );
  }

  chooseService = async (code: string) => {
    const { request } = this.props.screenProps;
    const { navigate } = this.props.navigation;

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
    const { error, serviceSummaries } = this.state;

    return (
      <View style={styles.container}>
        {error && <Text>Error: {error.message}</Text>}
        {!error && !serviceSummaries && <Text>Loading…</Text>}
        {serviceSummaries &&
          serviceSummaries.map(serviceSummary =>
            <Button
              title={serviceSummary.name}
              key={serviceSummary.code}
              onPress={() => this.chooseService(serviceSummary.code)}
            />,
          )}
      </View>
    );
  }
}
