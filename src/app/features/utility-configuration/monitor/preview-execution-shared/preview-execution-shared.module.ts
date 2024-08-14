import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TextToSpeechSignalRService } from '../../agent/utility-services/services/agent-signalR/text-to-speech-signalr.service';
import { PreviewCallingNowComponent } from './preview-calling-now/preview-calling-now.component';
import { PreviewHelpingNowComponent } from './preview-helping-now/preview-helping-now.component';
import { PreviewImageComponent } from './preview-image/preview-image.component';
import { PreviewLabelAnnoucementComponent } from './preview-label-announcement/preview-label-announcement.component';
import { PreviewLabelComponent } from './preview-label/preview-label.component';
import { PreviewNextUPComponent } from './preview-next-up/preview-next-up.component';
import { PreviewSliderComponent } from './preview-slider/preview-slider.component';
import { PreviewVideoComponent } from './preview-video/preview-video.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    PreviewImageComponent,
    PreviewLabelComponent,
    PreviewNextUPComponent,
    PreviewCallingNowComponent,
    PreviewHelpingNowComponent,
    PreviewVideoComponent,
    PreviewSliderComponent,
    PreviewLabelAnnoucementComponent
   
  ],
  exports: [
    PreviewImageComponent,
    PreviewLabelComponent,
    SharedModule,
    PreviewNextUPComponent,
    PreviewCallingNowComponent,
    PreviewHelpingNowComponent,
    PreviewVideoComponent,
    PreviewSliderComponent,
    PreviewLabelAnnoucementComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [TextToSpeechSignalRService]
})
export class MonitorPreviewExecutionSharedModule {}
