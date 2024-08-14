import { IDropdownList } from 'src/app/models/common/dropdown-list.interface';

export interface IAgentLiteConfiguration{
  allowMultipleCalls: boolean;
  displayKiosk: boolean;
  displayTodaysTickets: boolean;
  timeFormat: IDropdownList;
}
