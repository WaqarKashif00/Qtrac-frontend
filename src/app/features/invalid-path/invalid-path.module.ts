import { NgModule } from '@angular/core';
import { InvalidPathComponent } from './invalid-path.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [InvalidPathComponent],
  imports: [SharedModule],
  exports: []
})
export class InvalidPathModule { }
