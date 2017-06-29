// @flow

import React from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';

import type { RequestNavigationProps } from './RequestModal';

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
    marginTop: 10,
    flex: 1,
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
    screenProps: { request },
  }: RequestNavigationProps) =>
    <Button
      title="Next"
      disabled={request.description.length === 0}
      onPress={() => navigate('ChooseService')}
    />,
);

@observer
export default class DescriptionScreen extends React.Component {
  static navigationOptions = (props: RequestNavigationProps) => ({
    title: 'Make a Request',
    headerRight: <NextButton {...props} />,
  });

  descriptionTextChanged = action((description: string) => {
    const { screenProps: { request } } = this.props;
    request.description = description;
  });

  render() {
    const { request } = this.props.screenProps;
    return (
      <View behavior="padding" style={styles.container}>
        {request.localImageUris.length
          ? <View style={styles.imageContainer}>
              {request.localImageUris.map(uri =>
                <Image key={uri} style={styles.imageThumb} source={{ uri }} />,
              )}
            </View>
          : null}

        <Text>How can we help?</Text>
        <TextInput
          style={styles.descriptionField}
          multiline={true}
          autoFocus={true}
          value={request.description}
          onChangeText={this.descriptionTextChanged}
        />
      </View>
    );
  }
}
