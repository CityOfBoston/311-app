// @flow

import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';

import type { Service } from '../types';

import Ui from '../store/Ui';
import Request from '../store/Request';
import Question from '../store/Question';

import QuestionsScreen from './QuestionsScreen';

const DEFAULT_PROPS = {
  ui: new Ui(),
  closeModalFunc: action('close modal'),
  advanceFunc: action('advance'),
};

function requestWithDescription(service: Service) {
  const request = new Request();
  request.description = 'Thanos is knocking down buildings';
  request.questions = Question.buildQuestions(service.attributes);
  return request;
}

const SIDEWALK_REPAIR: Service = {
  name: 'Broken Sidewalk',
  description:
    'Sidewalk is damaged due to normal deterioration, construction, or trees.',
  code: 'SDWRPR',
  contactRequirement: 'VISIBLE',
  locationRequirement: 'REQUIRED',
  attributes: [
    {
      required: true,
      type: 'SINGLEVALUELIST',
      code: 'SR-SDWRPR1',
      description: 'What is the cause of damage?',
      values: [
        {
          key: 'Tree',
          name: 'Tree',
        },
        {
          key: 'Normal Deterioration',
          name: 'Normal Deterioration',
        },
        {
          key: 'Construction',
          name: 'Construction',
        },
        {
          key: 'Utility Work',
          name: 'Utility Work',
        },
        {
          key: 'Other',
          name: 'Other',
        },
      ],
      conditionalValues: [],
      dependencies: null,
    },
    {
      required: false,
      type: 'TEXT',
      code: 'ST-OTHER',
      description: 'If other, please specify:',
      values: null,
      conditionalValues: null,
      dependencies: {
        clause: 'OR',
        conditions: [
          {
            attribute: 'SR-SDWRPR1',
            op: 'eq',
            value: {
              type: 'STRING',
              string: 'Other',
              array: null,
              number: null,
            },
          },
        ],
      },
    },
    {
      required: false,
      type: 'STRING',
      code: 'txt_NatureOfProblem',
      description: 'Detail information:',
      values: null,
      conditionalValues: null,
      dependencies: null,
    },
    {
      required: false,
      type: 'SINGLEVALUELIST',
      code: 'SR-SDWRPR2',
      description: 'What material is the sidewalk made of?',
      values: [
        {
          key: 'Concrete',
          name: 'Concrete',
        },
        {
          key: 'Asphalt',
          name: 'Asphalt',
        },
        {
          key: 'Brick',
          name: 'Brick',
        },
        {
          key: 'Other',
          name: 'Other',
        },
      ],
      conditionalValues: [],
      dependencies: null,
    },
    {
      required: true,
      type: 'SINGLEVALUELIST',
      code: 'SR-SDWRPR3',
      description: 'How many flags need to be repaired?',
      values: [
        {
          key: '6 or fewer',
          name: '6 or fewer',
        },
        {
          key: 'More than 6',
          name: 'More than 6',
        },
      ],
      conditionalValues: [],
      dependencies: null,
    },
  ],
};

storiesOf('QuestionsScreen', module).add('sidewalk repair', () =>
  <QuestionsScreen
    {...DEFAULT_PROPS}
    request={requestWithDescription(SIDEWALK_REPAIR)}
    service={SIDEWALK_REPAIR}
  />,
);
