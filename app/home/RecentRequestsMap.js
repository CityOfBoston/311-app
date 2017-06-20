// @flow

import React, { Component } from 'react';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import { StyleSheet, View } from 'react-native';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE_PATH } from 'react-native-dotenv';
import { observable, runInAction, reaction, action } from 'mobx';
import { observer } from 'mobx-react/native';

import type { SearchCase } from '../types';

import fetchGraphql from '../fetch-graphql';
import searchCases from '../queries/search-cases';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const DEFAULT_NORTH_EAST = {
  lat: 42.2343096,
  lng: -71.18572135,
};

const DEFAULT_SOUTH_WEST = {
  lat: 42.397721,
  lng: -70.9925,
};

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

type MapboxAnnotation = {|
  // lat, lng
  coordinates: [number, number],
  type: 'point' | 'polyline' | 'polygon',
  title?: string, // optional. Title string. Appears when marker pressed
  subtitle?: string, // optional. Subtitle string. Appears when marker pressed
  id: string, // required. string. Unique identifier used for adding or selecting an annotation.
  annotationImage?: {|
    source: {|
      // required. string. Either remote image URL or the name (without extension) of a bundled image
      uri: string,
    |},
    height: number, // required. number. Image height
    width: number, // required. number. Image width
  |},
  rightCalloutAccessory?: {|
    source: {|
      uri: string, // required. string. Either remote image URL or the name (without extension) of a bundled image
    |},
    height: number, // required. number. Image height
    width: number, // required. number. Image width
  |},
|};

@observer
export default class RecentRequestsMap extends Component {
  map: ?MapView;

  @observable topLeftLat: number;
  @observable topLeftLng: number;
  @observable bottomRightLat: number;
  @observable bottomRightLng: number;

  mapSearchDisposer: ?Function;

  @observable cases: SearchCase[] = [];
  @observable.shallow annotations: MapboxAnnotation[] = [];

  componentWillMount() {}

  componentDidMount() {
    this.mapSearchDisposer = reaction(
      () => ({
        topLeft: {
          lat: this.topLeftLat,
          lng: this.topLeftLng,
        },
        bottomRight: {
          lat: this.bottomRightLat,
          lng: this.bottomRightLng,
        },
      }),
      async ({ topLeft, bottomRight }) => {
        const results = await searchCases(
          fetchGraphql,
          null,
          topLeft,
          bottomRight,
        );

        this.updateCases(results.cases);
      },
      {
        name: 'map search',
        compareStructural: true,
        delay: 100,
      },
    );
  }

  componentWillUnmount() {
    if (this.mapSearchDisposer) {
      this.mapSearchDisposer();
    }
  }

  setMap = (map: ?MapView) => {
    this.map = map;

    setTimeout(() => {
      if (map) {
        map.setVisibleCoordinateBounds(
          DEFAULT_SOUTH_WEST.lat,
          DEFAULT_SOUTH_WEST.lng,
          DEFAULT_NORTH_EAST.lat,
          DEFAULT_NORTH_EAST.lng,
          0,
          0,
          0,
          0,
          false,
        );
      }
    });
  };

  // need to debounce all of this
  regionDidChange = async () => {
    const { map } = this;
    if (!map) {
      return;
    }

    const [
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
    ] = await new Promise(resolve => map.getBounds(resolve));

    runInAction('getBounds response', () => {
      this.topLeftLat = northEastLat;
      this.topLeftLng = southWestLng;
      this.bottomRightLat = southWestLat;
      this.bottomRightLng = northEastLng;
    });
  };

  updateCases = action((newCases: SearchCase[]) => {
    const newCaseIdSet: Set<string> = new Set();
    const oldCaseIdSet: Set<string> = new Set();

    newCases.forEach(c => {
      newCaseIdSet.add(c.id);
    });

    this.annotations.forEach(c => {
      oldCaseIdSet.add(c.id);
    });

    this.annotations = [
      ...this.annotations.filter(c => newCaseIdSet.has(c.id)),
      ...newCases
        .filter(c => !oldCaseIdSet.has(c.id))
        .map((c): MapboxAnnotation => ({
          id: c.id,
          coordinates: c.location ? [c.location.lat, c.location.lng] : [0, 0],
          type: 'point',
          annotationImage: {
            source: {
              uri: c.status === 'open'
                ? 'green-empty-waypoint'
                : 'orange-empty-waypoint',
            },
            width: 27,
            height: 44,
          },
        })),
    ];
  });

  render() {
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
          onRegionDidChange={this.regionDidChange}
          annotationsAreImmutable
          annotations={this.annotations.slice()}
        />
      </View>
    );
  }
}
