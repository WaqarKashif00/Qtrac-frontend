import { IAppointmentRuleActions } from 'src/app/models/constants/apponitment-rule.constants';
import { Condition } from './conditional-events';
import { SupportedLanguage } from './supported-language';
import { Group } from './work-flow-response.interface';

export interface AppointmentRule{
    id: string;
    description: string;
    action: IAppointmentRuleActions;
    templates: ISMSAndEmailTemplate[];
    group: Group;
    alert: string;
    position: string;
    conditionType: string;
    conditions: Condition[];
    isDeleted?:boolean;
}

export interface ISMSAndEmailTemplate extends SupportedLanguage{
    template: string;
    subject: string;
}

export interface IMobileDropdown{
    id:string,
    name:string
}