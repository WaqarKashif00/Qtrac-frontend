import { ITime } from '../../scheduler/hours-of-operations/hours-of-operation.interface';
import { IDuration } from './duration.interface';

export interface ISiteSetting{
  appTimeout: IDuration;
  adminTimeout: IDuration;
  logoutUrl: string;
  loginMode: string;
  endOfDayTimeFormControl?:Date;
  endOfDayTime?:ITime | null;
}
