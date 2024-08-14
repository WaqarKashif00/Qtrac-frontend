import { NgModule } from '@angular/core';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NumberModule } from '../../directives/only-number/only-number.module';
import { LaviPhoneNumberComponent } from './phone-number.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    Ng2TelInputModule,
    NumberModule,
    CommonModule
  ],
  declarations: [LaviPhoneNumberComponent],
  exports: [LaviPhoneNumberComponent]
})
export class LaviPhoneNumberModule {

}
