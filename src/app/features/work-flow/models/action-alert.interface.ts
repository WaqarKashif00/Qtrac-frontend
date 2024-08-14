import { IAppointmentRuleActions } from 'src/app/models/constants/apponitment-rule.constants';
import { Condition, ConditionVariable } from './conditional-events';
import { SupportedLanguage } from './supported-language';
import { Group } from './work-flow-response.interface';

export interface ActionAlertRuleActions{
    id: string;
    action: IAppointmentRuleActions;
    templates: ISMSAndEmailTemplate[];
    group: Group;
    alert: string;
    position: string;
    color: string;
    reportingEventaname:string;
    priority:number;
    routetoqueue:string;

}

export interface ISMSAndEmailTemplate extends SupportedLanguage{
    template: string;
    subject: string;
}

export interface ActionAlertModel{
    id: string;
    description: string;
    conditionType: string;
    conditions: Condition[];
    actions: ActionAlertRuleActions[];
    isDeleted?:boolean
    when: ConditionVariable
}
