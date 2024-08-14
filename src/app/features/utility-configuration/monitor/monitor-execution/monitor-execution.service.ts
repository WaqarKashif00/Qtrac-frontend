import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { cloneObject } from 'src/app/core/utilities/core-utilities';
import { QueueStatus } from 'src/app/models/enums/queue-status.enum';
import { MonitorAPIService } from 'src/app/shared/api-services/monitor-api.service';
import { DynamicVariableService } from '../../../../core/services/dynamic-variables.service';
import { TextToSpeechService } from '../../../../core/services/text-to-speech.service';
import { IQueue } from '../../agent/utility-services/models/agent-signalr/queue.model';
import { QueueSignalRService } from '../../agent/utility-services/services/agent-signalR/queue-signalr.service';
import { TextToSpeechSignalRService } from '../../agent/utility-services/services/agent-signalR/text-to-speech-signalr.service';
import { IMonitorExecutionQueue } from '../add-monitor/monitor-layout/Models/monitor-execution-queue.interface';
import { IMonitorLayoutData } from '../add-monitor/monitor-layout/Models/monitor-layout-data';

@Injectable()
export class MonitorExecutionService extends AbstractComponentService {
  private MonitorLayoutDataSubject: BehaviorSubject<IMonitorLayoutData>;
  MonitorLayoutData$: Observable<IMonitorLayoutData>;
  ContainerWidth: number;
  ContainerHeight: number;
  private IsMonitorDeviceStandByModeSubject: BehaviorSubject<boolean>;
  IsMonitorDeviceStandByMode$: Observable<boolean>;
  private NowCallingsSubject: BehaviorSubject<IMonitorExecutionQueue[]>;
  NowCallings$: Observable<IMonitorExecutionQueue[]>;
  private WaitingsSubject: BehaviorSubject<IMonitorExecutionQueue[]>;
  Waitings$: Observable<IMonitorExecutionQueue[]>;
  private NowServingsSubject: BehaviorSubject<IMonitorExecutionQueue[]>;
  NowServings$: Observable<IMonitorExecutionQueue[]>;

  private SelectedLanguageSubject: BehaviorSubject<string>;
  SelectedLanguage$: Observable<string>;

  private DefaultLanguageSubject: BehaviorSubject<string>;
  DefaultLanguage$: Observable<string>;
  BranchId = '';
  CompanyId = '';
  MonitorData;
  QueuePositions: IQueue;
  AnnouncementData: any;
  showAnnoucementLabel$: Observable<boolean>;
  showAnnoucementLabelSubject: BehaviorSubject<boolean>;
  timer: boolean = false;


  constructor(
    private textToSpeechService: TextToSpeechService,
    private readonly monitorAPIService: MonitorAPIService,
    private queueSignalRService: QueueSignalRService,
    private dynamicVariablesService: DynamicVariableService,
    private textToSpeechSignalRService: TextToSpeechSignalRService

  ) {
    super();
    this.InitializeSubjectsAndObservables();
    this.InitializeMonitorLayoutData();
    this.SubscribeToAzureSignalRObservables();
    this.showAnnoucementLabelSubject = new BehaviorSubject<boolean>(false);
    this.showAnnoucementLabel$ = this.showAnnoucementLabelSubject.asObservable();
  }

  InitializeQueueSignalR() {
    // const {
    //   browserId,
    //   branchId,
    //   companyId,
    //   kioskId: monitorId,
    // } = new JwtHelperService().decodeToken(
    //   this.browserStorageService.kioskExecutionToken
    // );
    const browserId = JSON.parse(this.browserStorageService.kioskExecutionToken).browserId;
    const branchId = JSON.parse(this.browserStorageService.kioskExecutionToken).branchId;
    const companyId = JSON.parse(this.browserStorageService.kioskExecutionToken).companyId;
    const monitorId = JSON.parse(this.browserStorageService.kioskExecutionToken).kioskId;

    const workflowId = this.MonitorData.designerScreen.workFlowId;
    const QueueDocId = `${branchId}_${workflowId}_Queue`;
    this.queueSignalRService.Init(QueueDocId);

    this.subs.sink = this.queueSignalRService.QueuePositions$.subscribe(
      (queue) => {
        this.QueuePositions = queue;
        UpdateSubject(this.NowCallingsSubject);
        UpdateSubject(this.WaitingsSubject);
      }
    );
  }


