// @flow

import React from 'react';
import {
  Button,
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { runInAction, observable, action } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import Camera from 'react-native-camera';
import { Toolbar } from 'react-native-material-ui';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import type Ui from '../store/Ui';
import type CameraRoll from '../store/CameraRoll';
import type { RequestNavigationProps } from './RequestModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-around',
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  controls: {
    flexDirection: 'column',
    alignItems: 'stretch',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
  },
  thumbnail: {
    width: 78,
    height: 78,
    margin: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, .79)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

type ImageSource = {
  uri: string,
  width: number,
  height: number,
};

@inject('ui', 'cameraRoll')
@observer
export default class PhotoScreen extends React.Component {
  props: {
    ...RequestNavigationProps,
    cameraRoll: CameraRoll,
    ui: Ui,
  };

  camera: ?Camera = null;
  @observable.shallow selectedImageSource: ?ImageSource = null;
  @observable capturing: boolean = false;

  componentDidMount() {
    const { cameraRoll } = this.props;
    cameraRoll.attach();
  }

  componentWillUnmount() {
    const { cameraRoll } = this.props;
    cameraRoll.detach();
  }

  setCamera = (camera: ?Camera) => {
    this.camera = camera;
  };

  takePhoto = action(async () => {
    const { camera } = this;
    const { cameraRoll } = this.props;

    if (!camera) {
      return;
    }

    this.capturing = true;

    try {
      const capturedPhoto = await camera.capture();
      const size = await new Promise((resolve, reject) => {
        Image.getSize(
          capturedPhoto.path,
          (width, height) => resolve({ width, height }),
          reject,
        );
      });

      runInAction(() => {
        this.selectedImageSource = {
          uri: capturedPhoto.path,
          ...size,
        };
      });

      cameraRoll.loadPhotos();
    } finally {
      runInAction(() => {
        this.capturing = false;
      });
    }
  });

  advance = () => {
    const { navigate } = this.props.navigation;
    navigate('Description');
  };

  render() {
    const { selectedImageSource, capturing } = this;
    const { ui, screenProps, cameraRoll } = this.props;
    const { statusBarHeight, toolbarHeight } = ui;

    return (
      <View style={styles.container}>
        {selectedImageSource
          ? <Image style={styles.fullImage} source={selectedImageSource} />
          : <Camera
              ref={this.setCamera}
              style={styles.camera}
              aspect={Camera.constants.Aspect.fill}
            />}

        <LinearGradient
          colors={['rgba(0, 0, 0, .4)', 'rgba(0, 0, 0, 0)']}
          style={{
            width: '100%',
            position: 'absolute',
            top: 0,
            height: toolbarHeight,
            backgroundColor: 'transparent',
          }}
        />

        <Toolbar
          leftElement="close"
          onLeftElementPress={screenProps.closeModalFunc}
          centerElement={'Choose a Photo'}
          rightElement="arrow-forward"
          onRightElementPress={this.advance}
          style={{
            container: {
              position: 'absolute',
              top: 0,
              width: '100%',
              paddingTop: statusBarHeight,
              height: toolbarHeight,
              backgroundColor: 'transparent',
            },
          }}
        />

        <View style={styles.controls}>
          {!selectedImageSource &&
            !capturing &&
            <Button title="Shutter" onPress={this.takePhoto} />}

          <View>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, .4)']}
              style={{
                width: '100%',
                position: 'absolute',
                top: 0,
                bottom: 0,
                backgroundColor: 'transparent',
              }}
            />

            <ScrollView style={styles.thumbnails} horizontal>
              <TouchableOpacity
                style={styles.thumbnail}
                onPress={action(() => {
                  this.selectedImageSource = null;
                })}>
                <MaterialIcon
                  name="photo-camera"
                  size={64}
                  color="rgba(255, 255, 255, .79)"
                />
              </TouchableOpacity>

              {cameraRoll.photos.map(photo =>
                <TouchableOpacity
                  key={photo.image.uri}
                  onPress={action(() => {
                    // photo.image has getter/setters, so we make it its own object
                    // to work with Image props later.
                    this.selectedImageSource = { ...photo.image };
                  })}>
                  <Image style={styles.thumbnail} source={photo.image} />
                </TouchableOpacity>,
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
