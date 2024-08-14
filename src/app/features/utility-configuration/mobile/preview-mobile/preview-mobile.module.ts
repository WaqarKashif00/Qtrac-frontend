import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobilePreviewExecutionExecutionSharedModule } from '../preview-execution-shared/preview-execution-shared.module';
import { MobilePreviewComponent } from './preview-mobile.component';

export const MobilePreviewRoutes: Routes = [
  { path: '', component: MobilePreviewComponent },
];

@NgModule({
  imports: [
    MobilePreviewExecutionExecutionSharedModule,
    RouterModule.forChild(MobilePreviewRoutes),
  ],
  declarations: [MobilePreviewComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MobilePreviewModule {}
