import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KioskPreviewExecutionSharedModule } from '../../previw-execution-shared/preview-execution-shared.module';
import { KioskPreviewComponent } from './kiosk-preview.component';

export const KioskExecutionRoutes: Routes = [
  { path: '', component: KioskPreviewComponent },
];

@NgModule({
  imports: [KioskPreviewExecutionSharedModule, RouterModule.forChild(KioskExecutionRoutes)],
  declarations: [
    KioskPreviewComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class KioskPreviewModule { }
