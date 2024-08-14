import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PreviewFooterComponent } from './preview-footer/preview-footer.component';
import { PreviewImageComponent } from './preview-image/preview-image.component';
import { PreviewLabelComponent } from './preview-label/preview-label.component';
import { PreviewSliderComponent } from './preview-slider/preview-slider.component';
import { PreviewVideoComponent } from './preview-video/preview-video.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    PreviewImageComponent,
    PreviewLabelComponent,
    PreviewVideoComponent,
    PreviewSliderComponent,
    PreviewFooterComponent,
  ],
  exports: [
    PreviewImageComponent,
    PreviewLabelComponent,
    SharedModule,
    PreviewVideoComponent,
    PreviewSliderComponent,
    PreviewFooterComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HomeInterfacePreviewExecutionSharedModule {}
