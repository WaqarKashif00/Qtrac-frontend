import { IAvailableSlot, IMiles } from './selection-item.interface';

export interface IFirstAvailable{
  selectedDateText: string;
  selectedDateValue: string;
  availableSpots: IAvailableSlot[];
}
