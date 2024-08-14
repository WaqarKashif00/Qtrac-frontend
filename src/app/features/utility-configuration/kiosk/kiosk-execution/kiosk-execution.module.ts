import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KioskPreviewExecutionSharedModule } from '../previw-execution-shared/preview-execution-shared.module';
import { KioskExecutionComponent } from './kiosk-execution.component';

const KioskExecutionRoutes: Routes = [{
  path: '',
  component: KioskExecutionComponent
}]
@NgModule({
  imports: [
    KioskPreviewExecutionSharedModule,
    RouterModule.forChild(KioskExecutionRoutes)
  ],
  declarations: [
    KioskExecutionComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class KioskExecutionModule {}