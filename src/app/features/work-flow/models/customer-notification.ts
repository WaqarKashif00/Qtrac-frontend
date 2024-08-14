import { Condition } from './conditional-events';
import { SupportedLanguage } from './supported-language';

export interface CustomerNotification{
    id: string;
    description: string;
    sendVia: string;
    templates: ISMSAndEmailTemplate[];
    conditionType: string;
    conditions: Condition[];
    isDeleted?: boolean;
}

export interface ISMSAndEmailTemplate extends SupportedLanguage{
    template: string;
    subject: string;
}