  InitializeTextToSpeachSignalR() {
    const branchId = JSON.parse(this.browserStorageService.kioskExecutionToken).branchId;
    const companyId = JSON.parse(this.browserStorageService.kioskExecutionToken).companyId;
    const announcementDocId = `${companyId}_${branchId}_Announcement`;
    this.textToSpeechSignalRService.Init(announcementDocId);
    this.subs.sink = this.textToSpeechSignalRService.SubjectTextToSpeech.subscribe((response) => {
      this.AnnouncementData = response;
      if (!this.AnnouncementData) {
       return;
      }

      let timeLimit = Number(this.MonitorLayoutDataSubject.value.designerScreen.textToSpeachTimer) * 1000;
      let newTimer = timeLimit + 5000;
      let isTeaxToSpeachOn = false;
      if(this.MonitorLayoutDataSubject.value.designerScreen.enableTextToSpeech) {
      this.MonitorLayoutDataSubject.value.monitorPageData.labels.forEach((data) => {
        if (data?.isTextToSpeachEnable == true) {
          const language = this.AnnouncementData.LanaguageCode;
          data.text = { [language]: this.AnnouncementData.AnnoucementText };
          data.PublicStoragePath = this.AnnouncementData.PublicStoragePath;
          isTeaxToSpeachOn = true;
        }
      });
    }
    if(isTeaxToSpeachOn) {
      const showAnnouncementLabel = () => {
        this.showAnnoucementLabelSubject.next(true);
        this.MonitorLayoutDataSubject.next(this.MonitorLayoutDataSubject.value);
        setTimeout(() => {
          this.showAnnoucementLabelSubject.next(false);
          this.timer = false;
        }, timeLimit);
      };

      if (this.MonitorLayoutDataSubject.value.designerScreen.enableSoundAlert) {
        this.PlayCustomerCalledAlertSound();
        setTimeout(() => {
          if (this.timer) {
            console.log(newTimer);

            setTimeout(() => {
              showAnnouncementLabel();
            }, newTimer);
          } else {
            showAnnouncementLabel();
            this.timer = true;
          }
        }, 2000);
      } else {
        this.PlayCustomerCalledAlertSound();
        if (this.timer) {
          setTimeout(() => {
            showAnnouncementLabel();
          }, timeLimit);
        } else {
          showAnnouncementLabel();
          this.timer = true;
        }
      }
    } else {
      if(this.MonitorLayoutDataSubject.value?.designerScreen.enableSoundAlert) {
        this.PlayCustomerCalledAlertSound();
      }
    }

    });
  }

  private async RefreshData() {
    const browserId = JSON.parse(this.browserStorageService.kioskExecutionToken).browserId;
    const branchId = JSON.parse(this.browserStorageService.kioskExecutionToken).branchId;
    const companyId = JSON.parse(this.browserStorageService.kioskExecutionToken).companyId;
    const monitorId = JSON.parse(this.browserStorageService.kioskExecutionToken).kioskId;

    this.subs.sink = this.monitorAPIService
    .GetExecutionQueues<IMonitorExecutionQueue[]>(
      companyId,
      branchId,
      monitorId
    )
    .subscribe((executionQueues) => {
      this.BranchId = branchId;
      this.CompanyId = companyId;
      this.NowCallingsSubject.next(
        cloneObject(
          executionQueues.filter(
            (queue) => queue.customerState === QueueStatus.Called
          )
        )
      );


      this.WaitingsSubject.next(
        cloneObject(
          executionQueues.filter(
            (queue) => queue.customerState === QueueStatus.Waiting
          )
        )
      );


      this.NowServingsSubject.next(
        cloneObject(
          executionQueues.filter(
            (queue) => queue.customerState === QueueStatus.Serving
          )
        )
      );

      this.GetDynamicVariablesReplacedFromLabel(
        this.MonitorData.monitorPageData.labels
      );
    });

  }

  private InitializeMonitorLayoutData() {
    // const {
    //   browserId,
    //   branchId,
    //   companyId,
    //   kioskId: monitorId,
    // } = new JwtHelperService().decodeToken(
    //   this.browserStorageService.kioskExecutionToken
    // );

    const browserId = JSON.parse(this.browserStorageService.kioskExecutionToken).browserId;
    const branchId = JSON.parse(this.browserStorageService.kioskExecutionToken).branchId;
    const companyId = JSON.parse(this.browserStorageService.kioskExecutionToken).companyId;
    const monitorId = JSON.parse(this.browserStorageService.kioskExecutionToken).kioskId;
    this.subs.sink = this.monitorAPIService
      .GetExecutionTemplate(companyId, branchId, browserId)
      .subscribe((data: IMonitorLayoutData) => {
        this.MonitorData = data;
        this.InitializeQueueSignalR();
        this.InitializeTextToSpeachSignalR();
        this.subs.sink = this.monitorAPIService
          .GetExecutionQueues<IMonitorExecutionQueue[]>(
            companyId,
            branchId,
            monitorId
          )
          .subscribe((executionQueues) => {
            this.BranchId = branchId;
            this.CompanyId = companyId;
            this.NowCallingsSubject.next(
              cloneObject(
                executionQueues.filter(
                  (queue) => queue.customerState === QueueStatus.Called
                )
              )
            );


            this.WaitingsSubject.next(
              cloneObject(
                executionQueues.filter(
                  (queue) => queue.customerState === QueueStatus.Waiting
                )
              )
            );


            this.NowServingsSubject.next(
              cloneObject(
                executionQueues.filter(
                  (queue) => queue.customerState === QueueStatus.Serving
                )
              )
            );

            this.GetDynamicVariablesReplacedFromLabel(
              this.MonitorData.monitorPageData.labels
            );
          });
      });
  }


