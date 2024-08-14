import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMonitorExecutionQueue } from '../monitor-layout/Models/monitor-execution-queue.interface';
import { IMonitorLayoutData } from '../monitor-layout/Models/monitor-layout-data';
import { MonitorPreviewService } from './monitor-preview.service';

@Component({
  selector: 'lavi-monitor-preview',
  templateUrl: './monitor-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MonitorPreviewService],
})
export class MonitorPreviewComponent extends AbstractComponent {
  MonitorPageData$: Observable<IMonitorLayoutData>;
  NowCallings$: Observable<IMonitorExecutionQueue[]>;
  Waitings$: Observable<IMonitorExecutionQueue[]>;
  NowServings$: Observable<IMonitorExecutionQueue[]>;
  SelectedLanguage: string;
  DefaultLanguage: string;

  constructor(private previewService: MonitorPreviewService) {
    super();
    this.MonitorPageData$ = this.previewService.MonitorLayoutData$;
    this.NowCallings$ = this.previewService.NowCallings$;
    this.Waitings$ = this.previewService.Waitings$;
    this.NowServings$ = this.previewService.NowServings$;
  }
  Init(){
    this.SelectedLanguage = this.previewService.CurrentLanguageId;
    this.DefaultLanguage = this.previewService.DefaultLanguageId;
  }

  /* #endregion */
}
