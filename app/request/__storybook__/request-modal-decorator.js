// @flow

import React from 'react';
import { KeyboardAvoidingView } from 'react-native';

export default function requestModalDecorator(storyFn: Function) {
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      {storyFn()}
    </KeyboardAvoidingView>
  );
}
