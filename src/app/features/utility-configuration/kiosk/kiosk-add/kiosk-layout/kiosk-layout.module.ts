import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularDraggableModule } from 'angular2-draggable';
import { KioskContainerComponent } from './kiosk-layout-container.component';
import { KioskTemplateComponent } from './kiosk-layout-template/kiosk-layout-template.component';
import { KioskHeaderComponent } from './kiosk-header/kiosk-header.component';
import { KioskLayoutControlPropertyComponent } from './kiosk-layout-template/kiosk-property/kiosk-layout-control-property/kiosk-layout-control-property.component';
import { KioskToolBoxComponent } from './kiosk-layout-template/kiosk-tool-box/kiosk-tool-box.component';
import { KioskPropertyComponent } from './kiosk-layout-template/kiosk-property/kiosk-property.component';
import { KioskMiddleContainerComponent } from './kiosk-layout-template/kiosk-middle-container/kiosk-middle-container.component';
import { ImageControlComponent } from './kiosk-layout-template/kiosk-middle-container/kiosk-middle-container-controls/image-control/image-control.component';
import { LabelControlComponent } from './kiosk-layout-template/kiosk-middle-container/kiosk-middle-container-controls/label-control/label-control.component';
import { KioskImageFormComponent } from './kiosk-layout-template/kiosk-property/kiosk-other-control-property/kiosk-image-form/kiosk-image-form.component';
import { SliderControlComponent } from './kiosk-layout-template/kiosk-middle-container/kiosk-middle-container-controls/slider-control/slider-control.component';
import { KioskSliderFormComponent } from './kiosk-layout-template/kiosk-property/kiosk-other-control-property/kiosk-slider-form/kiosk-slider-form.component';
import { FontComponent } from './kiosk-layout-template/kiosk-property/font-property/font-property.component';
import { PreServiceQuestionItemComponent } from './kiosk-default-controls/pre-service-question/property-control/pre-service-question-item/pre-service-question-item.component';
import { PreServiceQuestionPanelComponent } from './kiosk-default-controls/pre-service-question/property-control/pre-service-question-panel/pre-service-question-panel.component';
import { VerticalQuestionModeComponent } from './kiosk-default-controls/service-question/default-control/vertical-question-mode/vertical-question-mode.component';
import { ServiceQuestionItemComponent } from './kiosk-default-controls/service-question/property-control/service-question-item/service-question-item.component';
import { ServiceQuestionPanelComponent } from './kiosk-default-controls/service-question/property-control/service-question-panel/service-question-panel.component';
import { ServiceItemComponent } from './kiosk-default-controls/service/property-control/service-item/service-item.component';
import { ServicePanelComponent } from './kiosk-default-controls/service/property-control/service-panel/service-panel.component';
import { PreServiceQuestionDefaultControlComponent } from './kiosk-default-controls/pre-service-question/default-control/pre-service-question-default-control.component';
import { PreServiceQuestionPropertyControlComponent } from './kiosk-default-controls/pre-service-question/property-control/pre-service-question-property-control.component';
import { ServiceQuestionDefaultControlComponent } from './kiosk-default-controls/service-question/default-control/service-question-default-control.component';
import { ServiceQuestionPropertyControlComponent } from './kiosk-default-controls/service-question/property-control/service-question-property-control.component';
import { ServiceDefaultControlComponent } from './kiosk-default-controls/service/default-control/service-default-control.component';
import { ServicePropertyControlComponent } from './kiosk-default-controls/service/property-control/service-property-control.component';
import { SingleQuestionModeComponent } from './kiosk-default-controls/service-question/default-control/single-question-mode/single-question-mode.component';
import { ThankYouDefaultControlComponent } from './kiosk-default-controls/thank-you/default-control/thank-you-default.component';
import { ThankYouPropertyComponent } from './kiosk-default-controls/thank-you/property-control/thank-you-property.component';
import { VideoControlComponent } from './kiosk-layout-template/kiosk-middle-container/kiosk-middle-container-controls/video-control/video-control.component';
import { KioskVideoFormComponent } from './kiosk-layout-template/kiosk-property/kiosk-other-control-property/kiosk-video-form/kiosk-video-form.component';
import { SinglePreQuestionModeComponent } from './kiosk-default-controls/pre-service-question/default-control/single-question-mode/single-question-mode.component';
import { VerticalPreServiceQuestionModeComponent } from './kiosk-default-controls/pre-service-question/default-control/vertical-question-mode/vertical-question-mode.component';
import { WelcomeButtonControlComponent } from './kiosk-default-controls/welcome/default-control/button-control/welcome-button-control.component';
import { WelcomeButtonPropertyControlComponent } from './kiosk-default-controls/welcome/property-control/button-control/welcome-button-property.component';
import { WelcomeDefaultControlComponent } from './kiosk-default-controls/welcome/default-control/welcome-default-control.component';
import { KioskLabelFormComponent } from './kiosk-layout-template/kiosk-property/kiosk-other-control-property/kiosk-label-form/kiosk-label-form.component';
import { ThankYouItemPropertyComponent } from './kiosk-default-controls/thank-you/property-control/thank-you-item-property/thank-you-item-property.component';
import { ThankYouPanelComponent } from './kiosk-default-controls/thank-you/property-control/thank-you-panel/thank-you-panel.component';
import { LanguageDefaultControlComponent } from './kiosk-default-controls/language/default-control/language-default-control.component';
import { LanguagePropertyControlComponent } from './kiosk-default-controls/language/property-control/language-property-control.component';
import { LanguagePanelComponent } from './kiosk-default-controls/language/property-control/language-panel/language-panel.component';
import { ButtonPropertyControlComponent } from './kiosk-default-controls/common/button-property-control/button-property-control.component';
import { KioskPreviewExecutionSharedModule } from '../../previw-execution-shared/preview-execution-shared.module';
import { KioskLayoutPagePropertyComponent } from './kiosk-layout-template/kiosk-property/kiosk-layout-page-property/kiosk-layout-page-property.component';
import { NoQueueButtonControlComponent } from './kiosk-default-controls/no-queue/default-control/button-control/no-queue-button-control.component';
import { NoQueueDefaultControlComponent } from './kiosk-default-controls/no-queue/default-control/no-queue-default-control.component';
import { NoQueuePropertyControlComponent } from './kiosk-default-controls/no-queue/property-control/no-queue-property.component';
import { OffLineButtonControlComponent } from './kiosk-default-controls/off-line/default-control/button-control/off-line-button-control.component';
import { OffLineDefaultControlComponent } from './kiosk-default-controls/off-line/default-control/off-line-default-control.component';
import { OffLinePropertyControlComponent } from './kiosk-default-controls/off-line/property-control/off-line-property.component';

