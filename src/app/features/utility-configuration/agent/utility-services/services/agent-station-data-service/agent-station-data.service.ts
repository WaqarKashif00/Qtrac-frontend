import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { BrowserStorageService } from 'src/app/core/services/browser-storage.service';
import {
  BranchDetails,
  IBranchDropdownWithTag,
  IStationDetails
} from 'src/app/features/utility-configuration/agent/models/agent-models';
import { BrowserStorageKey } from 'src/app/models/constants/browser-storage-key.constant';
import { AgentAPIService } from 'src/app/shared/api-services/agent-api.service';
import { BranchAPIService } from 'src/app/shared/api-services/branch-api.service';
import { WorkflowAPIService } from 'src/app/shared/api-services/workflow-api.service';
import { ITab } from '../../../models/utilities-models/agent-tab.model';
import { IAgentConfiguration } from '../../models/agent-configurations-models.ts/agent-configurations.interface';
import { IWorkFlow } from '../../models/workflow-models/workflow-interface';

@Injectable()
export class AgentStationDataService extends AbstractComponentService {

  get BranchId(): string {
    if (!this.cachedStationDetails) {
      this.cachedStationDetails = this.storageService.GetLocalStorageItem(
        BrowserStorageKey.AgentStationDetails
      );
    }
    return this.cachedStationDetails?.Branch?.branchId;
  }
  
  get BranchDefaultLanguageId(): string {
    if (!this.cachedStationDetails) {
      this.cachedStationDetails = this.storageService.GetLocalStorageItem(
        BrowserStorageKey.AgentStationDetails
      );
    }
    return this.cachedStationDetails?.BranchDetails?.supportedLanguages?.find(
      (x) => x.isDefault
    )?.languageCode;
  }
  
  get DeskId(): string {
    if (!this.cachedStationDetails) {
      this.cachedStationDetails = this.storageService.GetLocalStorageItem(
        BrowserStorageKey.AgentStationDetails
      );
    }
    return this.cachedStationDetails?.Desk?.value;
  }
  
  get TemplateId(): string {
    if (!this.cachedStationDetails) {
      this.cachedStationDetails = this.storageService.GetLocalStorageItem(
        BrowserStorageKey.AgentStationDetails
      );
    }
    return this.cachedStationDetails?.Template?.id;
  }
  
  get TemplateTypeId(): string {
    if (!this.cachedStationDetails) {
      this.cachedStationDetails = this.storageService.GetLocalStorageItem(
        BrowserStorageKey.AgentStationDetails
      );
    }
    return this.cachedStationDetails?.Template?.viewTypeId;
  }
  
  get WorkflowId(): string {
    if (!this.cachedStationDetails) {
      this.cachedStationDetails = this.storageService.GetLocalStorageItem(
        BrowserStorageKey.AgentStationDetails
      );
    }
    return this.cachedStationDetails?.Template?.workflowId;
  }
  get Workflow(): IWorkFlow {
    if (!this.cachedStationDetails) {
      this.cachedStationDetails = this.storageService.GetLocalStorageItem(
        BrowserStorageKey.AgentStationDetails
      );
    }
    return this.cachedStationDetails?.Workflow;
  }
  get AgentConfigurations(): IAgentConfiguration {
    if (!this.cachedStationDetails) {
      this.cachedStationDetails = this.storageService.GetLocalStorageItem(
        BrowserStorageKey.AgentStationDetails
      );
    }
    return this.cachedStationDetails?.AgentConfiguration;
  }
  
  get BranchDetails(): BranchDetails {
    if (!this.cachedStationDetails) {
      this.cachedStationDetails = this.storageService.GetLocalStorageItem(
        BrowserStorageKey.AgentStationDetails
      );
    }
    return this.cachedStationDetails?.BranchDetails;
  }
  get AgentId(): string {
    return this.authService.UserId;
  }

  get IsAgentAvailable(): boolean {
    const IsAgentAvailable: boolean = this.storageService.GetLocalStorageItem(
      BrowserStorageKey.IsAgentAvailable
    );
    return IsAgentAvailable;
  }

  get AgentActiveTab(): ITab {
    const AgentActiveTab: ITab = this.storageService.GetLocalStorageItem(
      BrowserStorageKey.AgentActiveTab
    );
    return AgentActiveTab;
  }

  set IsAgentAvailable(value: boolean) {
    this.storageService.SetLocalStorageItem(
      BrowserStorageKey.IsAgentAvailable,
      value
    );
  }

