import { ILayoutTemplate } from './layout-template.interface';

export class IMonitorList {
    monitorId: string;
    title: string;
    layoutTemplate: ILayoutTemplate;
    device: {
        deviceId: string;
        deviceName: string;
    };
    status: string;
    createdAt: string;
    createdBy: string;
}
