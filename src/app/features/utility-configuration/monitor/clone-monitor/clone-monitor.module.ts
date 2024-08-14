import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueueSignalRService } from '../../agent/utility-services/services/agent-signalR/queue-signalr.service';
import { TextToSpeechSignalRService } from '../../agent/utility-services/services/agent-signalR/text-to-speech-signalr.service';
import { MonitorPreviewExecutionSharedModule } from '../preview-execution-shared/preview-execution-shared.module';
import { CloneMonitorComponent } from './clone-monitor.component';

const CloneMonitorRoutes: Routes = [{
  path: '',
  component: CloneMonitorComponent
}]

@NgModule({
  imports: [
    MonitorPreviewExecutionSharedModule,
    RouterModule.forChild(CloneMonitorRoutes)
  ],
  declarations: [
    CloneMonitorComponent,
  ],
  providers:[QueueSignalRService, TextToSpeechSignalRService]
})
export class CloneMonitorModule {}
