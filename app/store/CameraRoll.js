// @flow

import { CameraRoll as ReactNativeCameraRoll } from 'react-native';
import { observable, runInAction } from 'mobx';

type GetPhotosReturnType = {|
  edges: Array<{
    node: {
      type: string,
      group_name: string,
      image: {
        uri: string,
        height: number,
        width: number,
        isStored?: boolean,
      },
      timestamp: number,
      location: {
        latitude: number,
        longitude: number,
        altitude: number,
        heading: number,
        speed: number,
      },
    },
  }>,

  page_info: {
    has_next_page: boolean,
    start_cursor?: string,
    end_cursor?: string,
  },
|};

export type Photo = $PropertyType<
  $ArrayElement<$PropertyType<GetPhotosReturnType, 'edges'>>,
  'node',
>;

export default class CameraRoll {
  @observable.shallow photos: Photo[] = [];

  attach() {
    this.loadPhotos();
  }

  detach() {}

  async loadPhotos() {
    const photosResults: GetPhotosReturnType = await ReactNativeCameraRoll.getPhotos(
      {
        first: 10,
      },
    );

    runInAction('getPhotos response', () => {
      this.photos = photosResults.edges.map(e => e.node);
    });
  }
}
