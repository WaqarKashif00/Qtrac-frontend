import { DeviceStatus } from '../enums/device-status.enum';

export interface KioskShutDownResponse {
  isShutDown: boolean;
  message: string;
  shutDownUpto: Date;
  status: DeviceStatus;
}
