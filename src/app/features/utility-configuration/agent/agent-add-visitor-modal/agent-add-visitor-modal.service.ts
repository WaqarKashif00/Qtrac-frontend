import { Injectable } from '@angular/core';
import { ZonedDate } from '@progress/kendo-date-math';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { cloneObject, parseInteger } from 'src/app/core/utilities/core-utilities';
import { CheckServiceAvailability, ServiceAvailableOrNotDefault } from 'src/app/core/utilities/workflow-service-available';
import { IWorkFlowUsedInBranchList } from 'src/app/features/branch-list/models/workflow-used-in-branch-list.interface';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { OperationalOccurs } from 'src/app/models/enums/week-days.enum';
import {
  RulesDocument,
  RulesDocumentReference
} from 'src/app/shared/api-models/dynamic-processor/conditional-route-request';
import { ConditionalRoutingResponseTypes } from 'src/app/shared/api-models/dynamic-processor/conditional-routing-response-type';
import { EstimateWaitTime } from 'src/app/shared/api-models/mobile-execution/estimate-wate-time';
import { DynamicRuleProcessorAPIService } from 'src/app/shared/api-services/dynamic-rule-processor-api.service';
import { HoursOfOperationAPIService } from 'src/app/shared/api-services/hoo-api.service';
import { isDateLiesBetweenTwoDates } from 'src/app/shared/utility-functions/utility-functions.module';
import { KioskAPIService } from '../../../../shared/api-services/kiosk-api.service';
import { IBranchDetails } from '../../kiosk/kiosk-add/kiosk-layout/Models/kiosk-branch-details.interface';
import { IHoursOfOperation, IWorkingDay, IWorkingHours } from '../../kiosk/kiosk-add/kiosk-layout/Models/kiosk-hours-of-operations.interface';
import { IKioskPanelItemsData } from '../../kiosk/kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';
import { ISupportedLanguage } from '../../kiosk/kiosk-add/kiosk-layout/Models/supported-language.interface';
import { AgentMessages } from '../agent.messages';
import { ClassicAgentService } from '../classic-agent-template/classic-agent.service';
import {
  IAgentCustomersListItem,
  KioskExecutionPreServiceQuestionPage,
  KioskRequest,
  KioskTemplateModel,
  Question,
  VisitorRequest
} from '../models/agent-models';
import {
  IGlobalQuestion,
  IService,
  IServiceRoute,
  IWorkFlow
} from '../utility-services/models/workflow-models/workflow-interface';
import { QueueSignalRService } from '../utility-services/services/agent-signalR/queue-signalr.service';
import { AgentStationDataService } from '../utility-services/services/agent-station-data-service/agent-station-data.service';

@Injectable()
export class AgentAddVisitorModalService extends AbstractComponentService {
  Workflow: IWorkFlow;
  WorkFlowUsedInBranchList: IWorkFlowUsedInBranchList[];
  Customer: IAgentCustomersListItem;
  showEstimateWaitTime = false;
  EstimateWaitTime: String;
  DisplayTicketNumber: string;
  IsTransferMode: boolean;
  IsEditMode: boolean;
  HoursOfOperation: IHoursOfOperation;

  KendoTimeZoneData = ZonedDate;
  private PreServiceQuestionsSubject: BehaviorSubject<IKioskPanelItemsData[]>;
  PreServiceQuestions$: Observable<IKioskPanelItemsData[]>;

  private ServiceQuestionsSubject: BehaviorSubject<IKioskPanelItemsData[]>;
  ServiceQuestions$: Observable<IKioskPanelItemsData[]>;

  private SubjectHoursOfOperationList: BehaviorSubject<any[]>;
  HoursOfOperationList$: Observable<any[]>;

  private PreviouslyAskedQuestionsSubject: BehaviorSubject<
    IKioskPanelItemsData[]
  >;
  PreviouslyAskedQuestions$: Observable<IKioskPanelItemsData[]>;

  private ServicesSubject: BehaviorSubject<IDropdown[]>;
  Services$: Observable<IDropdown[]>;

  Groups$: Observable<IDropdown[]>;

  private NextButtonTextSubject: BehaviorSubject<string>;
  NextButtonText$: Observable<string>;


  private BranchCountryCodeSubject: BehaviorSubject<string>;
  BranchCountryCode$: Observable<string>;
  private VisitorAddedSubject: Subject<boolean>;
  VisitorAdded$: Observable<boolean>;

  private ShowEstimateWaitTimeSubject: Subject<boolean>;
  ShowEstimateWaitTime$: Observable<boolean>;

  private EstimateWaitTimeSubject: BehaviorSubject<String>;
  EstimateWaitTime$: Observable<String>;

  private DisplayTicketNumberSubject: BehaviorSubject<String>;
  DisplayTicketNumber$: Observable<String>;

  private NextRouteSubject: BehaviorSubject<IServiceRoute>;
  NextRoute$: Observable<IServiceRoute>;

  private DefaultLanguageSubject: BehaviorSubject<ISupportedLanguage>;
  DefaultLanguage$: Observable<ISupportedLanguage>;

