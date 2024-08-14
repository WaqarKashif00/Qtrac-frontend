import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { MonitorAPIService } from 'src/app/shared/api-services/monitor-api.service';


@Injectable()
export class CloneMonitorService extends AbstractComponentService {
  constructor(
    private readonly monitorAPIService: MonitorAPIService,
  ){
    super();
  }

  getToken(deviceId: string){
    return this.monitorAPIService.GetToken(deviceId)
  }
  setToken(token:string){
    this.browserStorageService.SetKioskExecutionToken(JSON.parse(token));
    this.routeHandlerService.RedirectToMonitorExecutionPage();
  }

}
