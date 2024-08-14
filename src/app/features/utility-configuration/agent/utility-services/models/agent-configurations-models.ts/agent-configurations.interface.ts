export interface IAgentConfiguration {
    id: string;
    companyId: string;
    name: string;
    workflowId: string;
    mobileTemplateId: string;
    viewTypeId: string ;
    schedulerTemplateId: string ;
    allowTakeOverCustomer: boolean;
    allowTransferBetweenServices: boolean;
    allowTransferBetweenBranches: boolean;
    allowTicketRepositioning: boolean;
    allowTicketDeletion: boolean;
    allowEditingCustomerInformation: boolean;
    allowCommentingOnTicket: boolean;
    allowServeMultiple: boolean;
    grouping: {allow: boolean ,allowToCreateGroup: boolean};
    allowDirectCall: boolean;
    allowCancelingService: boolean;
    sMSMessaging: {allow: boolean, allowBiDirectional: boolean};
    displayNoOfTicketServed: boolean;
    hideTicketNumber: boolean,
    displayKiosk: boolean;
    allowMultipleCalls: boolean;
    displayAppointments: boolean;
    displayTodaysTickets: boolean;
    displayCustomerURLTab: boolean;
    timeFormatId: string;
    timeDisplayInQueueId: string;
    useDirectServedEnabled:boolean;
    tabName: string;
    url: string;
    allowTicketFiltering: boolean;
    allowSelectedVisitorCalling: boolean;
    enableEndOfDayButtonInQueue: boolean;
}
