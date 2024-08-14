import { NgModule } from '@angular/core';
import { ErrorComponent } from './error.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ErrorComponent],
  imports: [SharedModule],
  exports: []
})
export class ErrorModule { }
