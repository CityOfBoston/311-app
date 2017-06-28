// @flow

import { observable, action } from 'mobx';
import { Dimensions } from 'react-native';
import StatusBarSizeIOS from 'react-native-status-bar-size';

export default class Ui {
  @observable statusBarHeight: number = 20;
  @observable windowWidth: number;
  @observable windowHeight: number;

  attach = action(() => {
    this.statusBarHeight = StatusBarSizeIOS.currentHeight || 20;
    StatusBarSizeIOS.addEventListener('didChange', this.statusBarDidChange);

    const { width, height } = Dimensions.get('window');
    this.windowWidth = width;
    this.windowHeight = height;
    Dimensions.addEventListener('change', this.dimensionsDidChange);
  });

  detach() {
    StatusBarSizeIOS.removeEventListener('didChange', this.statusBarDidChange);
    Dimensions.removeEventListener('change', this.dimensionsDidChange);
  }

  statusBarDidChange = action((newHeight: number) => {
    this.statusBarHeight = newHeight;
  });

  dimensionsDidChange = action(({ window: { width, height } }) => {
    this.windowWidth = width;
    this.windowHeight = height;
  });
}
