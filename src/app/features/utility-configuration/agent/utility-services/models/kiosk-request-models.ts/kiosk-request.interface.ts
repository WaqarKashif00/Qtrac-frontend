export interface IKioskRequest {
    id: string;
    companyId: string;
    name: string;
    workflowId: string;
    viewTypeId: string ;
    allowTransferBetweenServices: boolean;
    allowTransferBetweenBranches: boolean;
    allowTicketRepositioning: boolean;
    allowTicketDeletion: boolean;
    allowEditingCustomerInformation: boolean;
    allowCommentingOnTicket: boolean;
    allowServeMultiple: boolean;
    allowGrouping: boolean;
    allowDirectCall: boolean;
    allowCancelingService: boolean;
    sMSMessaging: {allow: boolean, allowBiDirectional: boolean};
    displayNoOfTicketServed: boolean;
    displayKiosk: boolean;
    allowMultipleCalls: boolean;
    displayAppointments: boolean;
    displayTodaysTickets: boolean;
    displayCustomerURLTab: boolean;
    timeFormatId: string;
    timeDisplayInQueueId: string;
    tabName: string;
    url: string;
}
