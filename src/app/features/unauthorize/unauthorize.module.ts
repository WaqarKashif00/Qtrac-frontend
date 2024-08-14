import { NgModule } from '@angular/core';
import { UnauthorizeComponent } from './unauthorize.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [UnauthorizeComponent],
  imports: [SharedModule],
  exports: []
})
export class UnauthorizeModule { }