  private LanguageSubject: BehaviorSubject<ISupportedLanguage[]>;
  LanguageList$: Observable<ISupportedLanguage[]>;

  private SubjectBranch: BehaviorSubject<IBranchDetails>;
  branch$: Observable<IBranchDetails>;

  private SubjectHoursOfOperation: BehaviorSubject<IHoursOfOperation>;
  HoursOfOperation$: Observable<IHoursOfOperation>;

  private PreviouslyAskedQuestionSets: string[] = [];
  ServiceId: string;

  get languageId(): string {
    return this.stationDetailsService.BranchDefaultLanguageId;
  }

  AllAnsweredQuestions: Question[] = [];


  get CurrentBranchTime(): Date {
    return this.GetCurrentBranchTime();
  }

  constructor(
    private stationDetailsService: AgentStationDataService,
    private readonly hoursOfOperationAPIService: HoursOfOperationAPIService,
    private classicService: ClassicAgentService,
    private readonly kioskAPIService: KioskAPIService,
    private queueSignalRService: QueueSignalRService,
    private readonly dynamicRuleProcessorAPIService: DynamicRuleProcessorAPIService
  ) {
    super();
    this.SetObservables();

  }

  public EmptyQuestions() {
    this.PreServiceQuestionsSubject.next([]);
    this.ServiceQuestionsSubject.next([]);
    this.PreviouslyAskedQuestionsSubject.next([]);
    this.PreviouslyAskedQuestionSets = [];
  }

  private SetObservables(): void {
    this.PreServiceQuestionsSubject = new BehaviorSubject<
      IKioskPanelItemsData[]
    >([]);
    this.PreServiceQuestions$ = this.PreServiceQuestionsSubject.asObservable();

    this.ServiceQuestionsSubject = new BehaviorSubject<IKioskPanelItemsData[]>(
      []
    );
    this.ServiceQuestions$ = this.ServiceQuestionsSubject.asObservable();

    this.ServicesSubject = new BehaviorSubject<IDropdown[]>([]);
    this.Services$ = this.ServicesSubject.asObservable();

    this.SubjectHoursOfOperationList = new BehaviorSubject<any[]>([]);
    this.HoursOfOperationList$ = this.SubjectHoursOfOperationList.asObservable();

    this.NextButtonTextSubject = new BehaviorSubject<string>('Next');
    this.NextButtonText$ = this.NextButtonTextSubject.asObservable();


    this.BranchCountryCodeSubject = new BehaviorSubject<string>('');
    this.BranchCountryCode$ = this.BranchCountryCodeSubject.asObservable();

    this.NextRouteSubject = new BehaviorSubject<IServiceRoute>(null);
    this.NextRoute$ = this.NextRouteSubject.asObservable();
    this.VisitorAddedSubject = new Subject<boolean>();
    this.VisitorAdded$ = this.VisitorAddedSubject.asObservable();

    this.ShowEstimateWaitTimeSubject = new Subject<boolean>();
    this.ShowEstimateWaitTime$ =
      this.ShowEstimateWaitTimeSubject.asObservable();

    this.EstimateWaitTimeSubject = new BehaviorSubject<String>('');
    this.EstimateWaitTime$ = this.EstimateWaitTimeSubject.asObservable();

    this.DisplayTicketNumberSubject = new BehaviorSubject<String>('');
    this.DisplayTicketNumber$ = this.DisplayTicketNumberSubject.asObservable();

    this.PreviouslyAskedQuestionsSubject = new BehaviorSubject<
      IKioskPanelItemsData[]
    >([]);
    this.PreviouslyAskedQuestions$ =
      this.PreviouslyAskedQuestionsSubject.asObservable();

    this.LanguageSubject = new BehaviorSubject<ISupportedLanguage[]>([]);
    this.LanguageList$ = this.LanguageSubject.asObservable();

    this.DefaultLanguageSubject = new BehaviorSubject(null);
    this.DefaultLanguage$ = this.DefaultLanguageSubject.asObservable();

    this.SubjectBranch = new BehaviorSubject<IBranchDetails>(null);
    this.branch$ = this.SubjectBranch.asObservable();

    this.SubjectHoursOfOperation = new BehaviorSubject<IHoursOfOperation>(null);
    this.HoursOfOperation$ = this.SubjectHoursOfOperation.asObservable();

    this.subs.sink = this.HoursOfOperation$.subscribe(
      (hoo) => (this.HoursOfOperation = hoo)
    );
    this.Groups$ = this.classicService.Groups$.pipe(
      map((groups) => {
        return groups?.map((group) => {
          return {
            value: group.id,
            text: group.groupName,
          };
        });
      })
    );

    this.subs.sink = this.classicService.TransferServiceForDialog$.subscribe(
      (questions) => {
        this.Customer = questions;
      }
    );

    this.subs.sink = this.stationDetailsService.StationDetails$.subscribe(
      (stationDetails) => {
        this.Workflow = stationDetails.Workflow;
        this.WorkFlowUsedInBranchList = stationDetails.BranchesWithWorkflows?.filter(location => location?.branch?.id === stationDetails?.BranchDetails?.branchId)[0]?.workflows;
        this.SubjectBranch.next(stationDetails?.BranchDetails);
        this.InitializeHOO();
        this.BranchCountryCodeSubject.next(stationDetails?.BranchDetails?.countryCode);
        this.Initialize();
      }
    );
  }
  async InitializeHOO() {
    const Branch = this.SubjectBranch.getValue();
    const hoursOfOperationExceptionId =
      Branch?.advanceSettings?.hoursOfOperationExceptionId;
    if (hoursOfOperationExceptionId) {
      const HOO = await this.hoursOfOperationAPIService
        .GetExternal<IHoursOfOperation>(
          Branch.companyId,
          hoursOfOperationExceptionId
        )
        .toPromise();
      if (
        isDateLiesBetweenTwoDates(
          HOO.generalConfiguration.fromDate,
          HOO.generalConfiguration.toDate,
          this.CurrentBranchTime
        )
      ) {
        this.SubjectHoursOfOperation.next(HOO);
        this.UpdateServices();
        return;
      }
    }

    const HOOId: string = Branch?.additionalSettings?.hoursOfOperationId;
    if (HOOId) {
      const HOO = await this.hoursOfOperationAPIService
        .GetExternal<IHoursOfOperation>(Branch.companyId, HOOId)
        .toPromise();
      this.SubjectHoursOfOperation.next(HOO);
    } else {
      this.AppNotificationService.NotifyError(
        'Hours of operations not linked to branch.'
      );
    }
    const AllHOO = await this.hoursOfOperationAPIService.GetAllExternal(Branch.companyId).toPromise();
    this.SubjectHoursOfOperationList.next(AllHOO);
    this.UpdateServices();
  }

