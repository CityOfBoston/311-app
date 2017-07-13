// @flow

import React from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import type { IPromiseBasedObservable } from 'mobx-utils';
import { Toolbar } from 'react-native-material-ui';

import ViewTransitionGroup from '../common/ViewTransitionGroup';

import type { ServiceSummary } from '../types';

import type Ui from '../store/Ui';

import { YELLOW, SECONDARY_TEXT_COLOR } from '../common/style-constants';

const AnimatedView = Animated.View;

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

@observer
export default class DescriptionScreen extends React.Component {
  props: {
    ui: Ui,
    request: Request,
    serviceSuggestionsResult: ?IPromiseBasedObservable<ServiceSummary[]>,
    closeModalFunc: () => mixed,
    chooseServiceFunc: (code: string) => mixed,
  };

  descriptionTextChanged = action((description: string) => {
    const { request } = this.props;
    request.description = description;
  });

  render() {
    const {
      ui,
      request,
      closeModalFunc,
      chooseServiceFunc,
      serviceSuggestionsResult,
    } = this.props;
    const { statusBarHeight, toolbarHeight } = ui;

    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
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
            autoFocus={process.env.NODE_ENV !== 'test'}
            value={request.description}
            onChangeText={this.descriptionTextChanged}
          />

          <ViewTransitionGroup>
            {serviceSuggestionsResult &&
              <ViewTransitionGroup.Animate
                key="view"
                transitionStyle={(val: Animated.Value) => ({
                  height: val.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 72],
                  }),
                })}>
                <AnimatedView style={styles.servicesRow}>
                  <View
                    style={{
                      marginTop: 8,
                      marginLeft: 16,
                    }}>
                    <Text style={{ color: SECONDARY_TEXT_COLOR }}>
                      Choose a service:
                    </Text>
                  </View>

                  {serviceSuggestionsResult.state === 'pending' &&
                    <ActivityIndicator style={{ flex: 1 }} />}

                  {serviceSuggestionsResult.state === 'fulfilled' &&
                    <ScrollView horizontal keyboardShouldPersistTaps="always">
                      <View
                        style={{
                          alignItems: 'center',
                          height: '100%',
                          flexDirection: 'row',
                          padding: 8,
                        }}>
                        {serviceSuggestionsResult.value.map(service =>
                          <TouchableOpacity
                            key={service.code}
                            style={styles.serviceButton}
                            onPress={() => {
                              chooseServiceFunc(service.code);
                            }}>
                            <Text style={{ fontSize: 18, color: YELLOW }}>
                              {service.name}
                            </Text>
                          </TouchableOpacity>,
                        )}
                      </View>
                    </ScrollView>}
                </AnimatedView>
              </ViewTransitionGroup.Animate>}
          </ViewTransitionGroup>

        </View>
      </KeyboardAvoidingView>
    );
  }
}
