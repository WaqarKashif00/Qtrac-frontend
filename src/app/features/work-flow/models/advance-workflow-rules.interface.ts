import { SupportedLanguage } from './supported-language';
import { Group, Routing } from './work-flow-response.interface';

export interface DynamicVariable extends ConditionVariable {
    fieldName: string;
}

export interface IAppointmentRuleActions {
    text: string;
    type: string;
    for: string;
}

export interface ISMSAndEmailAndAnnouncementTemplate extends SupportedLanguage {
    template: string;
    subject: string;
}

export interface ActionAlertRuleActions {
    id: string;
    action: IAppointmentRuleActions;
    templates: ISMSAndEmailAndAnnouncementTemplate[];
    group: Group;
    alert: string;
    position: string;
    roleId: string;
    color: string;
    priority:number;
    reportingEventaname:string;
    routetoqueue:string;
    routing: Routing;
}

export interface ConditionVariable {
    id: string;
    shortName: string;
    type: string;
    data_type: string;
}

export interface QuestionSet {
    id: string;
    questionSetName: string;
}

export interface ICondition {
    type: string;  //null , and ,or.
    condition: ConditionVariable;  //question , dynamic variables, etc.
    operator: Operator; // less than , equal, match , any , contains etc,
    value: any; // number , string , object 
}

export interface IConditionArray{
    type: string;
    conditions: ICondition[]
}

export interface Operator {
    text: string;
    value: string;
}

export class AdvanceRules {
    id: string;
    name: string;
    type: string;
    when: ConditionVariable | QuestionSet;
    conditions: IConditionArray[];
    actions: ActionAlertRuleActions[];
    isDeleted: boolean;
}