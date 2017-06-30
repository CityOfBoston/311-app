// @flow

import React from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { action, reaction, observable, runInAction } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { fromPromise } from 'mobx-utils';
import type { IPromiseBasedObservable } from 'mobx-utils';
import { Toolbar } from 'react-native-material-ui';

import ViewTransitionGroup from '../common/ViewTransitionGroup';

import type { ServiceSummary } from '../types';
import Question from '../store/Question';
import fetchGraphql from '../fetch-graphql';
import loadServiceSuggestions from '../queries/load-service-suggestions';
import loadService from '../queries/load-service';

import type Ui from '../store/Ui';
import type {
  RequestNavigationProps,
  ChosenServiceParams,
} from './RequestModal';

import { YELLOW, SECONDARY_TEXT_COLOR } from '../common/style-constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  descriptionField: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    fontSize: 20,
    padding: 20,
    flex: 1,
  },
  servicesRow: {
    height: 72,
    flexGrow: 0,
    flexDirection: 'column',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },
  serviceButton: {
    marginLeft: 8,
    marginRight: 8,
  },
});

@inject('ui')
@observer
export default class DescriptionScreen extends React.Component {
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

  descriptionTextChanged = action((description: string) => {
    const { screenProps: { request } } = this.props;
    request.description = description;
  });

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
    const { ui, screenProps: { request, closeModalFunc } } = this.props;
    const { statusBarHeight, toolbarHeight } = ui;
    const { serviceSummaries } = this;

    return (
      <View style={styles.container}>
        <Toolbar
          leftElement="close"
          onLeftElementPress={closeModalFunc}
          centerElement={'Describe your issue'}
          style={{
            container: {
              paddingTop: statusBarHeight,
              height: toolbarHeight,
            },
          }}
        />

        <TextInput
          style={styles.descriptionField}
          multiline={true}
          autoFocus={true}
          value={request.description}
          onChangeText={this.descriptionTextChanged}
        />

        <ViewTransitionGroup>
          {serviceSummaries &&
            <ViewTransitionGroup.Animate
              key="view"
              transitionStyle={(val: Animated.Value) => ({
                height: val.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 72],
                }),
              })}>
              <Animated.View style={styles.servicesRow}>
                <View
                  style={{
                    marginTop: 8,
                    marginLeft: 16,
                  }}>
                  <Text style={{ color: SECONDARY_TEXT_COLOR }}>
                    How can we help?
                  </Text>
                </View>

                {serviceSummaries.state === 'pending' &&
                  <ActivityIndicator style={{ flex: 1 }} />}

                {serviceSummaries.state === 'fulfilled' &&
                  <ScrollView horizontal keyboardShouldPersistTaps="always">
                    <View
                      style={{
                        alignItems: 'center',
                        height: '100%',
                        flexDirection: 'row',
                        padding: 8,
                      }}>
                      {serviceSummaries.value.map(service =>
                        <TouchableOpacity
                          key={service.code}
                          style={styles.serviceButton}
                          onPress={() => {
                            this.chooseService(service.code);
                          }}>
                          <Text style={{ fontSize: 18, color: YELLOW }}>
                            {service.name}
                          </Text>
                        </TouchableOpacity>,
                      )}
                    </View>
                  </ScrollView>}
              </Animated.View>
            </ViewTransitionGroup.Animate>}
        </ViewTransitionGroup>

      </View>
    );
  }
}
