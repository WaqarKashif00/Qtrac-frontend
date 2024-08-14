import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { KioskAPIService } from '../../../../shared/api-services/kiosk-api.service';
import { WorkflowAPIService } from '../../../../shared/api-services/workflow-api.service';
import {
  IKioskLayoutData,
  IWorkFlowDetail
} from './kiosk-layout/Models/kiosk-layout-data.interface';
import { IWorkFlowDropDown } from './kiosk-layout/Models/workflow-dropdown.interface';

@Injectable()
export class KioskAddService extends AbstractComponentService {
  SelectedWorkFlowValue: string;

  get CompanyId() {
    return this.authService.CompanyId;
  }

  private WorkFlowSubject: BehaviorSubject<any>;
  WorkFlow$: Observable<any>;
  private WorkFlowListSubject: BehaviorSubject<IWorkFlowDropDown[]>;
  WorkFlowList$: Observable<IWorkFlowDropDown[]>;
  private IsEditModeSubject: BehaviorSubject<boolean>;
  IsEditMode$: Observable<boolean>;
  private IsOpenSubject: BehaviorSubject<boolean>;
  Opened$: Observable<boolean>;

  constructor(
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly kioskAPIService: KioskAPIService,
    ) {
    super();
    this.InitializeObservables();
    this.GetWorkFlowList();
    this.SetAddAndEditMode();
  }

  private InitializeObservables() {
    this.WorkFlowSubject = new BehaviorSubject<any>(null);
    this.WorkFlow$ = this.WorkFlowSubject.asObservable();
    this.WorkFlowListSubject = new BehaviorSubject<IWorkFlowDropDown[]>([]);
    this.WorkFlowList$ = this.WorkFlowListSubject.asObservable();
    this.IsEditModeSubject = new BehaviorSubject<boolean>(false);
    this.IsEditMode$ = this.IsEditModeSubject.asObservable();
    this.IsOpenSubject = new BehaviorSubject<boolean>(true);
    this.Opened$ = this.IsOpenSubject.asObservable();
  }

  SetAddAndEditMode() {
    if (this.browserStorageService.KioskTemplateId) {
      this.SetEditMode();
    } else {
      this.SetAddMode();
    }
  }

  SetAddMode() {
    this.IsEditModeSubject.next(false);
  }

  private SetEditMode() {
    this.IsEditModeSubject.next(true);
    this.GetAndSetWorkFlowDataToLayoutPageByKioskId();
  }

  private GetAndSetWorkFlowDataToLayoutPageByKioskId() {
    this.loadingService.showLoading();
    this.kioskAPIService.Get(this.authService.CompanyId,this.browserStorageService.KioskTemplateId)
      .pipe(
        mergeMap((x: IKioskLayoutData) => {
          return this.workflowAPIService.GetPublished(this.CompanyId,x.designerScreen.WorkFlowId);
        })
      )
      .subscribe((x1: IWorkFlowDetail) => {
        this.WorkFlowSubject.next(x1);
        this.CloseModel();
      });
  }

  private GetWorkFlowList() {
    this.subs.sink = this.workflowAPIService.GetDropdownList(this.CompanyId)
      .subscribe((list: IWorkFlowDropDown[]) => {
        this.SetFirstWorkFlowIdAsDefaultSelectedWorkflowValue(list);
        this.WorkFlowListSubject.next(list);
      });
  }

  private SetFirstWorkFlowIdAsDefaultSelectedWorkflowValue(
    list: IWorkFlowDropDown[]
  ) {
    if (list.length > 0) {
      this.SelectedWorkFlowValue = list[0].workFlowId;
    }
  }

  public ChangeSelectedWorkFlowId(workflowId: string) {
    this.SelectedWorkFlowValue = workflowId;
  }

  SendWorkFlowToKioskLayoutComponent() {
    this.subs.sink = this.workflowAPIService.GetPublished(this.CompanyId,this.SelectedWorkFlowValue)
      .subscribe((data: IWorkFlowDetail) => {
        this.CloseModel();
        this.WorkFlowSubject.next(data);
      });
  }

  CloseModel() {
    this.IsOpenSubject.next(false);
  }

  OpenModel() {
    this.IsOpenSubject.next(true);
  }

  RedirectToKioskList() {
    this.routeHandlerService.RedirectToKioskListPage();
  }
}
