import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMonitorExecutionQueue } from '../add-monitor/monitor-layout/Models/monitor-execution-queue.interface';
import { IMonitorLayoutData } from '../add-monitor/monitor-layout/Models/monitor-layout-data';
import { MonitorExecutionService } from './monitor-execution.service';
@Component({
  selector: 'lavi-monitor-execution',
  templateUrl: './monitor-execution.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MonitorExecutionService],
  styleUrls: ['./monitor-execution.component.scss']
})
export class MonitorExecutionComponent extends AbstractComponent {
  MonitorLayoutData$: Observable<IMonitorLayoutData>;
  IsMonitorDeviceStandByMode$: Observable<boolean>;
  NowCallings$: Observable<IMonitorExecutionQueue[]>;
  Waitings$: Observable<IMonitorExecutionQueue[]>;
  NowServings$: Observable<IMonitorExecutionQueue[]>;
  SelectedLanguage$: Observable<string>;
  DefaultLanguage$: Observable<string>;


  get ShutDownMessage() {
    return this.service.browserStorageService.KioskShutDownDetails?.message;
  }

  constructor(private service: MonitorExecutionService, private changeDetector: ChangeDetectorRef) {
    super();
    this.InitializeObservables();
  }

  Init() {
    this.service.InitAzureSignalRService();
    this.service.CheckIsKioskInStandBy();
    this.service.SetTimerToNavigateBackAfterShutDownHour();
  }

  private InitializeObservables() {
    this.MonitorLayoutData$ = this.service.MonitorLayoutData$;
    this.IsMonitorDeviceStandByMode$ = this.service.IsMonitorDeviceStandByMode$;
    this.NowCallings$ = this.service.NowCallings$;
    this.Waitings$ = this.service.Waitings$;
    this.NowServings$ = this.service.NowServings$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.DefaultLanguage$ = this.service.DefaultLanguage$;
  }

  

  /* #endregion */
}