@NgModule({
  imports: [SharedModule, AngularDraggableModule, KioskPreviewExecutionSharedModule],
  declarations: [
    FontComponent,
    WelcomeButtonControlComponent,
    WelcomeDefaultControlComponent,
    WelcomeButtonPropertyControlComponent,
    SinglePreQuestionModeComponent,
    VerticalPreServiceQuestionModeComponent,
    VerticalQuestionModeComponent,
    SingleQuestionModeComponent,
    ServiceQuestionItemComponent,
    ServiceQuestionPanelComponent,
    ServiceItemComponent,
    ServicePanelComponent,
    PreServiceQuestionItemComponent,
    PreServiceQuestionPanelComponent,
    KioskLabelFormComponent,
    KioskImageFormComponent,
    KioskVideoFormComponent,
    KioskContainerComponent,
    KioskLayoutControlPropertyComponent,
    KioskMiddleContainerComponent,
    KioskTemplateComponent,
    KioskToolBoxComponent,
    ServiceDefaultControlComponent,
    ServiceQuestionDefaultControlComponent,
    PreServiceQuestionDefaultControlComponent,
    ServicePropertyControlComponent,
    ServiceQuestionPropertyControlComponent,
    PreServiceQuestionPropertyControlComponent,
    ImageControlComponent,
    VideoControlComponent,
    LabelControlComponent,
    KioskPropertyComponent,
    KioskHeaderComponent,
    SliderControlComponent,
    KioskSliderFormComponent,
    ThankYouDefaultControlComponent,
    ThankYouPropertyComponent,
    ThankYouPanelComponent,
    ThankYouItemPropertyComponent,
    LanguageDefaultControlComponent,
    LanguagePanelComponent,
    LanguagePropertyControlComponent,
    ButtonPropertyControlComponent,
    KioskLayoutPagePropertyComponent,
    NoQueueButtonControlComponent,
    NoQueueDefaultControlComponent,
    NoQueuePropertyControlComponent,
    OffLineButtonControlComponent,
    OffLineDefaultControlComponent,
    OffLinePropertyControlComponent
  ],
  exports: [KioskContainerComponent, SharedModule, KioskPreviewExecutionSharedModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class KioskLayoutModule {}
