import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MobileListComponent } from './list-mobiles.component';

@NgModule({
  imports: [SharedModule],
  exports: [MobileListComponent],
  declarations: [MobileListComponent],
  providers: [],
})
export class ListMobileModule {}
