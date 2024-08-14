import { ILayoutTemplate } from './layout-template.interface';

export interface ITemplateRequest {
    id: string;
    title: string;
    layoutTemplate: ILayoutTemplate;
    device: {deviceId: string, deviceName: string};
    status: string;
}
