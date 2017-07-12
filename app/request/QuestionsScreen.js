// @flow

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { observer } from 'mobx-react/native';
import { Toolbar, Divider } from 'react-native-material-ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import type { Service } from '../types';
import type Ui from '../store/Ui';

import { SECONDARY_TEXT_COLOR } from '../common/style-constants';

import AttributeField from './AttributeField';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  descriptionText: {
    color: SECONDARY_TEXT_COLOR,
    fontSize: 18,
  },
});

@observer
export default class QuestionsScreen extends React.Component {
  props: {
    ui: Ui,
    request: Request,
    service: Service,
    closeModalFunc: () => mixed,
    submitFunc: () => mixed,
  };

  render() {
    const { ui, request, service, closeModalFunc, submitFunc } = this.props;
    const { statusBarHeight, toolbarHeight } = ui;

    return (
      <View style={styles.container}>
        <Toolbar
          leftElement="close"
          onLeftElementPress={closeModalFunc}
          centerElement={service.name}
          rightElement="arrow-forward"
          onRightElementPress={
            request.questionRequirementsMet ? submitFunc : null
          }
          style={{
            container: {
              paddingTop: statusBarHeight,
              height: toolbarHeight,
            },
            rightElementContainer: {
              opacity: request.questionRequirementsMet ? 1 : 0.5,
            },
          }}
        />

        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <View style={{ padding: 16 }}>
            <Text style={styles.descriptionText}>{service.description}</Text>
          </View>

          <Divider />

          {request.questions.map(q =>
            <AttributeField key={q.code} question={q} />,
          )}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
