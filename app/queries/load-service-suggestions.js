// @flow

import type {
  LoadServiceSuggestionsQuery,
  LoadServiceSuggestionsQueryVariables,
} from './graphql-types';
import LoadServiceSuggestionsGraphql from './LoadServiceSuggestions.graphql';

import type { fetchGraphqlType } from '../fetch-graphql.js';
import type { ServiceSummary } from '../types';

export default async function loadServiceSuggestions(
  fetchGraphql: fetchGraphqlType,
  text: string,
): Promise<ServiceSummary[]> {
  const queryVariables: LoadServiceSuggestionsQueryVariables = {
    text,
  };
  const response: LoadServiceSuggestionsQuery = await fetchGraphql(
    LoadServiceSuggestionsGraphql,
    queryVariables,
  );
  return response.servicesForDescription;
}
