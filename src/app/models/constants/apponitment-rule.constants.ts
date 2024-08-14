import { ActionRule } from "./action-alert-constant";

export enum ActionType {
    SMS = 'SMS',
    Email = 'Email',
    Group = 'Group',
    Alert = 'Alert',
    Position = 'Position'
}

export enum ActionFor{
    Agent = 'Agent',
    Customer = 'Customer'
}

export interface IAppointmentRuleActions {
    text: string;
    type: string;
    for: string;
}

export const AppointmentRuleActions: IAppointmentRuleActions[] = [

    {
        text : ActionRule. NotifyCustomerviaSMS,
        for : ActionFor.Customer,
        type : ActionType.SMS
    },
    {
        text: ActionRule.NotifyCustomerviaEmail,
        for: ActionFor.Customer,
        type: ActionType.Email,
    },
    {
        text : ActionRule.AlertAgentviaSMS,
        for : ActionFor.Agent,
        type : ActionType.SMS
    },
    {
        text : ActionRule.AlertAgentviaEmail,
        for : ActionFor.Agent,
        type : ActionType.Email
    },
    {
        text : ActionRule.AlertAgentviaApplication,
        for : ActionFor.Agent,
        type : ActionType.Alert
    },
    {
        text : ActionRule.AddToGroup,
        for : ActionFor.Customer,
        type : ActionType.Group
    },
    {
        text : ActionRule.MovePosition,
        for : ActionFor.Customer,
        type : ActionType.Position
    }
];
