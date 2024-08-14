import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { BrowserStorageKey } from 'src/app/models/constants/browser-storage-key.constant';
import { KioskAPIService } from '../../../shared/api-services/kiosk-api.service';
import { WorkflowAPIService } from '../../../shared/api-services/workflow-api.service';
import { IKioskLayoutData } from './kiosk-add/kiosk-layout/Models/kiosk-layout-data.interface';
import { IWorkFlowDropDown } from './kiosk-add/kiosk-layout/Models/workflow-dropdown.interface';

@Injectable()
export class KioskService extends AbstractComponentService {
  private SubjectKiosks: BehaviorSubject<IKioskLayoutData[]>;
  public Kiosks$: Observable<IKioskLayoutData[]>;
  private SubjectWorkFlows: BehaviorSubject<IWorkFlowDropDown[]>;
  WorkFlows$: Observable<IWorkFlowDropDown[]>;
  get CompanyId() {
    return this.authService.CompanyId;
  };

  constructor(
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly kioskAPIService: KioskAPIService,
    ) {
    super();
  }

  InitializeService(){
    this.SetObservables();
    this.GetWorkFlowList();
  }

  SetObservables() {
    this.SubjectKiosks = new BehaviorSubject<IKioskLayoutData[]>([]);
    this.Kiosks$ = this.SubjectKiosks.asObservable();
    this.SubjectWorkFlows = new BehaviorSubject<IWorkFlowDropDown[]>([]);
    this.WorkFlows$ = this.SubjectWorkFlows.asObservable();
  }

  InitializeKioskList() {
    this.kioskAPIService.GetAll<IKioskLayoutData>(this.CompanyId)
      .subscribe((response) => {
        this.SubjectKiosks.next(response);
      });
  }

  RedirectToEditKiosk(templateId: string) {
    if (templateId) {
      this.browserStorageService.SetKioskTemplateIdInSessionStorage(templateId);
    }
    this.routeHandlerService.RedirectToEditNewKioskPage();
  }

  RedirectToAddNewKiosk() {
    this.browserStorageService.RemoveKeyValueFromSessionStorage(
      BrowserStorageKey.KioskTemplateId
    );
    this.routeHandlerService.RedirectToAddNewKioskPage();
  }

  RedirectToKioskExecution() {
    this.routeHandlerService.RedirectToKioskExecutionPage();
  }

  DeleteKiosk(dataItem: IKioskLayoutData){
    return this.kioskAPIService.Delete(dataItem.companyId, dataItem.designerScreen.templateId);
  }

   GetWorkFlowList() {
    this.subs.sink = this.workflowAPIService.GetDropdownList(this.CompanyId)
      .subscribe((list: IWorkFlowDropDown[]) => {
        this.SubjectWorkFlows.next(list);
      });
  }
}
