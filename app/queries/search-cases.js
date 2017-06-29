// @flow

import type { SearchCasesResult } from '../types';
import type { fetchGraphqlType } from '../fetch-graphql';

import type {
  SearchCasesQuery,
  SearchCasesQueryVariables,
} from './graphql-types';
import SearchCasesGraphql from './SearchCases.graphql';

// Searches cases by query and / or location.
export default async function searchCases(
  fetchGraphql: fetchGraphqlType,
  query: ?string = null,
  topLeft: ?{| lat: number, lng: number |},
  bottomRight: ?{| lat: number, lng: number |},
): Promise<SearchCasesResult> {
  const args: SearchCasesQueryVariables = {
    query,
    topLeft,
    bottomRight,
  };

  const response: SearchCasesQuery = await fetchGraphql(
    SearchCasesGraphql,
    args,
  );
  return response.searchCases;
}
