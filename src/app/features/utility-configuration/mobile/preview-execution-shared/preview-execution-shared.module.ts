import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PreviewExecutionButtonComponent } from './preview-execution-button/preview-execution-button.component';
import { PreviewExecutionFooterComponent } from './preview-execution-footer/preview-execution-footer.component';
import { PreviewExecutionGlobalPageComponent } from './preview-execution-global-question-page/preview-execution-global-question-page.component';
import { PreviewExecutionHeaderComponent } from './preview-execution-header/preview-execution-header.component';
import { PreviewExecutionImageComponent } from './preview-execution-image/preview-execution-image.component';
import { PreviewExecutionInputControlsComponent } from './preview-execution-input-controls/preview-execution-input-controls.component';
import { PreviewExecutionLabelComponent } from './preview-execution-label/preview-execution-label.component';
import { PreviewExecutionLanguagePageComponent } from './preview-execution-language-page/preview-execution-language-page.component';
import { PreviewExecutionMarketingPageComponent } from './preview-execution-marketing-page/preview-execution-marketing-page.component';
import { PreviewExecutionNoQueuePageComponent } from './preview-execution-no-queue-page/preview-execution-no-queue-page.component';
import { PreviewExecutionServicePageComponent } from './preview-execution-service-page/preview-execution-service-page.component';
import { PreviewExecutionServiceQuestionPageComponent } from './preview-execution-service-question-page/preview-execution-service-question-page.component';
import { PreviewExecutionSliderComponent } from './preview-execution-slider/preview-execution-slider.component';
import { PreviewExecutionSurveyPageComponent } from './preview-execution-survey-page/preview-execution-survey-page.component';
import { PreviewExecutionThankYouPageComponent } from './preview-execution-thank-you-page/preview-execution-thank-you-page.component';
import { PreviewExecutionTicketPageComponent } from './preview-execution-ticket-page/preview-execution-ticket-page.component';
import { PreviewExecutionVideoComponent } from './preview-execution-video/preview-execution-video.component';
import { PreviewExecutionWelcomePageComponent } from './preview-execution-welcome-page/preview-execution-welcome-page.component';
import { PreviewExecutionOfflinePageComponent } from './preview-execution-offline-page/preview-execution-offline-page.component'
@NgModule({
  imports: [SharedModule],
  declarations: [
    PreviewExecutionInputControlsComponent,
    PreviewExecutionImageComponent,
    PreviewExecutionLabelComponent,
    PreviewExecutionVideoComponent,
    PreviewExecutionButtonComponent,
    PreviewExecutionSliderComponent,
    PreviewExecutionWelcomePageComponent,
    PreviewExecutionLanguagePageComponent,
    PreviewExecutionGlobalPageComponent,
    PreviewExecutionServiceQuestionPageComponent,
    PreviewExecutionServicePageComponent,
    PreviewExecutionSurveyPageComponent,
    PreviewExecutionThankYouPageComponent,
    PreviewExecutionTicketPageComponent,
    PreviewExecutionMarketingPageComponent,
    PreviewExecutionHeaderComponent,
    PreviewExecutionFooterComponent,
    PreviewExecutionNoQueuePageComponent,
    PreviewExecutionOfflinePageComponent
  ],
  exports: [
    PreviewExecutionVideoComponent,
    PreviewExecutionInputControlsComponent,
    PreviewExecutionImageComponent,
    PreviewExecutionLabelComponent,
    PreviewExecutionButtonComponent,
    PreviewExecutionSliderComponent,
    PreviewExecutionWelcomePageComponent,
    PreviewExecutionLanguagePageComponent,
    PreviewExecutionGlobalPageComponent,
    PreviewExecutionServiceQuestionPageComponent,
    PreviewExecutionServicePageComponent,
    PreviewExecutionSurveyPageComponent,
    PreviewExecutionThankYouPageComponent,
    PreviewExecutionTicketPageComponent,
    SharedModule,
    PreviewExecutionMarketingPageComponent,
    PreviewExecutionHeaderComponent,
    PreviewExecutionFooterComponent,
    PreviewExecutionNoQueuePageComponent,
    PreviewExecutionOfflinePageComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MobilePreviewExecutionExecutionSharedModule { }