  GetDynamicVariableRepalcedForColumnOne(texts) {

    const languageId =
      this.MonitorData.branchMonitorLanguageCode ||
      this.MonitorData.defaultBranchLanguageCode;
    if (
      texts
    ) {
      const LabelTexts = {id:"", replacementString:''};
      LabelTexts.id = texts
      LabelTexts.replacementString = texts
      const  newArray = [];
      newArray.push(LabelTexts)
      const request = this.GenerateRequestModel();
      const workflowData = {
        workFlowId: this.MonitorData.designerScreen.workFlowId,
        pk: this.CompanyId,
      };
      this.dynamicVariablesService
        .GetDynamicVariablesReplacedStrings(newArray, workflowData, request)
        .subscribe((s: any) => {
          this.MonitorData.monitorPageData.nextUp.columnOne = s[0].replacementString
          this.MonitorData.monitorPageData.nextUp.columnTwo = s[0].replacementString
        });
    } else {
      this.SetAndPassMonitorLayoutData(this.MonitorData);
    }
  }

  GetDynamicVariablesReplacedFromLabel(Labels) {
    const languageId =
      this.MonitorData.branchMonitorLanguageCode ||
      this.MonitorData.defaultBranchLanguageCode;
    if (
      Labels.length > 0 &&
      Labels.some((x) => x.text[languageId]?.includes('%'))
    ) {
      const LabelTexts = [];
      Labels.forEach((label) => {
        LabelTexts.push({
          id: label.name,
          replacementString: label.text[languageId],
        });
      });
      const request = this.GenerateRequestModel();
      const workflowData = {
        workFlowId: this.MonitorData.designerScreen.workFlowId,
        pk: this.CompanyId,
      };
      this.dynamicVariablesService
        .GetDynamicVariablesReplacedStrings(LabelTexts, workflowData, request)
        .subscribe((s: any) => {
          Labels.forEach((x) => {
            x.text[languageId] = s.find(
              (f) => f.id === x.name
            ).replacementString;
          });
          this.MonitorData.monitorPageData.labels = Labels;
          this.SetAndPassMonitorLayoutData(this.MonitorData);
        });
    } else {
      this.SetAndPassMonitorLayoutData(this.MonitorData);
    }
  }

  GenerateRequestModel() {
    return {
      queueId: '',
      branchId: this.BranchId,
      selectedLanguageId:
        this.MonitorData.branchMonitorLanguageCode ||
        this.MonitorData.defaultBranchLanguageCode,
      requestSourceType: 'MONITOR',
      companyId: this.CompanyId,
    };
  }

