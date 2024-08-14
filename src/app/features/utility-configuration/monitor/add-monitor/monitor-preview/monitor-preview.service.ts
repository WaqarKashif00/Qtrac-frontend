import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IndexDBService } from 'src/app/core/services/index-db.service';
import {
  IndexDBLayoutDataKeys, IndexDBStoreNames
} from 'src/app/models/constants/index-db.constant';
import { QueueStatus } from 'src/app/models/enums/queue-status.enum';
import { TextToSpeechSignalRService } from '../../../agent/utility-services/services/agent-signalR/text-to-speech-signalr.service';
import { IMonitorExecutionQueue } from '../monitor-layout/Models/monitor-execution-queue.interface';
import { IMonitorLayoutData } from '../monitor-layout/Models/monitor-layout-data';

@Injectable()
export class MonitorPreviewService extends AbstractComponentService {
  private MonitorLayoutDataSubject: BehaviorSubject<IMonitorLayoutData>;
  MonitorLayoutData$: Observable<IMonitorLayoutData>;
  ContainerWidth: number;
  ContainerHeight: number;
  private NowCallingsSubject: BehaviorSubject<IMonitorExecutionQueue[]>;
  NowCallings$: Observable<IMonitorExecutionQueue[]>;
  private WaitingsSubject: BehaviorSubject<IMonitorExecutionQueue[]>;
  Waitings$: Observable<IMonitorExecutionQueue[]>;
  private NowServingsSubject: BehaviorSubject<IMonitorExecutionQueue[]>;
  NowServings$: Observable<IMonitorExecutionQueue[]>;
  CurrentLanguageId: string;
  DefaultLanguageId: any;

  constructor(private idbService: IndexDBService, private route: ActivatedRoute,) {
    super();
    this.InitializeSubjectsAndObservables();
    this.InitializeMonitorLayoutData();
  }

  private InitializeSubjectsAndObservables() {
    this.MonitorLayoutDataSubject = new BehaviorSubject<IMonitorLayoutData>(
      null
    );
    this.MonitorLayoutData$ = this.MonitorLayoutDataSubject.asObservable();
    this.NowCallingsSubject = new BehaviorSubject<IMonitorExecutionQueue[]>([
      {
        ticketNumber: 'A008',
        deskName: 'DESK 3',
        branchId: null,
        customerState: QueueStatus.Called,
        isDeleted: false,
        monitorId: null,
        personName: null,
        companyId: null,
        id: null,
        queueId: null,
        calledCount : null,
        calledRequeueCount: null,
        sortPosition: 1,
      },
    ]);
    this.NowCallings$ = this.NowCallingsSubject.asObservable();
    this.WaitingsSubject = new BehaviorSubject<IMonitorExecutionQueue[]>([
      {
        ticketNumber: 'B008',
        deskName: 'DESK 3',
        branchId: null,
        customerState: QueueStatus.Waiting,
        isDeleted: false,
        monitorId: null,
        personName: 'MARY',
        companyId: null,
        id: null,
        queueId: null,
        calledCount : null,
        calledRequeueCount: null,
        sortPosition: 1

      },
      {
        ticketNumber: 'B009',
        deskName: 'DESK 3',
        branchId: null,
        customerState: QueueStatus.Waiting,
        isDeleted: false,
        monitorId: null,
        personName: 'PETER',
        companyId: null,
        id: null,
        queueId: null,
        calledCount : null,
        calledRequeueCount: null,
        sortPosition: 1
      },
      {
        ticketNumber: 'A012',
        deskName: 'DESK 3',
        branchId: null,
        customerState: QueueStatus.Waiting,
        isDeleted: false,
        monitorId: null,
        personName: 'SEAN',
        companyId: null,
        id: null,
        queueId: null,
        calledCount : null,
        calledRequeueCount: null,
        sortPosition: 1
      },
      {
        ticketNumber: 'A013',
        deskName: 'DESK 3',
        branchId: null,
        customerState: QueueStatus.Waiting,
        isDeleted: false,
        monitorId: null,
        personName: 'DAISY',
        companyId: null,
        id: null,
        queueId: null,
        calledCount : null,
        calledRequeueCount: null,
        sortPosition: 1
      },
    ]);
    this.Waitings$ = this.WaitingsSubject.asObservable();
    this.NowServingsSubject = new BehaviorSubject<IMonitorExecutionQueue[]>([
      {
        ticketNumber: 'A002',
        deskName: 'DESK 1',
        branchId: null,
        customerState: QueueStatus.Serving,
        isDeleted: false,
        monitorId: null,
        personName: 'MARY',
        companyId: null,
        id: null,
        queueId: null,
        calledCount : null,
        calledRequeueCount: null,
        sortPosition: 1
      },
      {
        ticketNumber: 'B007',
        deskName: 'DESK 2',
        branchId: null,
        customerState: QueueStatus.Serving,
        isDeleted: false,
        monitorId: null,
        personName: 'MARY',
        companyId: null,
        id: null,
        queueId: null,
        calledCount : null,
        calledRequeueCount: null,
        sortPosition: 1
      },
      {
        ticketNumber: 'C009',
        deskName: 'DESK 4',
        branchId: null,
        customerState: QueueStatus.Serving,
        isDeleted: false,
        monitorId: null,
        personName: 'MARY',
        companyId: null,
        id: null,
        queueId: null,
        calledCount : null,
        calledRequeueCount: null,
        sortPosition: 1
      },
      {
        ticketNumber: 'A003',
        deskName: 'DESK 7',
        branchId: null,
        customerState: QueueStatus.Serving,
        isDeleted: false,
        monitorId: null,
        personName: 'MARY',
        companyId: null,
        id: null,
        queueId: null,
        calledCount : null,
        calledRequeueCount: null,
        sortPosition: 1
      },
    ]);
    this.NowServings$ = this.NowServingsSubject.asObservable();
  }

  private async InitializeMonitorLayoutData() {
    this.CurrentLanguageId = this.route.snapshot.queryParams.lng;
    this.DefaultLanguageId = this.route.snapshot.queryParams.d_lng;

    const MonitorPageData = (await this.idbService.Get(
      IndexDBStoreNames.LayoutData,
      IndexDBLayoutDataKeys.MonitorLayoutData
    )) as IMonitorLayoutData;
    this.SetAndPassMonitorLayoutData(MonitorPageData);
  }

  private SetAndPassMonitorLayoutData(data: IMonitorLayoutData) {
    this.ContainerHeight = data.designerScreen.height;
    this.ContainerWidth = data.designerScreen.width;
    this.Iterate(data);
    this.MonitorLayoutDataSubject.next(data);
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