  UpdateServices() {
    const Services: IDropdown[] = [];
    for (const service of this.Workflow?.services?.filter(
      (x) => !x.isDeleted
    )) {
      if (service.acceptWalkins && this.IsThisServiceIsAssignedToBranch(service) /*&& this.IsServiceAvailable(service)*/){
        Services.push({
          value: service.id,
          text: service.serviceNames[0].serviceName,
        });
      }
    }
    this.ServicesSubject.next(Services);
  }
  IsServiceAvailable(service): boolean {
    const BranchTime = this.GetCurrentBranchTime();
    const workingDay = cloneObject(this.GetHOODayById(BranchTime.getDay()));
    if (!BranchTime) {
      return false;
    }
    if (service.serviceOccur?.value) {
      if (service.hoursOfOperationId && service.serviceOccur.value === OperationalOccurs.Default) {
        return ServiceAvailableOrNotDefault(this.GetDefaultWorkingDaysData(service.hoursOfOperationId), BranchTime)
      }
      return CheckServiceAvailability(service, BranchTime)
    }
    if (!this.IsOpenForDayOfTheWeek(BranchTime.getDay())) {
      return false;
    }
    const isHolidayToday = this.IsHolidayToday(BranchTime);
    if (isHolidayToday) {
      return false;
    }
    return ServiceAvailableOrNotDefault(this.HoursOfOperation.workingHours, BranchTime)
  }

  GetDefaultWorkingDaysData(hooId): IWorkingHours {
    let HoursOfOperationData: IWorkingHours = null
    this.SubjectHoursOfOperationList.value.find((x) => {
      if (x.id === hooId) {
        HoursOfOperationData = x.workingHours;
      }
    });
    return HoursOfOperationData
  }

  private IsOpenForDayOfTheWeek(DayId: number): boolean {
    const day = this.GetHOODayById(DayId);
    return day?.isOpen;
  }

  private IsHolidayToday(BranchTime: Date): boolean {
    if (this.HoursOfOperation?.nonWorkingDaysList) {
      const Holidays = this.HoursOfOperation.nonWorkingDaysList.some(
        (holiday) =>
          isDateLiesBetweenTwoDates(
            holiday.fromDate,
            holiday.toDate,
            BranchTime
          )
      );
      return Holidays;
    } else {
      return false;
    }
  }

  private GetHOODayById(DayId: number): IWorkingDay {
    // tslint:disable-next-line: forin
    for (const dayProp in this.HoursOfOperation?.workingHours) {
      const Day = this.HoursOfOperation.workingHours[dayProp];
      if (DayId === Day.dayId) {
        return Day;
      }
    }
    return null;
  }

  private IsThisServiceIsAssignedToBranch(service: IService) {
    const branchWorkflow = this.WorkFlowUsedInBranchList?.
      filter(x => x.workFlowId === this.Workflow?.workFlowId)[0];
    return branchWorkflow?.isAllServices || branchWorkflow?.serviceIds?.includes(service?.id);
  }

  RemoveServices() {
    const Services: IDropdown[] = [];
    for (const service of this.Workflow?.services?.filter(
      (x) => !x.isDeleted
    )) {
      if (service.acceptWalkins && service.id != this.Customer.serviceId && this.IsThisServiceIsAssignedToBranch(service)) {
        Services.push({
          value: service.id,
          text: service.serviceNames[0].serviceName,
        });
      }
    }
    this.ServicesSubject.next(Services);
  }

