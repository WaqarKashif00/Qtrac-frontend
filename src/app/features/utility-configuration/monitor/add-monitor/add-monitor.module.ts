import { NgModule } from '@angular/core';
import { AddMonitorComponent } from './add-monitor.component';
import { MonitorLayoutModule } from './monitor-layout/monitor-layout.module';
import { MonitorPreviewModule } from './monitor-preview/monitor-preview.module';

@NgModule({
  declarations: [AddMonitorComponent],
  imports: [MonitorLayoutModule, MonitorPreviewModule],
  exports: [AddMonitorComponent],
})
export class AddMonitorModule {}
