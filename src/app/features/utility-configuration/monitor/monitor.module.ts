import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MonitorRoutes } from 'src/app/routes/utility-configuration.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { TextToSpeechSignalRService } from '../agent/utility-services/services/agent-signalR/text-to-speech-signalr.service';
import { AddMonitorModule } from './add-monitor/add-monitor.module';
import { MonitorComponent } from './monitor.component';
import { MonitorService } from './monitor.service';

@NgModule({
  declarations: [MonitorComponent],
  imports: [
    SharedModule,
    AddMonitorModule,
    RouterModule.forChild(MonitorRoutes),
  ],
  providers: [MonitorService,TextToSpeechSignalRService]
})
export class MonitorModule {}
