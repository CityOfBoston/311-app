// @flow

import React from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Modal,
} from 'react-native';
import type { Location, Match } from 'react-router-native';
import { ActionButton, Button, Toolbar } from 'react-native-material-ui';

import { action } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { fromPromise } from 'mobx-utils';
import type { IPromiseBasedObservable } from 'mobx-utils';

import type CaseSearch from '../store/CaseSearch';
import type Ui from '../store/Ui';
import Request from '../store/Request';

import type { SubmittedRequest } from '../types';
import fetchGraphql from '../fetch-graphql';
import submitRequest from '../queries/submit-request';

import { CHARLES_BLUE, DISABLED_TEXT_COLOR } from '../common/style-constants';
import ViewTransitionGroup from '../common/ViewTransitionGroup';
import { AnimatedBottomSheet } from '../common/BottomSheet';

import CaseScreen from '../case/CaseScreen';

import RecentRequestsMap from './RecentRequestsMap';
import CasesList from './CasesList';

import RequestModal from '../request/RequestModal';
import type { RequestScreenProps } from '../request/RequestModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

export type Props = {|
  caseSearch?: CaseSearch,
  ui?: Ui,
  match: Match,
  location: Location,
  history: any,
|};

export type State = {|
  modalVisible: boolean,
  request: Request,
  showCaseList: boolean,
|};

