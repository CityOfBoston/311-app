// @flow

import type {
  LoadServiceQuery,
  LoadServiceSuggestionsQuery,
  SearchCasesQuery,
  ServiceAttributeDatatype,
  SubmitRequestMutation,
} from './queries/graphql-types';

export type ServiceSummary = $ArrayElement<
  $PropertyType<LoadServiceSuggestionsQuery, 'servicesForDescription'>,
>;

export type Service = $NonMaybeType<$PropertyType<LoadServiceQuery, 'service'>>;

export type ServiceAttribute = $ArrayElement<
  $PropertyType<Service, 'attributes'>,
>;

export type ServiceAttributeValuesConditionSet = $PropertyType<
  $ArrayElement<
    $NonMaybeType<$PropertyType<ServiceAttribute, 'conditionalValues'>>,
  >,
  'dependentOn',
>;

export type ServiceAttributeValuesCondition = $ArrayElement<
  $PropertyType<ServiceAttributeValuesConditionSet, 'conditions'>,
>;

export type CalculatedAttribute = {
  required: boolean,
  type: ServiceAttributeDatatype,
  code: string,
  description: string,
  values: ?Array<{
    key: string,
    name: string,
  }>,
};

export type SubmittedRequest = $PropertyType<
  SubmitRequestMutation,
  'createRequest',
>;

export type SearchCasesResult = $PropertyType<SearchCasesQuery, 'searchCases'>;
export type SearchCase = $ArrayElement<
  $PropertyType<SearchCasesResult, 'cases'>,
>;
