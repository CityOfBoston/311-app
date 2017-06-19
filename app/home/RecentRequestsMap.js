// @flow

import React, { Component } from 'react';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import { StyleSheet, View } from 'react-native';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE_PATH } from 'react-native-dotenv';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'blue',
  },
  map: {
    flex: 1,
  },
});

export default class MapExample extends Component {
  setMap = map => {
    console.log(map);
  };

  render() {
    console.log('RENDERING');
    return (
      <View style={styles.container}>
        <MapView
          ref={this.setMap}
          style={styles.map}
          initialCenterCoordinate={{
            latitude: 42.2343096,
            longitude: -71.18572135,
          }}
          initialZoomLevel={11}
          rotateEnabled={false}
          scrollEnabled={true}
          zoomEnabled={true}
          showsUserLocation={false}
          styleURL={`mapbox://styles/${MAPBOX_STYLE_PATH}`}
        />
      </View>
    );
  }
}
