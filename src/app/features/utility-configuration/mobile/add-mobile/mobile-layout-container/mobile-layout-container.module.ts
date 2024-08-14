import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularDraggableModule } from 'angular2-draggable';
import { SharedModule } from 'src/app/shared/shared.module';
import { MobileHeaderModule } from './header/header.module';
import { MobileLayoutContainerComponent } from './mobile-layout-container.component';
import { TemplateModule } from './template-layout/template-layout.module';

@NgModule({
  imports: [MobileHeaderModule, TemplateModule,SharedModule],
  exports: [MobileLayoutContainerComponent, SharedModule],
  declarations: [MobileLayoutContainerComponent],
  providers: [],

})
export class MobilLayoutContainerModule {}
