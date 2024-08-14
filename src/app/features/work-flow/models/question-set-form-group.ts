export interface IQuestionSetFormGroup {
  id: string;
  questionSetName: string;
  conditionRouting: IConditionRoutingFormGroup;
}

export interface IConditionRoutingFormGroup {
  id: string;
  name: string;
  isConditionalRouting: boolean;
  condition?: any;
  actions: Action[];
}

export interface Action {
  actionType: string;
  routingId: string;
  routingType: string;
  color: string;
  group: string;
}