  GetCurrentBranchTime(): Date {
    const Branch = this.SubjectBranch.getValue();
    const DateConvertedToTimeZone = this.KendoTimeZoneData.fromLocalDate(
      new Date(),
      Branch.additionalSettings.timeZone.id
    );
    const currentBranchTime = new Date(
      DateConvertedToTimeZone.getFullYear(),
      DateConvertedToTimeZone.getMonth(),
      DateConvertedToTimeZone.getDate(),
      DateConvertedToTimeZone.getHours(),
      DateConvertedToTimeZone.getMinutes(),
      DateConvertedToTimeZone.getSeconds(),
      DateConvertedToTimeZone.getMilliseconds()
    );
    return currentBranchTime;
  }

  Initialize(): void {
    const PreServiceQuestions: IKioskPanelItemsData[] = [];
    if (this.Workflow.preServiceQuestions) {
      for (const question of this.Workflow.preServiceQuestions.filter(
        (x) => !x.isDeleted
      )) {
        const PreServiceQuestion: IKioskPanelItemsData = this.GetDefaultData();
        PreServiceQuestion.itemId = question.id;
        PreServiceQuestion.itemText = question.question?.find(
          (x) => x.languageId === this.languageId
        )?.question;
        PreServiceQuestion.itemType = question.type;
        PreServiceQuestion.itemTypeSetting =
          this.GetQuestionTypeSetting(question);
        PreServiceQuestion.required = question.isRequired;
        if (this.IsTransferMode || this.IsEditMode) {
          this.Customer?.agentQuestions?.find(
            (x) => {
              if (x.questionId === question.id) {
                if (x.answer && (x.questionType === QuestionType.DropDown.value || x.questionType === QuestionType.MultiSelect.value || x.questionType === QuestionType.Options.value)) {
                  PreServiceQuestion.answer = this.TranslatePreServiceQuestiontypeOptions(x, this.Customer.selectedLanguageId, this.languageId);
                } else {
                  PreServiceQuestion.answer = x?.answer
                }
              }
            });
        }
        PreServiceQuestions.push(PreServiceQuestion);
      }
      if (!this.IsTransferMode && !this.IsEditMode) {
        this.LanguageSubject.next(this.SubjectBranch.value.supportedLanguages.filter(x => !x.isDefault));
        this.DefaultLanguageSubject.next(this.SubjectBranch.value.supportedLanguages.find(x => x.isDefault));
      } else {
        if (this.Customer?.selectedLanguageId) {
          this.DefaultLanguageSubject.next(this.SubjectBranch.value.supportedLanguages.find((language) => language.languageCode === this.Customer.selectedLanguageId));
          this.LanguageSubject.next(this.SubjectBranch.value.supportedLanguages.filter((language) => language.languageCode !== this.Customer.selectedLanguageId));
        }
      }
    }
    this.PreServiceQuestionsSubject.next(PreServiceQuestions);
    if (!this.IsTransferMode && !this.IsEditMode) {
      this.ServiceQuestionsSubject.next([]);
    }
  }


  GetQuestionTypeSetting(question: IGlobalQuestion): any {
    switch (question.type) {
      case QuestionType.DropDown.value:
        return this.GetQuestionOptions(question);
      case QuestionType.MultiSelect.value:
        return this.GetQuestionOptions(question);
      case QuestionType.Options.value:
        return this.GetQuestionOptions(question);
      default:
        return question.typeSetting;
    }
  }

  GetQuestionOptions(question: IGlobalQuestion): any {
    const itemTypeSettings = [];
    question.typeSetting.forEach((element) => {
      itemTypeSettings.push(
        element.find((lang) => lang?.languageId === this.languageId)?.option
      );
    });
    return itemTypeSettings;
  }

  ServiceChanged(serviceId: string) {
    this.ServiceId = serviceId;
    if(this.ServiceQuestionsSubject.value.length > 0) {
      this.PreviouslyAskedQuestionsSubject.next([]);
      this.PreviouslyAskedQuestionSets = [];
    }
    this.ServiceQuestionsSubject.next([]);

    if (!!!serviceId) {
      return;
    }
    const Service = this.Workflow.services.find(
      (x) => x.id === serviceId && !x.isDeleted
    );
    if (!!!Service) {
      return;
    }

    switch (Service.routing.group) {
      case Routing.Questions:
        this.BindQuestions(Service.routing.id);
        return;
      case Routing.Queue:
        this.UpdateNextButtonTextBasedOnRoute(Service.routing);
        return;
    }
  }

