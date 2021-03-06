// @flow
/* eslint no-unused-vars: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { Divider, ListItem, RadioButton } from 'react-native-material-ui';

import ViewTransitionGroup from '../common/ViewTransitionGroup';

import type Question from '../store/Question';

import { CHARLES_BLUE, SECONDARY_TEXT_COLOR } from '../common/style-constants';

export type Props = {|
  question: Question,
|};

const styles = StyleSheet.create({
  question: {
    marginTop: 24,
  },
  descriptionText: {
    color: CHARLES_BLUE,
    fontSize: 16,
  },
  requiredText: {
    color: SECONDARY_TEXT_COLOR,
  },
  stringField: {
    height: 30,
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
  },
  textField: {
    height: 80,
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    padding: 5,
  },
});

@observer
class QuestionCenterElement extends React.Component {
  static contextTypes = {
    uiTheme: PropTypes.object.isRequired,
  };

  props: {
    question: Question,
  };

  render() {
    const { uiTheme } = this.context;
    const { question: { description, required, value } } = this.props;

    return (
      <View>
        <Text style={uiTheme.listItem.primaryText}>
          {description}
        </Text>
        {value
          ? <Text numberOfLines={1} style={uiTheme.listItem.secondaryText}>
              {value}
            </Text>
          : required &&
              <Text style={uiTheme.listItem.secondaryText}>Required</Text>}
      </View>
    );
  }
}

@observer
export class SingleValueListAttributeField extends React.Component {
  props: {
    question: Question,
  };

  onValueChange = action((checked: boolean, itemValue: string) => {
    const { question } = this.props;
    question.value = itemValue === '--no-answer-key--' ? '' : itemValue;
  });

  render() {
    const { question } = this.props;
    const { uiTheme } = this.context;
    const options = [...(question.valueOptions || [])];

    if (!question.required) {
      options.push({ key: '', name: 'No Answer' });
    }

    return (
      <View>
        {options.map(({ key, name }) =>
          <RadioButton
            key={key}
            value={key || '--no-answer-key--'}
            label={name}
            checked={key === question.value}
            onCheck={this.onValueChange}
          />,
        )}
      </View>
    );
  }
}

// Returns either one or two lists. If list’s length is less than splitLength,
// returns the entire list as the first element of an array. If list’s length
// is longer, splits in in half and returns each half.
function maybeSplitList(list, splitLength) {
  list = list || [];

  if (list.length < splitLength) {
    return [list];
  } else {
    const firstLength = Math.ceil(list.length / 2);
    return [list.slice(0, firstLength), list.slice(firstLength)];
  }
}

function currentValueAsArray(currentValue): string[] {
  if (!currentValue) {
    return [];
  }

  currentValue = currentValue.slice();

  if (Array.isArray(currentValue)) {
    return currentValue;
  } else {
    return [currentValue];
  }
}

function maybeRenderRequired(required: boolean) {
  if (required) {
    return <Text>Required</Text>;
  } else {
    return null;
  }
}

function renderCheckbox() {
  /*
  return (
    <div className="cb">
      <input
        name={question.code}
        id={question.code}
        type="checkbox"
        value="true"
        className="cb-f"
        checked={question.value === 'true'}
        onChange={onChange}
      />
      <label className="cb-l" htmlFor={question.code}>
        {question.description}
      </label>
    </div>
  );
  */
  return null;
}

function renderInformationalAttribute(question) {
  return <Text>{question.description}</Text>;
}

function renderTextAttribute(question, onChange) {
  return (
    <TextInput
      style={styles.textField}
      name={question.code}
      defaultValue={`${question.value || ''}`}
      onChangeText={onChange}
      multiline={true}
      autoFocus
    />
  );
}

function renderNumberAttribute(question, onChange) {
  return (
    <View>
      <Text>
        {question.description} {maybeRenderRequired(question.required)}
      </Text>
      <TextInput
        name={question.code}
        value={question.value}
        onChange={onChange}
        style={styles.stringField}
      />
    </View>
  );
}

function renderMultiValueListAttribute(question, onChange) {
  const values = currentValueAsArray(question.value);
  const lists = maybeSplitList(question.valueOptions, 5);

  const labelId = `${question.code}-label`;
  return null;
  /*
  return (
    <div role="group" aria-labelledby={labelId}>
      <div className="m-v300">
        <label className="txt-l" id={labelId}>
          {question.description} {maybeRenderRequired(question.required)}
        </label>
      </div>
      <div className="g">
        {lists.map((list, i) =>
          <div
            className={lists.length === 1 ? 'g--12' : 'g--6'}
            key={`list-${i}`}>
            {list.map(({ key, name }) =>
              <div className="cb" key={key}>
                <input
                  name={question.code}
                  id={`${question.code}-${key}`}
                  type="checkbox"
                  value={key}
                  className="cb-f"
                  checked={values.indexOf(key) !== -1}
                  onChange={onChange}
                />
                <label className="cb-l" htmlFor={`${question.code}-${key}`}>
                  {name}
                </label>
              </div>,
            )}
          </div>,
        )}
      </div>
    </div>
  );
  */
}

@observer
export default class AttributeField extends React.Component {
  props: Props;
  state: {
    expanded: boolean,
  };

  constructor(props: Props) {
    super(props);

    const { question } = props;

    this.state = {
      expanded: question.required,
    };
  }

  onChange = action((value: string) => {
    const { question } = this.props;

    if (question.type === 'NUMBER') {
      question.value = value.replace(/\D+/g, '');
    } else if (question.type === 'DATE') {
      if (value) {
        const datePieces = value.split('/');
        question.value = `${datePieces[2] || ''}-${datePieces[0] ||
          ''}-${datePieces[1] || ''}`;
      } else {
        question.value = '';
      }
    } else {
      question.value = value === '--no-answer-key--' ? '' : value;
    }
  });

  onCheckbox = action((ev: SyntheticInputEvent) => {
    const { question } = this.props;
    question.value = (ev.target.checked || false).toString();
  });

  onMultivalueList = action((ev: SyntheticInputEvent) => {
    const { question } = this.props;
    const values = currentValueAsArray(question.value);

    if (ev.target.checked) {
      question.value = [...values, ev.target.value];
    } else {
      question.value = values.filter(v => v !== ev.target.value);
    }
  });

  toggleExpansion = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  render() {
    const { question } = this.props;
    const { expanded } = this.state;

    return (
      <View>
        <ListItem
          numberOfLines="dynamic"
          centerElement={<QuestionCenterElement question={question} />}
          rightElement={expanded ? 'expand-less' : 'expand-more'}
          onPress={this.toggleExpansion}
          onRightElementPress={this.toggleExpansion}
        />
        <ViewTransitionGroup>
          {expanded &&
            <ViewTransitionGroup.Animate>
              {this.renderExpanded()}
            </ViewTransitionGroup.Animate>}
        </ViewTransitionGroup>
        <Divider />
      </View>
    );
  }

  renderExpanded() {
    const { question } = this.props;

    switch (question.type) {
      case 'BOOLEAN_CHECKBOX':
        return renderCheckbox();
      case 'INFORMATIONAL':
        return renderInformationalAttribute(question);
      case 'DATETIME':
      case 'DATE':
        return null;
      case 'STRING':
      case 'TEXT':
        return renderTextAttribute(question, this.onChange);
      case 'NUMBER':
        return renderNumberAttribute(question, this.onChange);
      case 'SINGLEVALUELIST':
        return <SingleValueListAttributeField question={question} />;
      case 'MULTIVALUELIST':
        return renderMultiValueListAttribute(question, this.onMultivalueList);
      default:
        return null;
    }
  }
}
