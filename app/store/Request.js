// @flow

import { observable, computed } from 'mobx';

import Question from './Question';

export default class Request {
  @observable localImageUris: Array<string> = [];
  @observable description: string = '';
  @observable serviceCode: ?string = null;

  @observable questions: Question[] = [];

  @computed
  get questionRequirementsMet(): boolean {
    return (
      this.questions.filter(q => !q.required || !q.visible || q.requirementsMet)
        .length === this.questions.length
    );
  }
}
