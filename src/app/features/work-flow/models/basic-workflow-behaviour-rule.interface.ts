import { SupportedLanguage } from '../models/supported-language';
import { EmailTemplate } from './work-flow-request.interface';


export interface IBasicWorkFlowRules{
    id: string;
    enableSendRegistrationSms: boolean;
    sendRegistrationSmsTemplate: SendSmsTemplate[];
    enableTextToJoin: boolean;
    sendJoinQueueSmsTemplate: SendSmsTemplate[];
    enableAutoReplySMS: boolean;
    sendAutoReplySmsTemplate: SendSmsTemplate[];
    enableSendSmsAtYourTurn: boolean;
    sendSmsAtYourTurnTemplate: SendSmsTemplate[];
    enableSendSmsWhenCancelled: boolean;
    sendSmsWhenCancelledTemplate: SendSmsTemplate[];
    enableSendSmsUponTransfer: boolean;
    sendSmsUponTransferTemplate: SendSmsTemplate[];
    enableSendSmsWhenRequeued: boolean;
    sendSmsWhenRequeuedTemplate: SendSmsTemplate[];
    enableSendSmsForSurvey: boolean;
    sendSmsForSurveyTemplate: SendSmsTemplate[];

    enableSendRegistrationEmail: boolean;
    sendRegistrationEmailTemplate: EmailTemplate[];
    enableSendEmailAtYourTurn: boolean;
    sendEmailAtYourTurnTemplate: EmailTemplate[];
    enableSendEmailWhenCancelled: boolean;
    sendEmailWhenCancelledTemplate: EmailTemplate[];
    enableSendEmailUponTransfer: boolean;
    sendEmailUponTransferTemplate: EmailTemplate[];
    enableSendEmailWhenRequeued: boolean;
    sendEmailWhenRequeuedTemplate: EmailTemplate[];
    enableSendEmailForSurvey: boolean;
    sendEmailForSurveyTemplate: EmailTemplate[];

    smsAtPositionTemplate: ISmsAtPositionAndTemplate[];
    emailAtPositionTemplate: IEmailAtPositionAndTemplate[];
}

export interface ISmsAtPositionAndTemplate{
    enableSendSmsWhenCustomerIsAtLine: boolean;
    sendSmsWhenCustomerIsAtLineTemplate: SendSmsTemplate[];
    sendSmsWhenCustomerIsAtLine: number;
}

export interface IEmailAtPositionAndTemplate{
    sendEmailWhenCustomerIsAtLine: number;
    enableSendEmailWhenCustomerIsAtLine: boolean;
    sendEmailWhenCustomerIsAtLineTemplate: EmailTemplate[];
}


export interface SendSmsTemplate extends SupportedLanguage{
    smsTemplate: string;
}
