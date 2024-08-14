export enum variable_type{
    system= 'System',
    questionSet= 'Question',
    event= 'Event',
    trigger= 'Trigger'
}

export enum condition_type{
    matchAny= 'matchAny',
    matchAll= 'matchAll'
}

export interface QuestionSet {
    id: string;
    questionSetName: string;
}

export interface ConditionVariable{
    id: string;
    shortName: string;
    type: string;
    data_type: string;
}

export interface DynamicVariable extends ConditionVariable{
    fieldName: string;
}

export interface Operator{
    text: string;
    value: string;
}

export interface Condition{
    condition: ConditionVariable;
    operator: Operator;
    value: any;
}

export interface ConditionalEvent{
    id: string;
    eventName: string;
    questionSet: QuestionSet;
    conditionType: string;
    conditions: Condition[];
    isDeleted?:boolean;
}

export interface EventName{
    id: string;
    eventName: string;
}
