// @flow

import { observable, reaction, runInAction } from 'mobx';

import type { SearchCase } from '../types';

import type { fetchGraphqlType } from '../fetch-graphql';
import searchCases from '../queries/search-cases';

export default class CaseSearch {
  fetchGraphql: fetchGraphqlType;

  @observable query: string = '';

  @observable topLeftLat: number;
  @observable topLeftLng: number;
  @observable bottomRightLat: number;
  @observable bottomRightLng: number;

  mapSearchDisposer: ?Function;

  @observable.shallow cases: SearchCase[] = [];

  attach(fetchGraphql: fetchGraphqlType) {
    this.fetchGraphql = fetchGraphql;
    this.mapSearchDisposer = reaction(
      () => ({
        query: this.query,
        topLeft: {
          lat: this.topLeftLat,
          lng: this.topLeftLng,
        },
        bottomRight: {
          lat: this.bottomRightLat,
          lng: this.bottomRightLng,
        },
      }),
      async ({ query, topLeft, bottomRight }) => {
        const results = await searchCases(
          fetchGraphql,
          query,
          topLeft,
          bottomRight,
        );

        runInAction('map search async result', () => {
          this.cases = results.cases;
        });
      },
      {
        name: 'map search',
        compareStructural: true,
        delay: 100,
      },
    );
  }

  detach() {
    if (this.mapSearchDisposer) {
      this.mapSearchDisposer();
      this.mapSearchDisposer = null;
    }
  }
}
