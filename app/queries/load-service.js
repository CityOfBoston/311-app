// @flow

import type { Service } from '../types';
import type { fetchGraphqlType } from '../fetch-graphql';

import type {
  LoadServiceQuery,
  LoadServiceQueryVariables,
} from './graphql-types';
import LoadServiceGraphql from './LoadService.graphql';

// Loads a single Service instance, with information about what questions are
// defined for requests to that service, whether contact/location info is
// required, &c.
export default async function loadService(
  fetchGraphql: fetchGraphqlType,
  code: string,
): Promise<?Service> {
  const queryVariables: LoadServiceQueryVariables = { code };
  const response: LoadServiceQuery = await fetchGraphql(
    LoadServiceGraphql,
    queryVariables,
    { cacheKey: `loadService:${code}` },
  );
  return response.service;
}
