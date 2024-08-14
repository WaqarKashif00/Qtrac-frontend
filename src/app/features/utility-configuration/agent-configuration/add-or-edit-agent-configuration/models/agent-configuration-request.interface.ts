export interface IAgentRequest{
  id: string;
  companyId: string;
  name: string;
  workflowId: string;
  viewTypeId: string ;
  mobileTemplateId:string;
  schedulerTemplateId:string;
  allowTakeOverCustomer:boolean;
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
  displayKiosk: boolean;
  allowMultipleCalls: boolean;
  displayAppointments: boolean;
  displayTodaysTickets: boolean;
  displayCustomerURLTab: boolean;
  timeFormatId: string;
  timeDisplayInQueueId: string;
  hideTicketNumber:boolean
  useDirectServedEnabled:boolean;
  displayAgentLogin:boolean;
  displayDeskLogin:boolean;
  allowTicketFiltering: boolean;
  allowSelectedVisitorCalling: boolean;
  enableEndOfDayButtonInQueue: boolean;
  tabName: string;
  url: string;
}
