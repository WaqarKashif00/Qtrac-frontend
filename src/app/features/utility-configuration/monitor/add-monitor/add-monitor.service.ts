import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { MonitorAPIService } from '../../../../shared/api-services/monitor-api.service';
import { WorkflowAPIService } from '../../../../shared/api-services/workflow-api.service';
import { IMonitorLayoutData } from './monitor-layout/Models/monitor-layout-data';
import { IWorkFlowDetail } from './monitor-layout/Models/work-flow-detail.interface';
import { IWorkFlowDropDown } from './monitor-layout/Models/workflow-dropdown.interface';

@Injectable()
export class MonitorAddService extends AbstractComponentService {

  private WorkFlowSubject: BehaviorSubject<IWorkFlowDetail>;
  WorkFlow$: Observable<IWorkFlowDetail>;
  private WorkFlowListSubject: BehaviorSubject<IWorkFlowDropDown[]>;
  WorkFlowList$: Observable<IWorkFlowDropDown[]>;
  private IsEditModeSubject: BehaviorSubject<boolean>;
  IsEditMode$: Observable<boolean>;
  private IsModalOpenedSubject: BehaviorSubject<boolean>;
  IsModalOpened$: Observable<boolean>;
  private PageDataSubject: BehaviorSubject<IMonitorLayoutData>;
  PageData$: Observable<IMonitorLayoutData>;
  SelectedWorkFlowValue: string;
  MonitorData: IMonitorLayoutData;

  get CompanyId() {
    return this.authService.CompanyId;
  }

  constructor(
    private route: ActivatedRoute,
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly monitorAPIService: MonitorAPIService
    ) {
    super();
    this.InitializeSubjects();
    this.GetWorkFlowList();
    this.SetAddOrEditMode();
  }

  private InitializeSubjects() {
    this.WorkFlowSubject = new BehaviorSubject<IWorkFlowDetail>(null);
    this.WorkFlow$ = this.WorkFlowSubject.asObservable();
    this.PageDataSubject = new BehaviorSubject<IMonitorLayoutData>(null);
    this.PageData$ = this.PageDataSubject.asObservable();
    this.WorkFlowListSubject = new BehaviorSubject<IWorkFlowDropDown[]>([]);
    this.WorkFlowList$ = this.WorkFlowListSubject.asObservable();
    this.IsEditModeSubject = new BehaviorSubject<boolean>(false);
    this.IsEditMode$ = this.IsEditModeSubject.asObservable();
    this.IsModalOpenedSubject = new BehaviorSubject<boolean>(true);
    this.IsModalOpened$ = this.IsModalOpenedSubject.asObservable();
  }

  SetAddOrEditMode() {
    if (this.browserStorageService.MonitorTemplateId) {
      this.OnEditMode();
    } else {
      this.OnAddMode();
    }
  }

  private OnAddMode() {
    this.SetAddMode();
  }

  private SetAddMode() {
    this.IsEditModeSubject.next(false);
  }

  private GetWorkFlowList() {
    this.subs.sink = this.workflowAPIService.GetDropdownList(this.CompanyId)
      .subscribe((list: IWorkFlowDropDown[]) => {
        this.SetFirstWorkFlowIdAsDefaultSelectedWorkflowValue(list);
        this.WorkFlowListSubject.next(list);
      });
  }

  private OnEditMode() {
    this.SetEditMode();
    this.HideModal();

    this.GetAndSetWorkFlowDataToLayoutPageByMonitorId();
  }

  private SetEditMode() {
    this.IsEditModeSubject.next(true);
  }

  private GetAndSetWorkFlowDataToLayoutPageByMonitorId() {
    this.loadingService.showLoading();
    this.monitorAPIService.Get(this.authService.CompanyId,this.browserStorageService.MonitorTemplateId)
      .pipe(
        mergeMap((x: IMonitorLayoutData) => {
          x.designerScreen.cellSize = x.designerScreen.cellSize || 50;
          this.MonitorData = x;
          return this.workflowAPIService.GetPublished(this.CompanyId,x.designerScreen.workFlowId);
        })
      )
      .subscribe((x1: IWorkFlowDetail) => {
        this.WorkFlowSubject.next(x1);
        this.MonitorData.designerScreen.workFlowName = this.GetWorkflowNameById(this.MonitorData);
        this.PageDataSubject.next(this.MonitorData);
      });
  }

  private GetWorkflowNameById(x: IMonitorLayoutData): string {
    return this.WorkFlowListSubject.value.find(w => w.workFlowId === x.designerScreen.workFlowId)?.name;
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

  public SendWorkFlowToMonitorLayout() {
    this.subs.sink = this.workflowAPIService.GetPublished(this.CompanyId,this.SelectedWorkFlowValue)
      .subscribe((data: IWorkFlowDetail) => {
        this.WorkFlowSubject.next(data);
        this.HideModal();
      });
  }

  public HideModal() {
    this.IsModalOpenedSubject.next(false);
  }

  public ShowModal() {
    this.IsModalOpenedSubject.next(true);
  }

  RedirectToMonitorListPage() {
    this.routeHandlerService.RedirectToMonitorListPage();
  }

}