  Submit(
    request: VisitorRequest,
    serviceQuestions: IKioskPanelItemsData[]

  ): void {
    this.UpdateQuestionTypeOptionAnswer(request);
    const DynamicQueryProcessorRequest = this.GetDynamicQueryProcessorReq(request);

    this.dynamicRuleProcessorAPIService
      .EvaluateConditionalRoute(DynamicQueryProcessorRequest)
      .subscribe((responses) => {
        if (!responses || responses.length == 0) {
          this.DefaultRoute(request);
          this.UpdatePreviousQuestions(serviceQuestions);
          return;
        }

        if (responses.length > 1) {
          this.DefaultRoute(request);
          this.UpdatePreviousQuestions(serviceQuestions);
            this.PreviouslyAskedQuestionSets = [];
             this.PreviouslyAskedQuestionsSubject.next([]);
          return;
        }

        const response = responses[0];
        if (response.responseType == ConditionalRoutingResponseTypes.Queue) {
          this.NextRouteSubject.next({
            group: Routing.Queue,
            type: Routing.Queue,
            id: response.queueId,
          });
          this.UpdatePreviousQuestions(serviceQuestions);
          this.PostAddVisitorRequest(request);
          this.PreviouslyAskedQuestionSets = [];
          this.PreviouslyAskedQuestionsSubject.next([]);
          return;
        }
        if (
          response.responseType == ConditionalRoutingResponseTypes.QuestionSet
        ) {
          this.NextRouteSubject.next({
            group: Routing.Questions,
            type: Routing.Questions,
            id: response.questionSetId,
          });
          const questionSetId = response.questionSetId;
          this.BindQuestions(questionSetId);
          this.UpdatePreviousQuestions(serviceQuestions);
          return;
        }
        if (response.responseType == ConditionalRoutingResponseTypes.NoQueue) {
          this.AppNotificationService.NotifyError(AgentMessages.NoQueueMessage);
          this.NextRouteSubject.next({
            group: Routing.NoQueue,
            type: Routing.NoQueue,
            id: response.queueId,
          });
          return;
        }
      });
  }

  UpdateQuestionTypeOptionAnswer(request) {
    request.preServiceQuestions.forEach((question) => {
      if (question.answer && (question.questionType === QuestionType.DropDown.value || question.questionType === QuestionType.MultiSelect.value || question.questionType === QuestionType.Options.value)) {
        question.answer = this.TranslatePreServiceQuestiontypeOptions(question, this.languageId, request.languageCode);
      }

    });
    request.serviceQuestions.forEach((question) => {
      if (question.answer && (question.questionType === QuestionType.DropDown.value || question.questionType === QuestionType.MultiSelect.value || question.questionType === QuestionType.Options.value)) {
        question.answer = this.TranslateServiceQuestiontypeOptions(question, this.languageId, request.languageCode);
      }

    });
  }
  TranslatePreServiceQuestiontypeOptions(question, currentLangId, translatedLangId): any {
    let TranslateAnswer;
    if (question?.questionType === QuestionType.MultiSelect.value) {
      let multiSelectedAnswerList = [];
      question?.answer?.forEach((ans) => {
        question && question.questionId && this.Workflow.preServiceQuestions?.find((workflowQuestion) => {
          if (workflowQuestion.id === question.questionId) {
            workflowQuestion?.typeSetting?.forEach((list) => {
              if (list.find((op) => op.languageId === currentLangId).option === ans) {
                multiSelectedAnswerList.push(list.find((lang) => lang?.languageId === translatedLangId)?.option);
              };
            });
          }
        });
      })
      TranslateAnswer = multiSelectedAnswerList;
    } else {
      question && question.questionId && this.Workflow.preServiceQuestions?.find((workflowQuestion) => {
        if (workflowQuestion.id === question.questionId) {
          workflowQuestion?.typeSetting?.forEach((list) => {
            if (list.find((op) => op.languageId === currentLangId).option === question.answer) {
              TranslateAnswer = list.find((lang) => lang?.languageId === translatedLangId)?.option
            };
          });
        }
      });
    }
    return TranslateAnswer;
  }

  TranslateServiceQuestiontypeOptions(question, currentLangId, translatedLangId): any {
    let TranslateAnswer;
    if (question?.questionType === QuestionType.MultiSelect.value) {
      let multiSelectedAnswerList = [];
      question?.answer?.forEach((ans) => {
        question && question.questionId && this.Workflow.questionSets?.forEach(questionSet => {
          let questionFound = questionSet?.questions?.find(quest => quest.id == question.questionId)
          if (questionFound) {
            questionFound?.typeSetting?.forEach((list) => {
              if (list.find((op) => op.languageId === currentLangId).option === ans) {
                multiSelectedAnswerList.push(list.find((lang) => lang?.languageId === translatedLangId)?.option);
              };
            });
          }
        });
      })
      TranslateAnswer = multiSelectedAnswerList
    } else {
      question && question.questionId && this.Workflow.questionSets?.forEach(questionSet => {
        let questionFound = questionSet?.questions?.find(quest => quest.id == question.questionId)
        if (questionFound) {
          questionFound?.typeSetting?.forEach((list) => {
            if (list.find((op) => op.languageId === currentLangId).option === question.answer) {
              TranslateAnswer = list.find((lang) => lang?.languageId === translatedLangId)?.option
            };
          });
        }
      });
    }
    return TranslateAnswer;
  }

