import { NgModule } from '@angular/core';
import { AppValidationComponent } from './app-validation/app-validation.component';
import { AppValidationListComponent } from './app-validation-list/app-validation-list.component';
import { CommonModule } from '@angular/common';
@NgModule({
  imports: [CommonModule],
  exports: [
    AppValidationListComponent,
    AppValidationComponent,
    CommonModule
  ],
  declarations: [
    AppValidationComponent,
    AppValidationListComponent
  ],
})
export class ValidationModule {}
