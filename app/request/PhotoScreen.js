// @flow

import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { runInAction } from 'mobx';
import { ImagePicker } from 'expo';

import type { RequestNavigationProps } from './RequestModal';
import CloseButton from '../common/CloseButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c0ffee',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
  },
});

export default class PhotoScreen extends React.Component {
  props: {
    ...RequestNavigationProps,
  };

  static navigationOptions = ({ screenProps }: RequestNavigationProps) => {
    return {
      title: 'Choose a Photo',
      headerLeft: <CloseButton actionFunc={screenProps.closeModalFunc} />,
    };
  };

  pickFromLibrary = async () => {
    const { request } = this.props.screenProps;

    const out = await ImagePicker.launchImageLibraryAsync();
    runInAction(() => {
      if (!out.cancelled) {
        request.localImageUris.push(out.uri);
        this.advance();
      }
    });
  };

  pickFromCamera = () => {};

  advance = () => {
    const { navigate } = this.props.navigation;
    navigate('Description');
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="From Library" onPress={this.pickFromLibrary} />
        <Button title="From Camera" onPress={this.pickFromCamera} />
        <Button title="No Photo" onPress={this.advance} />
      </View>
    );
  }
}
