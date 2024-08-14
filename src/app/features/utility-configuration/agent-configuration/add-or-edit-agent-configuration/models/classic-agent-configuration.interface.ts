import { IDropdownList } from 'src/app/models/common/dropdown-list.interface';

export interface IAgentClassicConfiguration{
  allowTakeOverCustomer: boolean;
  allowTransferBetweenServices: boolean;
  allowTransferBetweenBranches: boolean;
  allowTicketRepositioning: boolean;
  allowTicketDeletion: boolean;
  allowEditingCustomerInformation: boolean;
  allowCommentingOnTicket: boolean;
  allowServeMultiple: boolean;
  allowGrouping: boolean;
  allowToCreateGroup: boolean;
  allowDirectCall: boolean;
  allowCancelingService: boolean;
  allowSMSMessaging: boolean;
  allowBiDirectionalSMSMessaging: boolean;
  displayNoOfTicketsServed: boolean;
  classicTimeFormat: IDropdownList;
  timeInQueue: IDropdownList;
  displayKiosk: boolean;
  displayAppointments: boolean;
  displayTodaysTickets: boolean;
  displayCustomerURLTab: boolean;
  hideTicketNumber : boolean;
  displayAgentLogin : boolean;
  displayDeskLogin : boolean;
  useDirectServedEnabled:boolean;
  tabName: string;
  url: string;
  allowTicketFiltering: boolean;
  allowSelectedVisitorCalling: boolean;  
  enableEndOfDayButtonInQueue: boolean;

}
