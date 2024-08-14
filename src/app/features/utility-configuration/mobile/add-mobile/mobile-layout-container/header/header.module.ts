import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderComponent } from './header.component';

@NgModule({
  imports: [SharedModule],
  exports: [SharedModule, HeaderComponent],
  declarations: [HeaderComponent],
  providers: [],
})
export class MobileHeaderModule {}
