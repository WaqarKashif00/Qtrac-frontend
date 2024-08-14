import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { KioskLanguageComponent } from './kiosk-language/kiosk-language.component';
import { KioskNoQueueComponent } from './kiosk-no-queue/kiosk-no-queue.component';
import { KioskOffLineComponent } from './kiosk-off-line-page/kiosk-off-line-page.component';
import { KioskPreServiceQuestionComponent } from './kiosk-pre-service-question/kiosk-pre-service-question.component';
import { KioskServiceQuestionComponent } from './kiosk-service-question/kiosk-service-question.component';
import { KioskServiceComponent } from './kiosk-services/kiosk-service.component';
import { KioskThankYouComponent } from './kiosk-thank-you/kiosk-thank-you.component';
import { KioskWelcomeComponent } from './kiosk-welcome/kiosk-welcome.component';
import { PreviewButtonComponent } from './preview-button/preview-button.component';
import { PreviewImageComponent } from './preview-image/preview-image.component';
import { PreviewInputControlsComponent } from './preview-input-controls/preview-input-controls.component';
import { PreviewLabelComponent } from './preview-label/preview-label.component';
import { PreviewSliderComponent } from './preview-slider/preview-slider.component';
import { PreviewVideoComponent } from './preview-video/preview-video.component';
import { SingleQuestionModeComponent } from './single-question-mode/single-question-mode.component';
import { VerticalQuestionModeComponent } from './vertical-question-mode/vertical-question-mode.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    KioskPreServiceQuestionComponent,
    KioskServiceQuestionComponent,
    KioskServiceComponent,
    KioskThankYouComponent,
    KioskOffLineComponent,
    KioskWelcomeComponent,
    PreviewInputControlsComponent,
    VerticalQuestionModeComponent,
    PreviewImageComponent,
    PreviewLabelComponent,
    PreviewVideoComponent,
    PreviewButtonComponent,
    SingleQuestionModeComponent,
    PreviewSliderComponent,
    KioskLanguageComponent,
    KioskNoQueueComponent
  ],
  exports: [
    KioskPreServiceQuestionComponent,
    KioskServiceQuestionComponent,
    KioskServiceComponent,
    KioskThankYouComponent,
    KioskOffLineComponent,
    PreviewVideoComponent,
    KioskWelcomeComponent,
    KioskLanguageComponent,
    PreviewInputControlsComponent,
    VerticalQuestionModeComponent,
    PreviewImageComponent,
    PreviewLabelComponent,
    PreviewButtonComponent,
    SingleQuestionModeComponent,
    SharedModule,
    KioskNoQueueComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class KioskPreviewExecutionSharedModule { }
