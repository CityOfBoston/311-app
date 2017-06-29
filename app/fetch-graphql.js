// @flow

import { GRAPHQL_URL, GRAPHQL_API_KEY } from 'react-native-dotenv';

type QueryVariables = { [key: string]: any };

const makeGraphQLError = (message, errors) => {
  if (!message) {
    message = `[Server] ${errors.map(e => e.message).join(', ')}`;
  }

  const e: Object = new Error(message);
  e.errors = errors;
  return e;
};

/**
 * Given a bit that's true if the response was a 200, and a parsed JSON
 * representation of the response body, either returns the GraphQL
 * response (from the "data" key) or throws an exception with the
 * GraphQL errors attached.
 */
function handleGraphqlResponse(ok, json) {
  if (ok && !json.errors) {
    return json.data;
  } else {
    throw makeGraphQLError(json.message, json.errors);
  }
}

let clientCache = {};

export function setClientCache(cache: { [key: string]: mixed }) {
  clientCache = cache;
}

export type FetchGraphqlOptions = {
  cacheKey?: string,
};

export default async function fetchGraphql(
  query: string,
  variables?: ?QueryVariables = null,
  options?: FetchGraphqlOptions = {},
): Promise<any> {
  const { cacheKey } = options;

  if (cacheKey && clientCache[cacheKey]) {
    return clientCache[cacheKey];
  }

  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-KEY': GRAPHQL_API_KEY,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (res.ok) {
    // only assume we can json if the response is ok
    const value = handleGraphqlResponse(true, await res.json());
    if (cacheKey) {
      clientCache[cacheKey] = value;
    }
    return value;
  } else {
    throw new Error(await res.text());
  }
}

export type fetchGraphqlType = (
  query: string,
  variables?: ?QueryVariables,
  options?: FetchGraphqlOptions,
) => Promise<any>;
