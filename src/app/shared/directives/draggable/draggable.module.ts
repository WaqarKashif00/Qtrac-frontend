import { NgModule } from '@angular/core';
import { DragDirective } from './draggable.directive';
@NgModule({
  exports: [
    DragDirective
  ],
  declarations: [DragDirective
  ],
})
export class DraggableModule {}
