import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IBranchDropdownDetails } from 'src/app/models/common/branch-dropdown-interface';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { IServiceDropdown } from 'src/app/models/common/service.dropdown.interface';
import { IWorkFlowDetail } from 'src/app/models/common/work-flow-detail.interface';
import { SharableLinkType } from 'src/app/models/enums/appointment-scheduler.enum';
import { AppointmentSchedulerMessages } from 'src/app/features/appointment-scheduler/scheduler.messages';
import { AppointmentSchedulerAPIService } from 'src/app/shared/api-services/appointment-scheduler-api.service';
import { BranchAPIService } from 'src/app/shared/api-services/branch-api.service';
import { WorkflowAPIService } from 'src/app/shared/api-services/workflow-api.service';
import { NearestBRanchListWithHOO } from '../models/nearest-branches.interface';
import { ISchedulerData } from '../models/schedular-data.interface';
import { Language } from 'src/app/models/enums/language-enum';
import { CompanyAPIService } from 'src/app/shared/api-services/company-api.service';
import { ILanguagePage } from '../../utility-configuration/kiosk/kiosk-add/kiosk-layout/Models/language-page.interface';
import { ISupportedLanguage } from '../../utility-configuration/kiosk/kiosk-add/kiosk-layout/Models/supported-language.interface';
import { AppointmentSchedulerExecutionsService } from '../scheduler-execution/scheduler-execution.service';

@Injectable()
export class SchedulersService extends AbstractComponentService {

  private SubjectAppointmentSchedulers: BehaviorSubject<ISchedulerData[]>;
  public AppointmentSchedulers$: Observable<ISchedulerData[]>;
  private SubjectBranchDropdownList: BehaviorSubject<IBranchDropdownDetails[]>;
  public BranchDropdownList$: Observable<IBranchDropdownDetails[]>;
  private SubjectWorkflowServices: BehaviorSubject<IServiceDropdown[]>;
  public WorkflowServices$: Observable<IServiceDropdown[]>;
  private SubjectBranches: BehaviorSubject<NearestBRanchListWithHOO[]>;
  public Branches$: Observable<NearestBRanchListWithHOO[]>;
  private SubjectServices: BehaviorSubject<IServiceDropdown[]>;
  public Services$: Observable<IServiceDropdown[]>;
  private SubjectSharableLinkTypeList: BehaviorSubject<IDropdown[]>;
  public SharableLinkTypeList$: Observable<IDropdown[]>;
  private SubjectOpenShareLinkModel: BehaviorSubject<boolean>;
  public OpenShareLinkModel$: Observable<boolean>;


  constructor(
    private readonly appointmentSchedulerAPIService: AppointmentSchedulerAPIService,
    private readonly branchAPIService: BranchAPIService,
    private readonly workflowAPIService: WorkflowAPIService,
    private service: AppointmentSchedulerExecutionsService
  ) {
    super();
  }

  SetObservables() {
    this.SubjectAppointmentSchedulers = new BehaviorSubject<ISchedulerData[]>(
      []
    );
    this.AppointmentSchedulers$ =
      this.SubjectAppointmentSchedulers.asObservable();
    this.SubjectBranchDropdownList = new BehaviorSubject<
      IBranchDropdownDetails[]
    >([]);
    this.BranchDropdownList$ = this.SubjectBranchDropdownList.asObservable();
    this.SubjectWorkflowServices = new BehaviorSubject<IServiceDropdown[]>([]);
    this.WorkflowServices$ = this.SubjectWorkflowServices.asObservable();
    this.SubjectBranches = new BehaviorSubject<NearestBRanchListWithHOO[]>([]);
    this.Branches$ = this.SubjectBranches.asObservable();
    this.SubjectServices = new BehaviorSubject<IServiceDropdown[]>([]);
    this.Services$ = this.SubjectServices.asObservable();
    this.SubjectOpenShareLinkModel = new BehaviorSubject<boolean>(false);
    this.OpenShareLinkModel$ = this.SubjectOpenShareLinkModel.asObservable();
    this.SubjectSharableLinkTypeList = new BehaviorSubject<IDropdown[]>(
      this.GetShareLinkTypes()
    );
    this.SharableLinkTypeList$ =
      this.SubjectSharableLinkTypeList.asObservable();

      this.service.CallLanguageListAPI()

  }



