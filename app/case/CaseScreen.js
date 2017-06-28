// @flow

import React from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Toolbar } from 'react-native-material-ui';
import LinearGradient from 'react-native-linear-gradient';

import { action, observable, computed } from 'mobx';
import { observer, inject } from 'mobx-react/native';

import BottomSheet from '../common/BottomSheet';
import type CaseSearch from '../store/CaseSearch';
import type Ui from '../store/Ui';

import type { Case } from '../types';
import fetchGraphql from '../fetch-graphql';
import loadCase from '../queries/load-case';

import {
  YELLOW,
  GREEN,
  CHARLES_BLUE,
  SECONDARY_TEXT_COLOR,
} from '../common/style-constants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  caseContent: {
    zIndex: 10,
    padding: 0,
    backgroundColor: 'white',
  },
  serviceNameBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  },
  serviceNameText: {
    fontSize: 20,
    color: 'white',
  },
  infoText: {
    fontSize: 14,
    color: 'white',
  },
  subheadText: {
    color: SECONDARY_TEXT_COLOR,
    fontSize: 16,
    marginBottom: 8,
  },
  descriptionText: {
    color: CHARLES_BLUE,
    fontSize: 14,
    marginBottom: 16,
  },
});

export type Props = {|
  caseSearch?: CaseSearch,
  ui?: Ui,
  match: any,
  location: any,
  history: any,
  miniView?: boolean,
  heightValue?: Animated.Value,
|};

export type State = {|
  kase: ?Case,
  loading: boolean,
|};

@inject('ui', 'caseSearch')
@observer
export default class CaseScreen extends React.Component {
  props: Props;
  state: State = {
    kase: null,
    loading: false,
  };

  scrollView: ScrollView;
  scrollDoneTimeout: ?number;

  @observable scrollPosition: number = 0;

  componentWillMount() {
    const { match: { params } } = this.props;

    this.setState({ loading: true });
    loadCase(fetchGraphql, params.id).then(
      (kase: ?Case) => {
        this.setState({
          kase,
          loading: false,
        });
      },
      () => {
        this.setState({
          kase: null,
          loading: false,
        });
      },
    );
  }

  setScrollView = (scrollView: ScrollView) => {
    this.scrollView = scrollView;
  };

  scrolled = action(ev => {
    this.scrollPosition = ev.nativeEvent.contentOffset.y;
  });

  scrollDragEnded = () => {
    this.scrollDoneTimeout = setTimeout(this.adjustAfterScroll, 10);
  };

  scrollMomentumDragStarted = () => {
    if (this.scrollDoneTimeout) {
      clearTimeout(this.scrollDoneTimeout);
      this.scrollDoneTimeout = null;
    }
  };

  scrollMomentumDragEnded = () => {
    this.adjustAfterScroll();
  };

  adjustAfterScroll = () => {
    this.scrollDoneTimeout = null;
    const { ui } = this.props;

    if (!ui) {
      return;
    }

    const { imageHeight, fullScreenTop } = this;

    const thresholdHeight = imageHeight / 2;

    if (this.scrollPosition < thresholdHeight) {
      this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    } else if (this.scrollPosition < fullScreenTop) {
      this.scrollView.scrollTo({ x: 0, y: fullScreenTop, animated: true });
    }
  };

  @computed
  get toolbarHeight(): number {
    const { ui } = this.props;

    if (!ui) {
      return 56;
    } else {
      return 56 + ui.statusBarHeight;
    }
  }

  @computed
  get imageHeight(): number {
    const { ui } = this.props;

    if (!ui) {
      return 0;
    }

    const { windowWidth } = ui;
    return windowWidth / 1.5;
  }

  @computed
  get bannerHeight(): number {
    const { ui } = this.props;

    if (!ui) {
      return 0;
    }

    const { windowWidth } = ui;

    // 1:1 aspect ratio for image + banner
    const topAreaHeight = windowWidth;
    return topAreaHeight - this.imageHeight;
  }

