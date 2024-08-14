import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MonitorPreviewExecutionSharedModule } from '../../preview-execution-shared/preview-execution-shared.module';
import { MonitorPreviewComponent } from './monitor-preview.component';
@NgModule({
  imports: [MonitorPreviewExecutionSharedModule],
  declarations: [MonitorPreviewComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MonitorPreviewModule {}