const animatedActionButtonStyle = (val: Animated.Value) => ({
  positionContainer: {
    opacity: val,
    position: 'relative',
    alignSelf: 'flex-end',
    transform: [
      { scale: val },
      {
        rotateZ: val.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  },
});

const animatedBottomListStyle = (val: Animated.Value) => ({
  height: val.interpolate({ inputRange: [0, 1], outputRange: [0, 44] }),
});

const animatedCaseListStyle = (val: Animated.Value) => ({
  height: val.interpolate({ inputRange: [0, 1], outputRange: ['0%', '60%'] }),
});

class MiniCardTransition extends React.Component {
  props: {
    windowHeight: number,
    children?: any,
    onPress: () => mixed,
  };

  popValue: Animated.Value;

  constructor(props) {
    super(props);

    this.popValue = new Animated.Value(props.windowHeight);
  }

  componentWillAppear(done) {
    const { windowHeight } = this.props;
    this.popValue.removeAllListeners();

    this.popValue.setValue(windowHeight - 78);

    done();
  }

  componentWillEnter(done) {
    const { windowHeight } = this.props;

    this.popValue.removeAllListeners();

    Animated.timing(this.popValue, {
      toValue: windowHeight - 78,
      duration: 250,
    }).start();

    done();
  }

  componentWillLeave(done) {
    const { windowHeight } = this.props;

    this.popValue.removeAllListeners();

    this.popValue.addListener(({ value }) => {
      if (value === windowHeight) {
        done();
      }
    });

    Animated.timing(this.popValue, {
      toValue: windowHeight,
      duration: 250,
    }).start();
  }

  render() {
    const { onPress } = this.props;

    return (
      <Animated.View
        style={{
          position: 'absolute',
          width: '100%',
          top: this.popValue,
          bottom: 0,
          backgroundColor: 'orange',
          zIndex: 2,
        }}>
        <TouchableHighlight
          onPress={onPress}
          style={{ backgroundColor: 'blue' }}>
          <View style={{ backgroundColor: 'green', height: '100%' }}>
            {this.props.children}
          </View>
        </TouchableHighlight>
      </Animated.View>
    );
  }
}

@inject('ui', 'caseSearch')
@observer
export default class HomeScreen extends React.Component {
  props: Props;
  state: State = {
    modalVisible: false,
    request: new Request(),
    showCaseList: false,
  };

  caseIdSelected = (selectedCaseId: ?string) => {
    const { match, history } = this.props;

    if (selectedCaseId && selectedCaseId.toString() !== match.params.id) {
      if (match.params.id) {
        history.replace(`/search/${selectedCaseId}`);
      } else {
        history.push(`/search/${selectedCaseId}`);
      }
    } else if (match.params.id) {
      if (history.entries[history.index - 1] === '/search') {
        history.goBack();
      } else {
        history.push('/search');
      }
    }
  };

  miniCardPressed = () => {
    const { match, history } = this.props;
    history.push(`/case/${match.params.id}`);
  };

  openModal = () => {
    this.setState({
      modalVisible: true,
      request: new Request(),
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  searchTextChanged = action(query => {
    const { caseSearch } = this.props;
    if (!caseSearch) {
      return;
    }

    caseSearch.query = query;
  });

  submitRequest = (): IPromiseBasedObservable<SubmittedRequest> => {
    const { request } = this.state;

    if (!request.serviceCode) {
      throw new Error('submitRequest called without a serviceCode');
    }

    const args = {
      serviceCode: request.serviceCode,
      description: request.description,
      firstName: 'Fin',
      lastName: 'Hopkins',
      email: 'fin.hopkins@boston.gov',
      phone: null,
      location: null,
      address: null,
      addressId: null,
      questions: request.questions,
      mediaUrl: '',
    };

    return fromPromise(submitRequest(fetchGraphql, args));
  };

  showCaseList = () => {
    this.setState({ showCaseList: true });
  };

  hideCaseList = () => {
    this.setState({ showCaseList: false });
  };

  render() {
    const { ui, caseSearch, match } = this.props;
    const { modalVisible, request, showCaseList } = this.state;

    if (!caseSearch || !ui) {
      return null;
    }

    const { statusBarHeight, windowHeight } = ui;
    const selectedCaseId = match.params.id;

    const paddingTop = statusBarHeight;
    const toolbarHeight = 56 + paddingTop;

    return (
      <View style={styles.container}>
        <Toolbar
          leftElement="menu"
          centerElement="BOS:311"
          searchable={{
            autoFocus: true,
            placeholder: 'Search cases',
            onChangeText: this.searchTextChanged,
          }}
          style={{ container: { paddingTop, height: toolbarHeight } }}
        />

        <ViewTransitionGroup
          style={{ position: 'relative', flex: 1, justifyContent: 'flex-end' }}>

          <RecentRequestsMap
            key="map"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
            onTap={showCaseList ? this.hideCaseList : null}
            selectedCaseId={selectedCaseId}
            onSelectCaseId={this.caseIdSelected}
          />

          {showCaseList &&
            <ViewTransitionGroup.Animate
              key="case-list"
              transitionStyle={animatedCaseListStyle}>
              <AnimatedBottomSheet
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'flex-start',
                }}>
                <CasesList searchCases={caseSearch.cases} />
              </AnimatedBottomSheet>
            </ViewTransitionGroup.Animate>}

          {!showCaseList &&
            <ViewTransitionGroup.Animate
              key="action-button"
              transitionStyle={animatedActionButtonStyle}>

              <ActionButton
                style={{ container: { zIndex: 10 } }}
                onPress={this.openModal}
              />
            </ViewTransitionGroup.Animate>}

          {!showCaseList &&
            !selectedCaseId &&
            <ViewTransitionGroup.Animate
              key="case-list-button"
              transitionStyle={animatedBottomListStyle}>
              <AnimatedBottomSheet
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                {caseSearch.cases.length
                  ? <Button
                      text="List nearby cases"
                      style={{
                        container: { justifyContent: 'flex-start' },
                        text: { color: CHARLES_BLUE, opacity: 0.87 },
                      }}
                      onPress={this.showCaseList}
                    />
                  : <View style={{ padding: 16 }}>
                      <Text style={{ color: DISABLED_TEXT_COLOR }}>
                        Loading…
                      </Text>
                    </View>}
              </AnimatedBottomSheet>
            </ViewTransitionGroup.Animate>}

          {selectedCaseId &&
            <MiniCardTransition
              key="selected-case"
              windowHeight={windowHeight - toolbarHeight}
              onPress={this.miniCardPressed}>
              <CaseScreen
                key={selectedCaseId}
                history={this.props.history}
                location={this.props.location}
                match={this.props.match}
                miniView
              />
            </MiniCardTransition>}
        </ViewTransitionGroup>

        <Modal
          animationType={'slide'}
          transparent={false}
          visible={modalVisible}>
          {modalVisible &&
            <RequestModal
              screenProps={
                ({
                  closeModalFunc: this.closeModal,
                  submitRequestFunc: this.submitRequest,
                  request,
                }: RequestScreenProps)
              }
            />}
        </Modal>

      </View>
    );
  }
}
