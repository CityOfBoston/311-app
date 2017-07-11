// @flow

import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { Toolbar } from 'react-native-material-ui';

import type Ui from '../store/Ui';
import type { RequestNavigationProps } from './RequestModal';

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

@inject('ui')
@observer
export default class QuestionsScreen extends React.Component {
  props: {
    ...RequestNavigationProps,
    ui: Ui,
  };

  render() {
    const {
      ui,
      screenProps: { request, closeModalFunc },
      navigation: { state: { params: { service } } },
    } = this.props;
    const { statusBarHeight, toolbarHeight } = ui;

    return (
      <View style={styles.container}>
        <Toolbar
          leftElement="close"
          onLeftElementPress={closeModalFunc}
          centerElement={service.name}
          style={{
            container: {
              paddingTop: statusBarHeight,
              height: toolbarHeight,
            },
          }}
        />

        <ScrollView style={{ flex: 1, padding: 16 }}>
          <Text style={styles.descriptionText}>{service.description}</Text>
          {request.questions.map(q =>
            <AttributeField key={q.code} question={q} />,
          )}
        </ScrollView>
      </View>
    );
  }
}
