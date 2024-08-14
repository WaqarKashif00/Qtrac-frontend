import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { BrowserStorageKey } from 'src/app/models/constants/browser-storage-key.constant';
import { MonitorAPIService } from '../../../shared/api-services/monitor-api.service';
import { WorkflowAPIService } from '../../../shared/api-services/workflow-api.service';
import { IMonitorLayoutData } from './add-monitor/monitor-layout/Models/monitor-layout-data';
import { IWorkFlowDropDown } from './add-monitor/monitor-layout/Models/workflow-dropdown.interface';

@Injectable()
export class MonitorService extends AbstractComponentService {

  private SubjectMonitors: BehaviorSubject<IMonitorLayoutData[]>;
  public Monitors$: Observable<IMonitorLayoutData[]>;
  private SubjectWorkFlows: BehaviorSubject<IWorkFlowDropDown[]>;
  WorkFlows$: Observable<IWorkFlowDropDown[]>;
  get CompanyId() {
    return this.authService.CompanyId;
  };

  constructor(
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly monitorAPIService: MonitorAPIService
    ) {
    super();
  }

  InitializeService(){
    this.SetObservables();
    this.GetWorkFlowList();
  }

  SetObservables() {
    this.SubjectMonitors = new BehaviorSubject<IMonitorLayoutData[]>([]);
    this.Monitors$ = this.SubjectMonitors.asObservable();
    this.SubjectWorkFlows = new BehaviorSubject<IWorkFlowDropDown[]>([]);
    this.WorkFlows$ = this.SubjectWorkFlows.asObservable();
  }

  InitializeMonitorList() {
    this.monitorAPIService.GetAll<IMonitorLayoutData>(this.CompanyId)
      .subscribe(response => {
        this.SubjectMonitors.next(response || []);
      });
  }

  RedirectToEditMonitor(templateId: string) {
    if (templateId) {
      this.browserStorageService.SetMonitorTemplateIdInSessionStorage(
        templateId
      );
    }
    this.routeHandlerService.RedirectToEditNewMonitorPage();
  }

  RedirectToAddNewMonitor() {
    this.browserStorageService.RemoveMonitorTemplateIdFromSessionStorage(
      BrowserStorageKey.MonitorTemplateId
    );
    this.routeHandlerService.RedirectToAddNewMonitorPage();
  }

  private GetWorkFlowList() {
    this.subs.sink = this.workflowAPIService.GetDropdownList(this.CompanyId)
      .subscribe((list: IWorkFlowDropDown[]) => {
        this.SubjectWorkFlows.next(list);
      });
  }

  DeleteMonitor(dataItem: IMonitorLayoutData){
    return this.monitorAPIService.Delete(dataItem.companyId, dataItem.designerScreen.templateId);
  }
}
