// @flow

import React from 'react';
import { Image, FlatList, StyleSheet, Text, View } from 'react-native';
import { ListItem } from 'react-native-material-ui';
import { withRouter } from 'react-router-native';

import type { SearchCase } from '../types';

import {
  PRIMARY_TEXT_COLOR,
  SECONDARY_TEXT_COLOR,
} from '../common/style-constants';

const casesListItemStyles = StyleSheet.create({
  center: {
    flexDirection: 'column',
  },
  serviceName: {
    color: PRIMARY_TEXT_COLOR,
  },
  description: {
    color: SECONDARY_TEXT_COLOR,
  },
});

export const CasesListItem = withRouter(
  class CasesListItem extends React.Component {
    props: {
      history: any,
      searchCase: SearchCase,
    };

    pressed = () => {
      const { searchCase, history } = this.props;
      history.push(`/case/${searchCase.id}`);
    };

    render() {
      const { searchCase } = this.props;
      return (
        <ListItem
          divider
          numberOfLines={2}
          onPress={this.pressed}
          leftElement={
            <Image
              style={{ width: 40, height: 40 }}
              source={searchCase.mediaUrl ? { uri: searchCase.mediaUrl } : null}
              defaultSource={{
                uri: '311-logo-white-on-grey',
              }}
            />
          }
          centerElement={
            <View style={casesListItemStyles.center}>
              <Text
                style={casesListItemStyles.serviceName}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {searchCase.service.name}
              </Text>

              <Text
                style={casesListItemStyles.description}
                ellipsizeMode="tail"
                numberOfLines={2}>
                {searchCase.description}
              </Text>
            </View>
          }
        />
      );
    }
  },
);

export type Props = {|
  style?: any,
  searchCases: SearchCase[],
|};

export default class CasesList extends React.Component {
  props: Props;

  caseKeyExtractor = (c: SearchCase) => c.id;

  render() {
    const { searchCases, style } = this.props;
    return (
      <FlatList
        data={searchCases}
        renderItem={({ item }) => <CasesListItem searchCase={item} />}
        keyExtractor={this.caseKeyExtractor}
        style={style}
      />
    );
  }
}
