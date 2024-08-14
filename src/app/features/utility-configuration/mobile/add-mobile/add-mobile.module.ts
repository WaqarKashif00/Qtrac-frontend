import { NgModule } from '@angular/core';
import { AddMobileComponent } from './add-mobile.component';
import { MobilLayoutContainerModule } from './mobile-layout-container/mobile-layout-container.module';

@NgModule({
  imports: [MobilLayoutContainerModule],
  exports: [],
  declarations: [AddMobileComponent],
  providers: [],
})
export class AddMobileModule {}
