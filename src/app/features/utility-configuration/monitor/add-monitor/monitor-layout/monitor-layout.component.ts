import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { NextUpService } from './monitor-default-control/next-up/next-up.service';
import { NowCallingService } from './monitor-default-control/now-calling/now-calling.service';
import { NowHelpingService } from './monitor-default-control/now-helping/now-helping.service';
import { MonitorLayoutService } from './monitor-layout.service';

@Component({
  selector: 'lavi-monitor-layout',
  templateUrl: './monitor-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MonitorLayoutService,
    NextUpService,
    NowCallingService,
    NowHelpingService,
  ],
})
export class MonitorLayoutComponent extends AbstractComponent {}
