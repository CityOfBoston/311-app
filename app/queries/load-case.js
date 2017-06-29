// @flow

import type { Case } from '../types';
import type { fetchGraphqlType } from '../fetch-graphql';

import type { LoadCaseQuery, LoadCaseQueryVariables } from './graphql-types';
import LoadCaseGraphql from './LoadCase.graphql';

// Load a single service request from its id (e.g. "17-00001615"). Returns
// null if the request is not found.
export default async function loadCase(
  fetchGraphql: fetchGraphqlType,
  id: string,
): Promise<?Case> {
  const queryVariables: LoadCaseQueryVariables = { id };
  const response: LoadCaseQuery = await fetchGraphql(
    LoadCaseGraphql,
    queryVariables,
  );
  return response.case;
}
