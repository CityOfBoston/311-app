// @flow

import React, { Component } from 'react';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import { StyleSheet, View } from 'react-native';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE_PATH } from 'react-native-dotenv';
import { observable, runInAction, reaction, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react/native';

import type CaseSearch from '../store/CaseSearch';
import type { SearchCase } from '../types';

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

export type Props = {|
  caseSearch?: CaseSearch,
  style?: Object,
  onTap?: ?() => mixed,
  onSelectCaseId: (caseId: ?string) => mixed,
  selectedCaseId: ?string,
|};

@inject('caseSearch')
@observer
export default class RecentRequestsMap extends Component {
  props: Props;

  map: ?MapView;

  @observable.shallow annotations: MapboxAnnotation[] = [];
  updateAnnotationsDisposer: ?Function;

  componentDidMount() {
    const { caseSearch } = this.props;

    if (caseSearch) {
      this.updateAnnotationsDisposer = reaction(
        () => caseSearch.cases,
        this.updateAnnotations,
        {
          name: 'update annotations',
          fireImmediately: true,
        },
      );
    }
  }

  componentWillUnmount() {
    if (this.updateAnnotationsDisposer) {
      this.updateAnnotationsDisposer();
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

  regionDidChange = async () => {
    const { map } = this;
    const { caseSearch } = this.props;

    if (!map || !caseSearch) {
      return;
    }

    const [
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
    ] = await new Promise(resolve => map.getBounds(resolve));

    runInAction('getBounds response', () => {
      caseSearch.topLeftLat = northEastLat;
      caseSearch.topLeftLng = southWestLng;
      caseSearch.bottomRightLat = southWestLat;
      caseSearch.bottomRightLng = northEastLng;
    });
  };

  annotationOpened = ({ id }: { id: string }) => {
    const { onSelectCaseId } = this.props;
    onSelectCaseId(id);
  };

  mapTapped = action('mapTapped', () => {
    const { onSelectCaseId, onTap } = this.props;
    if (onTap) {
      onTap();
    } else {
      onSelectCaseId(null);
    }
  });

  @computed
  get annotationsWithSelection(): MapboxAnnotation[] {
    const { caseSearch, selectedCaseId } = this.props;
    const { annotations } = this;

    if (!caseSearch) {
      return annotations;
    }

    return annotations.map(
      (a): any =>
        a.id === selectedCaseId && a.annotationImage
          ? {
              ...a,
              annotationImage: {
                ...a.annotationImage,
                source: {
                  uri: a.annotationImage.source.uri.replace('empty', 'filled'),
                },
              },
            }
          : a,
    );
  }

  updateAnnotations = (newCases: SearchCase[]) => {
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
                ? 'orange-empty-waypoint'
                : 'green-empty-waypoint',
            },
            width: 27,
            height: 44,
          },
        })),
    ];
  };

  render() {
    return (
      <View style={StyleSheet.flatten([styles.container, this.props.style])}>
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
          onOpenAnnotation={this.annotationOpened}
          onTap={this.mapTapped}
          logoIsHidden={true}
          annotationsAreImmutable
          annotations={this.annotationsWithSelection.slice()}
          attributionButtonIsHidden
        />
      </View>
    );
  }
}