  ControlChange(
    request: VisitorRequest,
    previousServiceQuestions: IKioskPanelItemsData[]
  ): void {
    const DynamicQueryProcessorRequest = this.GetDynamicQueryProcessorReq(request);
    this.dynamicRuleProcessorAPIService
      .EvaluateConditionalRoute(DynamicQueryProcessorRequest, false)
      .subscribe((responses) => {
        if (!responses || responses.length === 0 || responses.length > 1) {
          this.DefaultRoute(request);
          this.UpdatePreviousQuestions(previousServiceQuestions);
          return;
        }

        const response = responses[0];
        if (response.responseType == ConditionalRoutingResponseTypes.Queue) {
          return;
        }
        if (response.responseType == ConditionalRoutingResponseTypes.QuestionSet) {
          this.NextRouteSubject.next({
            group: Routing.Questions,
            type: Routing.Questions,
            id: response.questionSetId,
          });
          const questionSetId = response.questionSetId;
          this.BindQuestions(questionSetId);
          this.UpdatePreviousQuestions(previousServiceQuestions);
          return;
        }
        if (response.responseType == ConditionalRoutingResponseTypes.NoQueue) {
          this.AppNotificationService.NotifyError(AgentMessages.NoQueueMessage);
          this.NextRouteSubject.next({
            group: Routing.NoQueue,
            type: Routing.NoQueue,
            id: response.queueId,
          });
          return;
        }
      });
  }

  private GetDynamicQueryProcessorReq(request: VisitorRequest) {
    const previouslyAskedQuestionSets: string[] = this.PreviouslyAskedQuestionSets;
    const documents: Array<RulesDocument | RulesDocumentReference> = [];
    const workflow = this.GetWorkflowBaseDetails();
    if (workflow) {
      documents.push(workflow);
    }
    const customerRequest: RulesDocument = this.GetRequestDetails(request);
    if (customerRequest) {
      documents.push(customerRequest);
    }

    const DynamicQueryProcessorRequest = {
      previouslyAskedQuestionSets,
      documents,
    };
    return DynamicQueryProcessorRequest;
  }

  UpdatePreviousQuestions(previousServiceQuestions: IKioskPanelItemsData[]) {
    let oldQuestions = this.PreviouslyAskedQuestionsSubject.value;

    const key = 'itemId';

    const arrayUniqueByKey = [...new Map(previousServiceQuestions.map(item =>
      [item[key], item])).values()];

    let newObject = oldQuestions.concat(arrayUniqueByKey)
    this.PreviouslyAskedQuestionsSubject.next(
      newObject
    );
  }

  private DefaultRoute(request: VisitorRequest) {
    const NextRoute = this.NextRouteSubject.getValue();

    switch (NextRoute.group) {
      case Routing.Questions:
        this.BindQuestions(NextRoute.id);
        return;
      case Routing.Queue:
        this.PostAddVisitorRequest(request);
        return;
    }
  }

  GetRequestDetails(request: VisitorRequest): RulesDocument {
    const serviceQuestions = this.GetServiceQuestionWithAnswers(request);
    return {
      documentType: 'customerRequest',
      document: {
        id: '',
        workflowId: this.Workflow.workFlowId,
        serviceQuestions,
        serviceId: this.ServiceId,
        isWalking: (this.Customer?.isWalking === false) ? false : true,
        isAppointment: this.Customer?.isAppointment
      },
    };
  }

  GetServiceQuestionWithAnswers(
    request: VisitorRequest
  ): { id: string; answer: string }[] {
    if (!request) {
      return [];
    }

    for (const ServiceQuestion of request.serviceQuestions || []) {
      this.AllAnsweredQuestions.push(ServiceQuestion);
    }

    const mappedQuestions =
      this.AllAnsweredQuestions.map((x) => {
        return {
          id: x.questionId,
          answer: x.answer,
        };
      }) || [];

      this.AllAnsweredQuestions = [];
      const uniqueObjects = [...new Map(mappedQuestions.map(item => [item.id, item])).values()]
    return uniqueObjects;
  }

  GetWorkflowBaseDetails(): RulesDocumentReference {
    return {
      documentType: 'workflow',
      pk: this.Workflow.companyId,
      id: this.Workflow.workFlowId,
    };
  }

  PostAddVisitorRequest(request: VisitorRequest): void {
    let previouslyAskedQuestions = this.MappedQuestions(this.PreviouslyAskedQuestionsSubject.value)
    let allServiceQuestions = request.serviceQuestions.concat(previouslyAskedQuestions)
    const uniqueObjects = [...new Map(allServiceQuestions.map(item => [item.questionId, item])).values()]
    request.serviceQuestions = uniqueObjects
    const TemplateModel: any =
      this.GetKioskTemplateModel(request);

    if (request.isTransfer || request.isEdit) {
      this.kioskAPIService
        .TransferTicket<any, KioskRequest>(TemplateModel, request.isEdit)
        .subscribe((response) => {
          this.classicService.OnCustomerRemoved([TemplateModel.oldRequestId]);
          this.classicService.OnRequestAdded([response]);
          this.AppNotificationService.Notify(
            request.isTransfer
              ? CommonMessages.VisitorTransferred
              : CommonMessages.VisitorUpdated
          );
          this.VisitorAddedSubject.next(true);
        });
    } else {


      const TemplateModelWithOutWorkFlow: any =
        this.GetKioskTemplateModelWithOutWorkFlow(request);
      this.subs.sink = this.kioskAPIService
        .GenerateTicket<KioskTemplateModel, KioskRequest>(TemplateModelWithOutWorkFlow)
        .subscribe((response) => {
          let allowCalculateEstimateWaitTime = response?.estimatedWaitRangesSettings?.allowCalculateEstimateWaitTime
          let estimatedServingTimeUTCString = response?.estimatedServingTimeUTCString
          this.queueSignalRService.UpdateQueue(response.queue);
          if (response) {
            this.classicService.OnRequestAdded([response]);
          }
          this.AppNotificationService.Notify(CommonMessages.VisitorAdded);
          response.estimatedServingTimeUTCString = estimatedServingTimeUTCString
          if (allowCalculateEstimateWaitTime && estimatedServingTimeUTCString) {
            this.ShowEstimateWaitTime(response);
          } else {
            this.VisitorAddedSubject.next(true);
          }
        });
    }
  }
  ShowEstimateWaitTime(requests: KioskRequest) {
    const WaitTime: string = this.GetWaitTime(requests);

    this.EstimateWaitTimeSubject.next(WaitTime);
    this.DisplayTicketNumberSubject.next(requests.ticketNumber);
    this.ShowEstimateWaitTimeSubject.next(true);
  }

