import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MonitorHeaderComponent } from './monitor-header/monitor-header.component';
import { MonitorLayoutComponent } from './monitor-layout.component';
import { ImageControlComponent } from './monitor-template/monitor-middle-container/middle-container-controls/image-control/image-control.component';
import { LabelControlComponent } from './monitor-template/monitor-middle-container/middle-container-controls/label-control/label-control.component';
import { SliderControlComponent } from './monitor-template/monitor-middle-container/middle-container-controls/slider-control/slider-control.component';
import { MonitorMiddleContainerComponent } from './monitor-template/monitor-middle-container/monitor-middle-container.component';
import { MonitorTemplateComponent } from './monitor-template/monitor-template.component';
import { MonitorToolBoxComponent } from './monitor-template/monitor-tool-box/monitor-tool-box.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { MonitorPropertyComponent } from './monitor-template/monitor-property/monitor-property.component';
import { MonitorLayoutControlPropertyComponent } from './monitor-template/monitor-property/monitor-layout-control-property/monitor-layout-control-property.component';
import { MonitorImageFormComponent } from './monitor-template/monitor-property/monitor-other-control-property/monitor-image-form/monitor-image-form.component';
import { MonitorSliderFormComponent } from './monitor-template/monitor-property/monitor-other-control-property/monitor-slider-form/monitor-slider-form.component';
import { MonitorLabelFormComponent } from './monitor-template/monitor-property/monitor-other-control-property/monitor-label-form/monitor-label-form.component';
import { FontComponent } from './monitor-template/monitor-property/font-property/font-property.component';
import { NextUpComponent } from './monitor-default-control/next-up/default-control/next-up.component';
import { NowCallingComponent } from './monitor-default-control/now-calling/default-control/now-calling.component';
import { NowHelpingComponent } from './monitor-default-control/now-helping/default-control/now-helping.component';
import { MonitorLayoutHeaderComponent } from './monitor-default-control/monitor-layout-header/default-control/monitor-layout-header.component';
import { MonitorHeaderPropertyComponent } from './monitor-default-control/monitor-layout-header/property-control/monitor-header-property.component';
import { NowCallingPropertyComponent } from './monitor-default-control/now-calling/property-control/now-calling-property.component';
import { NowHelpingPropertyComponent } from './monitor-default-control/now-helping/property-control/now-helping-property.component';
import { MonitorDefaultControlComponent } from './monitor-default-control/monitor-default-control.component';
import { TitleFontComponent } from './monitor-template/monitor-property/title-font-property/title-font-property.component';
import { NextUpPropertyComponent } from './monitor-default-control/next-up/property-control/next-up-property.component';
import { VideoControlComponent } from './monitor-template/monitor-middle-container/middle-container-controls/video-control/video-control.component';
import { MonitorVideoFormComponent } from './monitor-template/monitor-property/monitor-other-control-property/monitor-video-form/monitor-video-form.component';
import { ControlPositionPipeModule } from '../../pipes/control-position/control-position.module';

@NgModule({
  declarations: [
    MonitorLayoutComponent,
    MonitorHeaderComponent,
    MonitorToolBoxComponent,
    MonitorTemplateComponent,
    LabelControlComponent,
    VideoControlComponent,
    ImageControlComponent,
    SliderControlComponent,
    MonitorMiddleContainerComponent,
    MonitorPropertyComponent,
    MonitorLayoutControlPropertyComponent,
    MonitorImageFormComponent,
    MonitorSliderFormComponent,
    MonitorLabelFormComponent,
    MonitorVideoFormComponent,
    FontComponent,
    TitleFontComponent,
    NextUpComponent,
    NowCallingComponent,
    NowHelpingComponent,
    MonitorDefaultControlComponent,
    MonitorLayoutHeaderComponent,
    MonitorHeaderPropertyComponent,
    NowCallingPropertyComponent,
    NowHelpingPropertyComponent,
    NextUpPropertyComponent,
  ],
  imports: [SharedModule, AngularDraggableModule, ControlPositionPipeModule],
  exports: [SharedModule, MonitorLayoutComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MonitorLayoutModule {}
