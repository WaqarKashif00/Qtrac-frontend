import { NgModule } from '@angular/core';
import { PasswordDirective } from './password.directive';

@NgModule({
  exports: [
    PasswordDirective
  ],
  declarations: [PasswordDirective
  ],
})
export class PasswordModule {}