  GetWaitTime(requests: KioskRequest): string {
    const diffInMs =
      Date.parse(requests.estimatedServingTimeUTCString) -
      Date.parse(requests.requestTimeUTCString);
    let waitTimeInMin = parseInteger(diffInMs / 1000 / 60);

    waitTimeInMin =
      parseInteger(
        waitTimeInMin / requests.estimatedWaitRangesSettings.defaultRange
      ) * requests.estimatedWaitRangesSettings.defaultRange;

    const from = this.GetEstimateWaitTimeInMinute(waitTimeInMin, requests);
    const to = this.GetEstimateWaitTimeInMinute(
      waitTimeInMin + parseInteger(requests.estimatedWaitRangesSettings.defaultRange),
      requests
    );

    const waitTime = this.GetWaitTimeDisplayString(from, to);

    return waitTime;
  }

  private GetWaitTimeDisplayString(from: EstimateWaitTime, to: EstimateWaitTime) {
    let fromString = `${from.hours
      ? from.hours + '' + (from.hours === 1 ? ' Hour ' : ' Hours ')
      : ''}${from.minutes
        ? from.hours || to.hours
          ? from.minutes +
          '' +
          (from.minutes === 1 ? ' Minute ' : ' Minutes ')
          : from.minutes + ''
        : ''}`;

    fromString = fromString ? fromString : '0';

    const waitTime =
      fromString +
      ' - ' +
      `${from.hours || to.hours ? '<br>' : ''}${to.hours ? to.hours + '' + (to.hours === 1 ? ' Hour ' : ' Hours ') : ''}${to.minutes
        ? to.minutes +
        (from.hours || to.hours ? '' : '<br>') +
        (from.minutes === 1 ? ' Minute' : ' Minutes')
        : ''}`;

    return waitTime;
  }

