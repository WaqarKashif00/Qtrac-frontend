import { Control } from './controls/control';
import { ServiceBoxControl } from './controls/service-box.control';

export interface ServiceDDL {
  Id: string;
  Control: ServiceBoxControl;
  ShowPropertyWindow: boolean;
  Name: any;
}