  set AgentActiveTab(value: ITab) {
    this.storageService.SetLocalStorageItem(
      BrowserStorageKey.AgentActiveTab,
      value
    );
  }

  public get Value(): IStationDetails {
    return this.SubjectStationDetails.getValue();
  }

  private SubjectStationDetails: BehaviorSubject<IStationDetails>;
  public StationDetails$: Observable<IStationDetails>;

  private SubjectStationDetailsState: Subject<any>;
  public StationDetailsState$: Observable<any>;

  private isDetailsFetched: boolean = false;
  public cachedStationDetails: IStationDetails;

  /**
   *
   */
  constructor(
    private storageService: BrowserStorageService,
    private workflowApiService: WorkflowAPIService,
    private branchApiService: BranchAPIService,
    private agentApiService: AgentAPIService
  ) {
    super();
    this.SetObservables();
  }
  private SetObservables() {
    this.SubjectStationDetailsState = new Subject<any>();
    const nullValue = null;
    this.StationDetailsState$ = this.SubjectStationDetailsState.pipe(startWith(nullValue),pairwise());
    const stationDetails: IStationDetails =
      this.storageService.GetLocalStorageItem(
        BrowserStorageKey.AgentStationDetails
      );
    this.SubjectStationDetails = new BehaviorSubject<IStationDetails>(
      stationDetails
    );
    this.StationDetails$ = this.SubjectStationDetails.asObservable();
    this.Update(stationDetails);
  }

  Update(stationDetails: IStationDetails) {
    const companyId = this.authService.CompanyId;
    const branchId = stationDetails?.Branch?.branchId;
    const workflowId = stationDetails?.Template?.workflowId;
    const agentTemplateId = stationDetails?.Template?.id;

    if (!(companyId && branchId && workflowId && agentTemplateId)) {
      return Promise.resolve();
    }

    this.formService
      .CombineAPICall(
        this.workflowApiService.GetPublished<IWorkFlow>(companyId, workflowId),
        this.agentApiService.Get<IAgentConfiguration>(
          companyId,
          agentTemplateId
        ),
        this.branchApiService.Get<BranchDetails>(companyId, branchId),
        this.branchApiService.GetBranchNamesWithTags<IBranchDropdownWithTag>(
          companyId,
          true
        )
      )
      .subscribe((response) => {
        stationDetails.Workflow = response[0];
        UpdateDeletedPreServiceQuestions(stationDetails.Workflow);
        stationDetails.AgentConfiguration = response[1];
        stationDetails.BranchDetails = response[2];
        stationDetails.BranchesWithWorkflows = response[3];

        this.storageService.SetLocalStorageItem(
          BrowserStorageKey.AgentStationDetails,
          stationDetails
        );
        this.isDetailsFetched = true;
        this.UpdateStationDetailsSubject(stationDetails);
      });
  }

  private UpdateStationDetailsSubject(stationDetails: IStationDetails) {
    this.SubjectStationDetails.next(stationDetails);
    this.SubjectStationDetailsState.next(stationDetails);
    this.cachedStationDetails=stationDetails;    
  }

  Get(): Observable<IStationDetails> {
    return this.StationDetails$;
  }

  GetState(): Observable<any> {
    return this.StationDetailsState$;
  }

  IsDetailsFetched(): boolean {
    return this.isDetailsFetched ? true : false;
  }

  IsStationDetailsAvailable(): boolean {
    const stationDetails: IStationDetails =
      this.SubjectStationDetails.getValue();
    if (
      stationDetails &&
      stationDetails.Branch?.branchId &&
      (stationDetails.LoginAs == 'agent' || stationDetails.Desk?.value) &&
      stationDetails.Template?.id
    ) {
      return true;
    } else {
      return false;
    }
  }
  CheckUpdateStaticDetails():void{
     if(this.IsStationDetailsAvailable()){
       let staticDetails:IStationDetails=this.SubjectStationDetails.getValue();
      this.Update(staticDetails);
     }
  }
}

function UpdateDeletedPreServiceQuestions(Workflow: IWorkFlow) {
  if (
    Workflow?.preServiceQuestions &&
    Workflow.preServiceQuestions.length > 0
  ) {
    Workflow.preServiceQuestions = Workflow.preServiceQuestions.filter(
      (x) => !x?.isDeleted
    );
  }

}