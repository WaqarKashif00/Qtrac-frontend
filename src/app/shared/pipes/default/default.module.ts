import { NgModule } from '@angular/core';
import { DefaultPipe } from './default.pipe';

@NgModule({
  exports: [
    DefaultPipe
  ],
  declarations: [
    DefaultPipe
  ],
})
export class DefaultPipeModule {}
