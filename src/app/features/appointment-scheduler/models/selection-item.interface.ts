import { ITime } from '../../scheduler/hours-of-operations/hours-of-operation.interface';

export interface IMiles {
  text: string;
  value: number;
  isSelected: boolean;
}
export interface IAvailableSlot {
  text: string;
  value: ITime;
  isSelected: boolean;
}