  GetEstimateWaitTimeInMinute(
    waitTimeInMin: number,
    requests: KioskRequest
  ): EstimateWaitTime {
    if (waitTimeInMin) {
      return {
        hours: parseInteger(waitTimeInMin / 60),
        minutes: parseInteger(waitTimeInMin % 60),
        seconds: 0,
      };
    }
    else {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
  }

  GetKioskTemplateModel(request: VisitorRequest): KioskTemplateModel {
    const NextRoute = this.NextRouteSubject.getValue();
    request.queueId = NextRoute.id;
    request.id = this.uuid;
    request.branchId = this.stationDetailsService.BranchId;

    return {
      branchId: request.branchId,
      id: request.id,
      kioskData: {
        designer: {
          WorkFlowId: this.Workflow.workFlowId,
        },
        preServiceQuestionPage: this.MapQuestionToKioskTemplateModel(
          request.preServiceQuestions
        ),
        serviceQuestion: this.MapQuestionToKioskTemplateModel(
          request.serviceQuestions
        ),
      },
      queueId: request.queueId,
      serviceId: request.serviceId,
      workflow: this.Workflow,
      selectedLanguageId: request.languageCode,
      selectedLanguageName: this.LanguageSubject.value.find(x => x.languageCode == request.languageCode) ?
        this.LanguageSubject.value.find(x => x.languageCode == request.languageCode).language : this.DefaultLanguageSubject.value.language,
      companyId: this.authService.CompanyId,
      isTransfer: request.isTransfer,
      transferBy: request.transferBy,
      requestSourceId: this.authService.UserId,
      requestSourceType: 'AGENT',
      mobileInterfaceId: this.GetMobileInterfaceIdIfPresent(),
      groups: request.groups,
      oldRequestId: request.transferId,
    };
  }

  GetKioskTemplateModelWithOutWorkFlow(request: VisitorRequest): KioskTemplateModel {
    const NextRoute = this.NextRouteSubject.getValue();
    request.queueId = NextRoute.id;
    request.id = this.uuid;
    request.branchId = this.stationDetailsService.BranchId;

    return {
      branchId: request.branchId,
      id: request.id,
      kioskData: {
        designer: {
          WorkFlowId: this.Workflow.workFlowId,
        },
        preServiceQuestionPage: this.MapQuestionToKioskTemplateModel(
          request.preServiceQuestions
        ),
        serviceQuestion: this.MapQuestionToKioskTemplateModel(
          request.serviceQuestions
        ),
      },
      queueId: request.queueId,
      serviceId: request.serviceId,
      workflow: {
        workFlowId: this.Workflow.workFlowId,
        companyId: this.Workflow.companyId,
      },
      selectedLanguageId: request.languageCode,
      selectedLanguageName: this.LanguageSubject.value.find(x => x.languageCode == request.languageCode) ?
        this.LanguageSubject.value.find(x => x.languageCode == request.languageCode).language : this.DefaultLanguageSubject.value.language,
      companyId: this.authService.CompanyId,
      isTransfer: request.isTransfer,
      transferBy: request.transferBy,
      requestSourceId: this.authService.UserId,
      requestSourceType: 'AGENT',
      mobileInterfaceId: this.GetMobileInterfaceIdIfPresent(),
      groups: request.groups,
      oldRequestId: request.transferId,
    };
  }

  GetMobileInterfaceIdIfPresent(): string {
    return this.stationDetailsService.AgentConfigurations?.mobileTemplateId;
  }

  MapQuestionToKioskTemplateModel(
    Questions: Question[]
  ): KioskExecutionPreServiceQuestionPage {
    if (Questions) {
      return {
        items: Questions.map((question) => {
          return {
            answer: question.answer,
            itemId: question.questionId,
            itemText: question.questionText,
            itemType: question.questionType,
          };
        }),
      };
    } else {
      return {
        items: [],
      };
    }
  }


  MappedQuestions(ServiceQuestions: IKioskPanelItemsData[]): Question[] {
    if (ServiceQuestions) {
      return ServiceQuestions.map(x => {
        return {
          answer: x.answer,
          questionId: x.itemId,
          questionType: x.itemType,
          questionText: x.itemText
        };
      });
    } else {
      return [];
    }
  }

  UpdateNextButtonTextBasedOnRoute(routing: IServiceRoute) {
    this.NextRouteSubject.next(routing);

    if (routing.group == Routing.Questions) {
      this.NextButtonTextSubject.next('Next');
      return;
    }

    if (this.IsTransferMode) {
      this.NextButtonTextSubject.next('Transfer Service');
      return;
    }

    if (this.IsEditMode) {
      this.NextButtonTextSubject.next('Update Visitor');
      return;
    }

    this.NextButtonTextSubject.next('Continue');
  }

  BindQuestions(questionSetId: string) {
    this.PreviouslyAskedQuestionSets.push(questionSetId);
    const ServiceQuestions: IKioskPanelItemsData[] = [];
    const QuestionSet = this.Workflow.questionSets.find(
      (x) => x.id === questionSetId && !x.isDeleted
    );
    const Questions = QuestionSet?.questions?.filter((x) => !x.isDeleted);
    for (const question of Questions) {
      const PreServiceQuestion: IKioskPanelItemsData = this.GetDefaultData();
      PreServiceQuestion.itemId = question.id;
      PreServiceQuestion.itemText = question.question[0]?.question;
      PreServiceQuestion.itemType = question.type;
      PreServiceQuestion.itemTypeSetting =
        this.GetQuestionTypeSetting(question);
      PreServiceQuestion.required = question.isRequired;
      if (
        (this.IsTransferMode || this.IsEditMode) &&
        this.Customer.serviceId == this.ServiceId &&
        !this.Customer.isNowServing
      ) {
        this.Customer?.agentQuestions?.find(
          (x) => {
            if (x.questionId === question.id) {
              if (x.answer && (x.questionType === QuestionType.DropDown.value || x.questionType === QuestionType.MultiSelect.value || x.questionType === QuestionType.Options.value)) {
                PreServiceQuestion.answer = this.TranslateServiceQuestiontypeOptions(x, this.Customer.selectedLanguageId, this.languageId);
              } else {
                PreServiceQuestion.answer = x?.answer
              }
            }
          });
      }
      ServiceQuestions.push(PreServiceQuestion);
    }

    
    this.ServiceQuestionsSubject.next(ServiceQuestions);
    const NextRoute = QuestionSet.routing;
    this.UpdateNextButtonTextBasedOnRoute(NextRoute);
  }

  GetDefaultData(): IKioskPanelItemsData {
    return {
      required: false,
      answer: '',
      backgroundColor: '',
      color: '',
      font: '',
      fontSize: 12,
      fontStyle: '',
      fontWeight: '',
      itemId: '',
      selected: false,
      itemText: '',
      itemType: '',
      itemTypeSetting: null,
    };
  }

  NotifyError(PleaseAnswerAllQuestionAddVisitor: string) {
    this.AppNotificationService.NotifyError(PleaseAnswerAllQuestionAddVisitor);
  }
}

export const Routing = {
  Questions: 'Questions',
  Queue: 'Queue',
  NoQueue: 'No Queue',
};