import { NgModule } from '@angular/core';
import { NumberDirective } from './only-number.directive';

@NgModule({
  exports: [
    NumberDirective
  ],
  declarations: [NumberDirective
  ],
})
export class NumberModule {}
