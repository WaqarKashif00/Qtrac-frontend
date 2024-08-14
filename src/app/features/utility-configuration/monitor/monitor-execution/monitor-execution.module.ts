import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueueSignalRService } from '../../agent/utility-services/services/agent-signalR/queue-signalr.service';
import { TextToSpeechSignalRService } from '../../agent/utility-services/services/agent-signalR/text-to-speech-signalr.service';
import { MonitorPreviewExecutionSharedModule } from '../preview-execution-shared/preview-execution-shared.module';
import { MonitorExecutionComponent } from './monitor-execution.component';

const MonitorExecutionRoutes: Routes = [{
  path: '',
  component: MonitorExecutionComponent
}]

@NgModule({
  imports: [
    MonitorPreviewExecutionSharedModule,
    RouterModule.forChild(MonitorExecutionRoutes)
  ],
  declarations: [
    MonitorExecutionComponent,
  ],
  providers:[QueueSignalRService, TextToSpeechSignalRService]
})
export class MonitorExecutionModule {}
