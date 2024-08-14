import { IDuration } from './duration.interface';

export interface ISiteSetting{
  appTimeout: IDuration;
  adminTimeout: IDuration;
  logoutUrl: string;
  loginMode: string;
}
