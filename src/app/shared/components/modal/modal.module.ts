import { NgModule } from '@angular/core';
import { ModalComponent } from './modal.component';
import { WindowModule, DialogModule } from '@progress/kendo-angular-dialog';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [DialogModule,
    WindowModule, CommonModule
  ],
  exports: [
    DialogModule,
    ModalComponent,
    WindowModule
  ],
  declarations: [
    ModalComponent
  ],
})
export class ModalModule {}
