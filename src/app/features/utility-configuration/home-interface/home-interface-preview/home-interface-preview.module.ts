import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HomeInterfacePreviewExecutionSharedModule } from '../preview-execution-shared/preview-execution-shared.module';
import { HomeInterfacePreviewComponent } from './home-interface-preview.component';
@NgModule({
  imports: [HomeInterfacePreviewExecutionSharedModule],
  declarations: [HomeInterfacePreviewComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HomeInterfacePreviewModule {}
