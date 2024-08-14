import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { CompanyAPIService } from '../../../../shared/api-services/company-api.service';
import { MobileAPIService } from '../../../../shared/api-services/mobile-api.service';
import { WorkflowAPIService } from '../../../../shared/api-services/workflow-api.service';
import { IMobileLayoutData } from '../models/mobile-layout-data.interface';
import { IMobileSupportedLanguage } from '../models/mobile-supported-language.interface';
import { IMobileWorkFlowDetail } from '../models/mobile-work-flow-detail.interface';
import { IMobileWorkFlowDropDown } from '../models/mobile-workflow-dropdown.interface';

@Injectable()
export class AddMobileService extends AbstractComponentService {
  MobileInterfaceData: IMobileLayoutData;
  get CompanyId() {
    return this.authService.CompanyId;
  }

  private MobileInterfaceSubject: BehaviorSubject<IMobileLayoutData>;
  MobileInterface$: Observable<IMobileLayoutData>;
  private WorkFlowSubject: BehaviorSubject<IMobileWorkFlowDetail>;
  WorkFlow$: Observable<IMobileWorkFlowDetail>;
  private WorkFlowListSubject: BehaviorSubject<IMobileWorkFlowDropDown[]>;
  WorkFlowList$: Observable<IMobileWorkFlowDropDown[]>;
  private IsEditModeSubject: BehaviorSubject<boolean>;
  IsEditMode$: Observable<boolean>;
  private IsModalOpenedSubject: BehaviorSubject<boolean>;
  IsModalOpened$: Observable<boolean>;
  LanguageList$: Observable<IMobileSupportedLanguage[]>;
  private LanguageListSubject: BehaviorSubject<IMobileSupportedLanguage[]>;

  //   private PageDataSubject: BehaviorSubject<IMonitorLayoutData>;
  //   PageData$: Observable<IMonitorLayoutData>;
  SelectedWorkFlowValue: string;

  constructor(
    private readonly companyAPIService: CompanyAPIService,
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly mobileAPIService: MobileAPIService,
    ) {
    super();
    this.InitializeSubjects();
    this.SetAddOrEditMode();
   this.subs.sink= this.companyAPIService.GetLanguages(this.authService.CompanyId)
    .subscribe((x: IMobileSupportedLanguage[]) => {
      this.LanguageListSubject.next(x);
    });
  }

  private InitializeSubjects() {
    this.WorkFlowSubject = new BehaviorSubject<IMobileWorkFlowDetail>(null);
    this.WorkFlow$ = this.WorkFlowSubject.asObservable();
    this.MobileInterfaceSubject = new BehaviorSubject<IMobileLayoutData>(null);
    this.MobileInterface$ = this.MobileInterfaceSubject.asObservable();
    this.LanguageListSubject = new BehaviorSubject<IMobileSupportedLanguage[]>(
      []
    );
    this.LanguageList$ = this.LanguageListSubject.asObservable();

    // this.PageDataSubject = new BehaviorSubject<IMonitorLayoutData>(null);
    // this.PageData$ = this.PageDataSubject.asObservable();
    this.WorkFlowListSubject = new BehaviorSubject<IMobileWorkFlowDropDown[]>(
      []
    );
    this.WorkFlowList$ = this.WorkFlowListSubject.asObservable();
    this.IsEditModeSubject = new BehaviorSubject<boolean>(false);
    this.IsEditMode$ = this.IsEditModeSubject.asObservable();
    this.IsModalOpenedSubject = new BehaviorSubject<boolean>(true);
    this.IsModalOpened$ = this.IsModalOpenedSubject.asObservable();
  }

  SetAddOrEditMode() {
    if (this.browserStorageService.MobileInterfaceId) {
      this.OnEditMode();
    } else {
      this.OnAddMode();
    }
  }

  private OnAddMode() {
    this.SetAddMode();
    this.BindWorkFlowList();
  }

  private SetAddMode() {
    this.IsEditModeSubject.next(false);
  }

  private BindWorkFlowList() {
    this.subs.sink = this.workflowAPIService.GetDropdownList(this.CompanyId)
      .subscribe((list: IMobileWorkFlowDropDown[]) => {
        this.SetFirstWorkFlowIdAsDefaultSelectedWorkflowValue(list);
        this.WorkFlowListSubject.next(list);


        // remove
        // this.SendWorkFlowDataToMobileLayoutInterface()
      });
  }

  private OnEditMode() {
    this.SetEditMode();
    this.HideModal();

    this.GetAndSetWorkFlowDataToLayoutPageByMobileInterfaceId();
  }

  private SetEditMode() {
    this.IsEditModeSubject.next(true);
  }

  private GetAndSetWorkFlowDataToLayoutPageByMobileInterfaceId() {
    this.loadingService.showLoading();
    this.mobileAPIService.Get(this.authService.CompanyId,this.browserStorageService.MobileInterfaceId)
      .pipe(
        mergeMap((layout:IMobileLayoutData) => {
          this.MobileInterfaceData=layout
          return this.workflowAPIService.GetPublished(this.CompanyId,layout.designerScreen.WorkFlowId);
        })
      )
      .subscribe((workflow: IMobileWorkFlowDetail) => {
        this.WorkFlowSubject.next(workflow);
        this.MobileInterfaceSubject.next(this.MobileInterfaceData)
      });
  }

  private SetFirstWorkFlowIdAsDefaultSelectedWorkflowValue(
    list: IMobileWorkFlowDropDown[]
  ) {
    if (list.length > 0) {
      this.SelectedWorkFlowValue = list[0].workFlowId;
    }
  }

  public ChangeSelectedWorkFlowId(workflowId: string) {
    this.SelectedWorkFlowValue = workflowId;
  }

  public SendWorkFlowDataToMobileLayoutInterface() {
    this.subs.sink = this.workflowAPIService.GetPublished(this.CompanyId,this.SelectedWorkFlowValue)
      .subscribe((data: IMobileWorkFlowDetail) => {
        this.HideModal();
        this.WorkFlowSubject.next(data);
      });
  }

  public HideModal() {
    this.IsModalOpenedSubject.next(false);
  }

  public ShowModal() {
    this.IsModalOpenedSubject.next(true);
  }
}
