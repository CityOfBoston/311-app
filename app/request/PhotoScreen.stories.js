// @flow

import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';

import Ui from '../store/Ui';
import CameraRoll from '../store/CameraRoll';
import Request from '../store/Request';

import requestModalDecorator from './__storybook__/request-modal-decorator';

import PhotoScreen from './PhotoScreen';

// TODO(finh): Would be nice to stub out CameraRoll to have a set of our
// own test images

storiesOf('PhotoScreen', module)
  .addDecorator(requestModalDecorator)
  .add('default', () =>
    <PhotoScreen
      cameraRoll={new CameraRoll()}
      ui={new Ui()}
      navigation={{
        navigate: action('navigate'),
        state: {
          routeName: '',
          key: 'Photo',
          params: {},
        },
      }}
      screenProps={{
        closeModalFunc: action('close modal'),
        submitRequestFunc: action('submit request'),
        request: new Request(),
      }}
    />,
  );