  private SubscribeToAzureSignalRObservables() {
    this.azureSignalRService.refreshWindowSubject.subscribe(() => {
      window.location.reload();
    });
    this.azureSignalRService.ReconnectedSubject.subscribe(() => {
      this.RefreshData();
    });

    this.azureSignalRService.kioskDeviceSendMessageSubject.subscribe(
      (value) => {
        this.AppNotificationService.Notify(value);
        this.textToSpeechService.speak(value, "en-US");
      }
    );

    this.azureSignalRService.kioskDeRegisterSubject.subscribe(() => {
      this.browserStorageService.RemoveKioskExecutionToken();
      this.browserStorageService.RemoveKioskShutDownDetails();
      this.azureSignalRService.stopSignalRConnection();
      this.routeHandlerService.RedirectToKioskRegistrationPage();
    });

    this.azureSignalRService.kioskStandBySubject.subscribe((value) => {
      this.browserStorageService.SetKioskShutDownDetails(JSON.stringify(value));
      this.SetTimerToNavigateBackAfterShutDownHour();
      this.IsMonitorDeviceStandByModeSubject.next(
        this.IsMonitorDeviceStandByMode()
      );
    });
    this.azureSignalRService.kioskShutdownSubject.subscribe((value) => {
      this.routeHandlerService.RedirectToKioskShutdownPage(value);
    });

    this.azureSignalRService.MonitorExecutionQueueSubject.subscribe(
      (value: IMonitorExecutionQueue) => {
        if (value.isDeleted) {
          this.RemoveItemAndUpdateQueueSubject(this.WaitingsSubject, value);
          this.RemoveItemAndUpdateQueueSubject(this.NowCallingsSubject, value);
          this.RemoveItemAndUpdateQueueSubject(this.NowServingsSubject, value);
          return;
        }

        if (value.customerState === QueueStatus.Waiting) {
          this.RemoveItemAndUpdateQueueSubject(this.NowCallingsSubject, value);
          this.RemoveItemAndUpdateQueueSubject(this.NowServingsSubject, value);

          this.AddNewItemAndUpdateQueueSubject(this.WaitingsSubject, value);
        } else if (value.customerState === QueueStatus.Called) {
          let isPlaySound = true;
          let ExistData = this.IsAlreadyExistWithSameStatus(
            this.NowCallingsSubject,
            value
          );
          if (ExistData) {
            isPlaySound = false;
            if (ExistData?.calledCount < value?.calledCount) {
              isPlaySound = true;
            }
          }
          this.RemoveItemAndUpdateQueueSubject(this.NowServingsSubject, value);
          this.RemoveItemAndUpdateQueueSubject(this.WaitingsSubject, value);

          this.AddNewItemAndUpdateQueueSubject(this.NowCallingsSubject, value);
        } else if (value.customerState === QueueStatus.Serving) {
          this.RemoveItemAndUpdateQueueSubject(this.NowCallingsSubject, value);
          this.RemoveItemAndUpdateQueueSubject(this.WaitingsSubject, value);

          this.AddNewItemAndUpdateQueueSubject(this.NowServingsSubject, value);
        } else {
          this.RemoveItemAndUpdateQueueSubject(this.WaitingsSubject, value);
          this.RemoveItemAndUpdateQueueSubject(this.NowCallingsSubject, value);
          this.RemoveItemAndUpdateQueueSubject(this.NowServingsSubject, value);
        }
      }
    );
  }

  private AddNewItemAndUpdateQueueSubject(
    queuesSubject: BehaviorSubject<IMonitorExecutionQueue[]>,
    value: IMonitorExecutionQueue
  ) {
    let oldQueue: IMonitorExecutionQueue[] = queuesSubject.value;
    oldQueue = oldQueue.filter((x) => x.id !== value.id);
    const clonedQueues = this.GetCloneQueuesWithNewItemAdded(oldQueue, value);
    queuesSubject.next(clonedQueues);
  }

  private IsAlreadyExistWithSameStatus(
    queuesSubject: BehaviorSubject<IMonitorExecutionQueue[]>,
    value: IMonitorExecutionQueue
  ) {
    let found = queuesSubject.value.find(
      (x) => x.id == value.id && x.customerState == value.customerState
    );
    if (found) {
      found.calledCount = !found.calledCount ? 0 : found.calledCount;
    }
    return found;
  }

  private GetCloneQueuesWithNewItemAdded(
    queues: Array<IMonitorExecutionQueue>,
    newItem: IMonitorExecutionQueue
  ): Array<IMonitorExecutionQueue> {
    const cloneQueue = cloneObject(queues);
    cloneQueue.push(newItem);
    return cloneQueue;
  }

  private RemoveItemAndUpdateQueueSubject(
    queuesSubject: BehaviorSubject<IMonitorExecutionQueue[]>,
    value: IMonitorExecutionQueue
  ) {
    const clonedQueues = this.RemoveQueue(queuesSubject.value, value);
    queuesSubject.next(clonedQueues);
  }

  private RemoveQueue(
    queues: Array<IMonitorExecutionQueue>,
    removeItem: IMonitorExecutionQueue
  ): Array<IMonitorExecutionQueue> {
    const cloneQueue = cloneObject(queues);
    const removeIndex = cloneQueue.findIndex(
      (queue) => queue.id === removeItem.id
    );
    if (removeIndex !== -1) {
      cloneQueue.splice(removeIndex, 1);
    }
    return cloneQueue;
  }

  private PlayCustomerCalledAlertSound() {
    const audio = new Audio();
    audio.src = '../assets/audios/alert6.mp3';
    audio.load();
    audio.play();
  }