  InitializeAppointmentSchedulerList() {
    this.subs.sink = this.appointmentSchedulerAPIService
      .GetAll<ISchedulerData>(this.authService.CompanyId)
      .subscribe((response) => {
        this.SubjectAppointmentSchedulers.next(response);
      });
  }

  ShowMessageCopied() {
    this.AppNotificationService.Notify(
      AppointmentSchedulerMessages.AppointmentSchedulerSharedLinkCopied
    );
  }

  OpenShareLinkModel(workflowId) {
    this.formService
      .CombineAPICall(
        this.GetBranches(workflowId),
        this.GetServiceList(workflowId)
      )
      .subscribe(([branches, data]) => {
        this.SubjectBranchDropdownList.next(this.GetMappedBranches(branches));
        this.SubjectBranches.next(branches);
        this.SubjectWorkflowServices.next(this.GetMappedServices(data));
        this.SubjectServices.next(this.SubjectWorkflowServices.value);
        this.SubjectOpenShareLinkModel.next(true);
      });
  }
  GetMappedBranches(
    branches: NearestBRanchListWithHOO[]
  ): IBranchDropdownDetails[] {
    const list: IBranchDropdownDetails[] = [];
    branches.forEach((x) => {
      list.push({
        branchId: x.branchId,
        branchName: x.branchName,
      });
    });
    return list;
  }

  SetWorkFlowServices() {
    this.SubjectServices.next(this.SubjectWorkflowServices.value);
  }

  SetBranchServices(BranchId: string) {
    const BranchServicesIds = this.SubjectBranches.value.find((Branch) => Branch.branchId === BranchId).branchServices
    const BranchServices = [];
    if (BranchServicesIds.length > 0) {
      BranchServicesIds.forEach((ServiceId) => {
        BranchServices.push(this.SubjectWorkflowServices.value.find((service) => service.id === ServiceId));
      });
      this.SubjectServices.next(BranchServices);
    } else {
      this.SetWorkFlowServices()
    }
  }

  private GetBranches(workflowId): any {
    return this.appointmentSchedulerAPIService.GetExternalNearestBranchList<NearestBRanchListWithHOO>(
      this.authService.CompanyId,
      workflowId,
      null,
      null,
      null,
      null
    );
  }
  private GetServiceList(workflowId: any) {
    return this.workflowAPIService.GetPublished(
      this.authService.CompanyId,
      workflowId
    );
  }

  private GetMappedServices(data: IWorkFlowDetail): IServiceDropdown[] {
    const services: IServiceDropdown[] = [];
    data.services.forEach((service) => {
      if (service.acceptAppointments && !service.isDeleted) {
        services.push({
          id: service.id,
          serviceName: service.serviceNames.find((x) => x.isDefault)
            .serviceName,
        });
      }
    });
    return services;
  }

  CloseShareLinkModel() {
    this.SubjectOpenShareLinkModel.next(false);
  }

  RedirectToEditAppointmentScheduler(id: string) {
    if (id) {
      this.browserStorageService.SetSchedulerId(id);
    }
    this.routeHandlerService.RedirectToEditNewAppointmentSchedulerPage();
  }

  RedirectToAddNewAppointmentSchedulerPage() {
    this.browserStorageService.RemoveSchedulerId();
    this.routeHandlerService.RedirectToAddNewAppointmentSchedulerPage();
  }

  DeleteSchedulerTemplate(scheduler: ISchedulerData) {
    return this.appointmentSchedulerAPIService.DeleteAppointmentSchedulerTemplate(scheduler)
  }

  ShowSharableLink(companyId: string, SchedulerId: string) {
    return this.appointmentSchedulerAPIService.GetExternalPublishedData<ISchedulerData>(
      companyId,
      SchedulerId,
      true
    );
  }

  private GetShareLinkTypes() {
    return [
      {
        value: SharableLinkType.All,
        text: 'All Locations And Services',
      },
      {
        value: SharableLinkType.AService,
        text: 'A Service',
      },
      {
        value: SharableLinkType.ABranch,
        text: 'A Location',
      },
      {
        value: SharableLinkType.BranchAndService,
        text: 'Location And Service',
      },
    ];
  }

  ConvertTranslatedLanguageArrayToObject(arr) {
    const obj = {};
    for (const element of arr) {
      obj[element.languageId] = element.translatedText;
    }
    return obj;
  }
}
