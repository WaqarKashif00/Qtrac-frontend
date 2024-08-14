import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicBoldTextPipe } from 'src/app/shared/pipes/dynamic-bold-text/dynamic-bold-text.pipe';
import { MobilePreviewExecutionExecutionSharedModule } from '../preview-execution-shared/preview-execution-shared.module';
import { ExecutionMobileComponent } from './execution-mobile.component';

export const ExecutionMobileRoutes: Routes = [
  {
    path: ':company-id/:branch-id/:mobile-interface-id',
    component: ExecutionMobileComponent
  },
];
@NgModule({
  imports: [
    MobilePreviewExecutionExecutionSharedModule,
    RouterModule.forChild(ExecutionMobileRoutes)
  ],
  exports: [],
  declarations: [ExecutionMobileComponent],
  providers: [DynamicBoldTextPipe]
})
export class ExecutionMobileModule { }