  SetTimerToNavigateBackAfterShutDownHour() {
    const shutDownDetails = this.browserStorageService.KioskShutDownDetails;
    const currentDateTime = new Date();
    const shutDownUpToDateTime = new Date(shutDownDetails.shutDownUpto);
    const isShutDown =
      shutDownUpToDateTime.getTime() >= currentDateTime.getTime();
    const timeout = shutDownUpToDateTime.getTime() - currentDateTime.getTime();
    if (isShutDown) {
      setTimeout(() => {
        this.CheckIsKioskInStandBy();
      }, timeout);
    }
  }

  CheckIsKioskInStandBy() {
    this.IsMonitorDeviceStandByModeSubject.next(
      this.IsMonitorDeviceStandByMode()
    );
  }

  private IsMonitorDeviceStandByMode() {
    const shutdownDetails = this.browserStorageService.KioskShutDownDetails;
    if (!shutdownDetails) {
      return false;
    }
    const currentDateTime = new Date();
    const shutDownUpToDateTime = new Date(shutdownDetails.shutDownUpto);
    return shutDownUpToDateTime.getTime() >= currentDateTime.getTime();
  }

  InitAzureSignalRService() {
    this.azureSignalRService.init(this.GetBrowserId());
  }

  GetBrowserId() {
    const tokenPayload = JSON.parse(this.browserStorageService.kioskExecutionToken).browserId;

    return !tokenPayload ? this.uuid : tokenPayload;
  }

  private SetAndPassMonitorLayoutData(data: IMonitorLayoutData) {
    this.ContainerHeight = data.designerScreen.height;
    this.ContainerWidth = data.designerScreen.width;
    this.Iterate(data);
    this.SelectedLanguageSubject.next(data.branchMonitorLanguageCode);
    this.DefaultLanguageSubject.next(data.defaultBranchLanguageCode);
    this.MonitorLayoutDataSubject.next(data);
  }

  private InitializeSubjectsAndObservables() {
    this.MonitorLayoutDataSubject = new BehaviorSubject<IMonitorLayoutData>(
      null
    );
    this.MonitorLayoutData$ = this.MonitorLayoutDataSubject.asObservable();
    this.IsMonitorDeviceStandByModeSubject = new BehaviorSubject<boolean>(
      this.IsMonitorDeviceStandByMode()
    );
    this.IsMonitorDeviceStandByMode$ =
      this.IsMonitorDeviceStandByModeSubject.asObservable();
    this.NowCallingsSubject = new BehaviorSubject<any>([]);
    this.NowCallings$ = this.NowCallingsSubject.asObservable().pipe(
      map((customers) => MapPosition(customers, this.QueuePositions))
    );
    this.WaitingsSubject = new BehaviorSubject<any>([]);
    this.Waitings$ = this.WaitingsSubject.asObservable().pipe(
      map((customers) => MapPosition(customers, this.QueuePositions))
    );
    this.NowServingsSubject = new BehaviorSubject<any>([]);
    this.NowServings$ = this.NowServingsSubject.asObservable();
    this.SelectedLanguageSubject = new BehaviorSubject<string>('');
    this.SelectedLanguage$ = this.SelectedLanguageSubject.asObservable();
    this.DefaultLanguageSubject = new BehaviorSubject<string>('');
    this.DefaultLanguage$ = this.DefaultLanguageSubject.asObservable();
  }

  private Iterate = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (key === 'width' || key === 'left' || key === 'titleFontSize') {
        obj[key] = this.ResizeY(obj[key] as number);
      } else if (key === 'height' || key === 'top' || key === 'fontSize') {
        obj[key] = this.ResizeX(obj[key]);
      }
      if (typeof obj[key] === 'object' && obj[key]) {
        this.Iterate(obj[key]);
      }
    });
  }

  private ResizeY(width) {
    const percentage =
      ((window.innerWidth - this.ContainerWidth) / this.ContainerWidth) * 100;
    return (width * percentage) / 100 + width;
  }

  private ResizeX(height) {
    const percentage =
      ((window.innerHeight - this.ContainerHeight) / this.ContainerHeight) *
      100;
    return (height * percentage) / 100 + height;
  }
}

function UpdateSubject<T>(subject: BehaviorSubject<T>) {
  let oldValue = subject.getValue();
  subject.next(cloneObject(oldValue));
}
function MapPosition(
  customers: IMonitorExecutionQueue[],
  QueuePositions: IQueue
): IMonitorExecutionQueue[] {
  let tempCustomers = customers;
  if (
    QueuePositions &&
    QueuePositions.customers &&
    QueuePositions.customers.length > 0
  ) {
    tempCustomers.forEach((x) => {
      let index = QueuePositions.customers.findIndex((y) => y.id == x.id);
      x.sortPosition = +(index + 1);
    });
  }
  return tempCustomers;
}
