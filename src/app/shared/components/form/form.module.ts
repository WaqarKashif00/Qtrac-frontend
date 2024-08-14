import { NgModule } from '@angular/core';
import { FormComponent } from './form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FocusInvalidInputModule } from '../../directives/focus-invalid-input/focus-invalid-input.module';
import { FocusFirstInputModule } from '../../directives/focus-first-input/focus-first-input.module';
@NgModule({
  imports: [ReactiveFormsModule,
    FocusInvalidInputModule,
    FocusFirstInputModule,
    FormsModule
  ],
  exports: [
    FormsModule,
    FormComponent,
    ReactiveFormsModule,
    FocusInvalidInputModule,
    FocusFirstInputModule
  ],
  declarations: [
    FormComponent
  ],
})
export class FormModule {}
