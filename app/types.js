// @flow

import type {
  LoadServiceQuery,
  LoadServiceSuggestionsQuery,
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