  @computed
  get fullScreenTop(): number {
    return this.imageHeight - this.toolbarHeight + this.bannerHeight;
  }

  render() {
    const { ui, history, miniView } = this.props;
    const { kase } = this.state;

    if (!ui || !history) {
      return null;
    }
    const { statusBarHeight, windowHeight } = ui;
    const { imageHeight, bannerHeight } = this;

    let backgroundColor;

    if (miniView || !kase) {
      backgroundColor = 'white';
    } else if (kase.status === 'closed') {
      backgroundColor = GREEN;
    } else {
      backgroundColor = YELLOW;
    }

    const transparentToolbar = this.scrollPosition < imageHeight;

    return (
      <View style={styles.container}>
        {!miniView &&
          <Toolbar
            leftElement="arrow-back"
            onLeftElementPress={() => history.goBack()}
            centerElement={
              transparentToolbar ? null : kase ? kase.service.name : null
            }
            style={{
              container: {
                position: 'absolute',
                width: '100%',
                paddingTop: statusBarHeight,
                height: this.toolbarHeight,
                backgroundColor: transparentToolbar
                  ? 'transparent'
                  : backgroundColor,
              },
            }}
          />}

        <ScrollView
          ref={this.setScrollView}
          stickyHeaderIndices={[0]}
          scrollEventThrottle={32}
          scrollEnabled={!miniView}
          onScroll={this.scrolled}
          onScrollEndDrag={this.scrollDragEnded}
          onMomentumScrollBegin={this.scrollMomentumDragStarted}
          onMomentumScrollEnd={this.scrollMomentumDragEnded}
          decelerationRate={0.00001}
          style={{ backgroundColor: CHARLES_BLUE, flex: 1 }}>

          {!miniView &&
            <BottomSheet>
              <Image
                style={{ width: '100%', height: imageHeight }}
                source={kase && kase.mediaUrl ? { uri: kase.mediaUrl } : null}
                defaultSource={{ uri: '311-watermark' }}>
                <LinearGradient
                  colors={['rgba(0, 0, 0, .4)', 'rgba(0, 0, 0, 0)']}
                  style={{
                    width: '100%',
                    height: 46,
                    backgroundColor: 'transparent',
                  }}
                />

              </Image>
            </BottomSheet>}

          <BottomSheet style={styles.caseContent}>
            <View
              style={StyleSheet.flatten([
                styles.serviceNameBox,
                { height: bannerHeight, backgroundColor },
              ])}>
              <Text
                style={StyleSheet.flatten([
                  styles.serviceNameText,
                  {
                    color: backgroundColor === 'white' ? CHARLES_BLUE : 'white',
                  },
                ])}
                numberOfLines={1}
                ellipsizeMode="tail">
                {kase && kase.service.name}
              </Text>

              <Text
                style={StyleSheet.flatten([
                  styles.infoText,
                  {
                    color: backgroundColor === 'white' ? CHARLES_BLUE : 'white',
                  },
                ])}
                numberOfLines={1}>
                {kase && kase.requestedAtString}
              </Text>

              <Text
                style={StyleSheet.flatten([
                  styles.infoText,
                  {
                    color: backgroundColor === 'white' ? CHARLES_BLUE : 'white',
                  },
                ])}
                numberOfLines={1}>
                {kase && kase.address}
              </Text>
            </View>

            <View
              style={{
                padding: 20,
                minHeight: windowHeight - imageHeight - bannerHeight,
              }}>

              {kase &&
              kase.statusNotes && [
                <Text key="head" style={styles.subheadText}>Resolution</Text>,
                <Text key="text" style={styles.descriptionText}>
                  {kase.statusNotes}
                </Text>,
              ]}

              <Text style={styles.subheadText}>Description</Text>
              <Text style={styles.descriptionText}>
                {kase && kase.description}
              </Text>
            </View>
          </BottomSheet>
        </ScrollView>
      </View>
    );
  }
}
