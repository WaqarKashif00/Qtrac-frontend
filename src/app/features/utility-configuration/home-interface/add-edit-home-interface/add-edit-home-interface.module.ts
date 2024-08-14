import { NgModule } from '@angular/core';
import { HomeInterfacePreviewModule } from '../home-interface-preview/home-interface-preview.module';
import { AddEditHomeInterfaceComponent } from './add-edit-home-interface.component';
import { HomeInterfaceLayoutModule } from './home-interface-layout/home-interface-layout.module';

@NgModule({
  declarations: [AddEditHomeInterfaceComponent],
  imports: [HomeInterfaceLayoutModule, HomeInterfacePreviewModule],
  exports: [AddEditHomeInterfaceComponent],
})
export class AddEditHomeInterfaceModule {}
