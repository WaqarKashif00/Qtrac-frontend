import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { LaviAnswerFormatterPipe } from './answer-formatter.pipe';
@NgModule({
  exports: [
    LaviAnswerFormatterPipe
  ],
  declarations: [
    LaviAnswerFormatterPipe
  ],
  providers: [
    DatePipe
  ]
})
export class LaviAnswerFormatterPipeModule {}
