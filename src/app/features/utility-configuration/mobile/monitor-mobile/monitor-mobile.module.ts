import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicBoldTextPipe } from 'src/app/shared/pipes/dynamic-bold-text/dynamic-bold-text.pipe';
import { QueueSignalRService } from '../../agent/utility-services/services/agent-signalR/queue-signalr.service';
import { MobilePreviewExecutionExecutionSharedModule } from '../preview-execution-shared/preview-execution-shared.module';
import { MonitorMobileComponent } from './monitor-mobile.component';

export const MonitorMobileRoutes: Routes = [
  {
    path: ':company-id/:branch-id/:mobile-interface-id/:kiosk-request-id',
    component: MonitorMobileComponent
  },
];
@NgModule({
  imports: [
    MobilePreviewExecutionExecutionSharedModule,
    RouterModule.forChild(MonitorMobileRoutes),
  ],
  exports: [],
  declarations: [MonitorMobileComponent],
  providers: [DynamicBoldTextPipe,QueueSignalRService]
})
export class MonitorMobileModule { }
