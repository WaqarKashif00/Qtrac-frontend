import { NgModule } from '@angular/core';
import { QuoteStringPipe } from './quote-string.pipe';
@NgModule({
  exports: [
    QuoteStringPipe
  ],
  declarations: [
    QuoteStringPipe
  ],
})
export class QuoteStringPipeModule {}
