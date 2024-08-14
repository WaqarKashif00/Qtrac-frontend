import { ILayoutTemplate } from './layout-template.interface';

export class IKioskList {
  id: string;
  status: number;
  title: string;
  branchId?: string;
  isDeleted?: boolean;
  layoutTemplate: ILayoutTemplate;
  device?: {
    deviceId: string;
    deviceName: string;
    browserId: string;
  };
  mobileInterfaceId: string;
  assignedPrinterId: string;
}
