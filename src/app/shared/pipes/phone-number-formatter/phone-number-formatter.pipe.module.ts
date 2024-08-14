import { NgModule } from '@angular/core';
import { LaviPhoneNumberFormatterPipe } from './phone-number-formatter.pipe';

@NgModule({
    declarations: [
        LaviPhoneNumberFormatterPipe
    ],
    exports: [
      LaviPhoneNumberFormatterPipe
    ]
})
export class LaviPhoneNumberFormatPipeModule { }
