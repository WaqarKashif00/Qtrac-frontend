import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularDraggableModule } from 'angular2-draggable';
import { SharedModule } from '../../../../../shared/shared.module';
import { HomeInterfaceFooterComponent } from './home-interface-footer/home-interface-footer.component';
import { HomeInterfaceHeaderComponent } from './home-interface-header/home-interface-header.component';
import { HomeInterfaceLayoutComponent } from './home-interface-layout.component';
import { HomeInterfaceDesignerFooterComponent } from './home-interface-template/home-interface-designer-footer/home-interface-designer-footer.component';
import { HomeInterfaceMiddleContainerComponent } from './home-interface-template/home-interface-middle-container/home-interface-middle-container.component';
import { ImageControlComponent } from './home-interface-template/home-interface-middle-container/middle-container-controls/image-control/image-control.component';
import { LabelControlComponent } from './home-interface-template/home-interface-middle-container/middle-container-controls/label-control/label-control.component';
import { SliderControlComponent } from './home-interface-template/home-interface-middle-container/middle-container-controls/slider-control/slider-control.component';
import { VideoControlComponent } from './home-interface-template/home-interface-middle-container/middle-container-controls/video-control/video-control.component';
import { HomeInterfaceFontComponent } from './home-interface-template/home-interface-property/font-property/home-interface-font-property.component';
import { HomeInterfaceLayoutControlPropertyComponent } from './home-interface-template/home-interface-property/home-interface-layout-control-property/home-interface-layout-control-property.component';
import { HomeInterfacePropertyComponent } from './home-interface-template/home-interface-property/home-interface-property.component';
import { HomeInterfaceImageFormComponent } from './home-interface-template/home-interface-property/monitor-other-control-property/home-interface-image-form/home-interface-image-form.component';
import { HomeInterfaceLabelFormComponent } from './home-interface-template/home-interface-property/monitor-other-control-property/home-interface-label-form/home-interface-label-form.component';
import { HomeInterfaceSliderFormComponent } from './home-interface-template/home-interface-property/monitor-other-control-property/home-interface-slider-form/home-interface-slider-form.component';
import { HomeInterfaceVideoFormComponent } from './home-interface-template/home-interface-property/monitor-other-control-property/home-interface-video-form/home-interface-video-form.component';
import { HomeInterfaceTemplateComponent } from './home-interface-template/home-interface-template.component';
import { HomeInterfaceToolBoxComponent } from './home-interface-template/home-interface-toolbox/home-interface-toolbox.component';


@NgModule({
  declarations: [
    HomeInterfaceLayoutComponent,
    HomeInterfaceHeaderComponent,
    HomeInterfaceFooterComponent,
    HomeInterfaceTemplateComponent,
    HomeInterfaceToolBoxComponent,
    HomeInterfaceMiddleContainerComponent,
    ImageControlComponent,
    LabelControlComponent,
    SliderControlComponent,
    VideoControlComponent,
    HomeInterfaceLayoutControlPropertyComponent,
    HomeInterfacePropertyComponent,
    HomeInterfaceImageFormComponent,
    HomeInterfaceLabelFormComponent,
    HomeInterfaceVideoFormComponent,
    HomeInterfaceSliderFormComponent,
    HomeInterfaceFontComponent,
    HomeInterfaceDesignerFooterComponent
  ],
  imports: [SharedModule, AngularDraggableModule],
  exports: [SharedModule, HomeInterfaceLayoutComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HomeInterfaceLayoutModule {}
