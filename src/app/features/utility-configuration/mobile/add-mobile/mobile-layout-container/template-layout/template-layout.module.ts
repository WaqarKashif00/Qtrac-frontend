import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularDraggableModule } from 'angular2-draggable';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignerScreenComponent } from './designer-screens/designer-screens.component';
import { FooterDesignerScreenComponent } from './designer-screens/footer-designer-screen/footer-designer-screen.component';
import { HeaderDesignerScreenComponent } from './designer-screens/header-designer-screen/header-designer-screen.component';
import { MiddleDesignerScreenComponent } from './middle-designer-screen/middle-designer-screen.component';
import { ImageControlComponent } from './middle-designer-screen/other-controls/image-control/image-control.component';
import { LabelControlComponent } from './middle-designer-screen/other-controls/label-control/label-control.component';
import { SliderControlComponent } from './middle-designer-screen/other-controls/slider-control/slider-control.component';
import { VideoControlComponent } from './middle-designer-screen/other-controls/video-control/video-control.component';
import { GlobalQuestionDefaultControlComponent } from './mobile-default-controls/global-question/default-control/global-question-default-control.component';
import { VerticalPreServiceQuestionModeComponent } from './mobile-default-controls/common-components/vertical-question-mode/vertical-question-mode.component';
import { QuestionPropertyPanelComponent } from './mobile-default-controls/common-components/question-property-panel/question-property-panel.component';
import { GlobalQuestionPropertyControlComponent } from './mobile-default-controls/global-question/property-control/global-question-property-control.component';
import { MobileFontComponent } from './properties/mobile-fonts/mobile-font-property.component';
import { MobileGeneralLayoutPropertyComponent } from './properties/mobile-general-layout-property/mobile-general-layout-property.component';
import { MobileLayoutPageFooterProperty } from './properties/mobile-layout-page-footer-property/mobile-layout-page-footer-property.component';
import { MobileLayoutPageHeaderProperty } from './properties/mobile-layout-page-header-property/mobile-layout-page-header-property.component';
import { MobileImageFormComponent } from './properties/mobile-other-control-property/mobile-image-form/mobile-image-form.component';
import { MobileLabelFormComponent } from './properties/mobile-other-control-property/mobile-label-form/mobile-label-form.component';
import { MobileSliderFormComponent } from './properties/mobile-other-control-property/mobile-slider-form/mobile-slider-form.component';
import { MobileVideoFormComponent } from './properties/mobile-other-control-property/mobile-video-form/mobile-video-form.component';
import { PropertiesComponent } from './properties/properties.component';
import { TemplateLayoutComponent } from './template-layout.component';
import { ToolBoxComponent } from './toolbox/toolbox.component';
import { ServicePropertyControlComponent } from './mobile-default-controls/service/property-control/service-property-control.component';
import { MobileServiceDefaultControlComponent } from './mobile-default-controls/service/default-control/service-default-control.component';
import { ServiceQuestionPropertyControlComponent } from './mobile-default-controls/service-question/property-control/service-question-property-control.component';
import { ServiceQuestionDefaultControlComponent } from './mobile-default-controls/service-question/default-control/service-question-default-control.component';
import { MobileWelcomeDefaultControlComponent } from './mobile-default-controls/welcome/default-control/welcome-default-control.component';
import { WelcomePropertyControlComponent } from './mobile-default-controls/welcome/property-control/welcome-property-control.component';
import { MobileButtonFormComponent } from './properties/mobile-other-control-property/mobile-button-form/mobile-button-form.component';
import { TicketPropertyControlComponent } from './mobile-default-controls/ticket/property-control/ticket-property-control.component';
import { MobileTicketDefaultControlComponent } from './mobile-default-controls/ticket/default-control/ticket-default-control.component';
import { MobileLanguageDefaultControlComponent } from './mobile-default-controls/language/default-control/language-default-control.component';
import { LanguagePropertyControlComponent } from './mobile-default-controls/language/property-control/language-property-control.component';
import { ButtonControlComponent } from './middle-designer-screen/other-controls/button-control/button-control.component';
import { MobileButtonsFormComponent } from './properties/mobile-other-control-property/mobile-buttons-form/mobile-buttons-form.component';
import { TicketItemPropertyComponent } from './mobile-default-controls/ticket/property-control/ticket-item-property/ticket-item-property.component';
import { LaviMobileVideoComponent } from './middle-designer-screen/other-controls/video-control/mobile-video/mobile-video.component';
import { MobilePreviewExecutionExecutionSharedModule } from '../../../preview-execution-shared/preview-execution-shared.module';
import { MobileLayoutPagePropertyComponent } from './properties/mobile-layout-page-property/mobile-layout-page-property.component';
import { MobileNoQueueDefaultControlComponent } from './mobile-default-controls/no-queue/default-control/no-queue-default-control.component';
import { NoQueuePropertyControlComponent } from './mobile-default-controls/no-queue/property-control/no-queue-property-control.component';
import { SurveyQuestionDefaultControlComponent } from './mobile-default-controls/survey-question/default-control/survey-question-default-control.component';
import { SurveyQuestionPropertyControlComponent } from './mobile-default-controls/survey-question/property-control/survey-question-property-control.component';
import { MobileOffLineDefaultControlComponent } from './mobile-default-controls/off-line/default-control/off-line-default-control.component';
import { MobileOffLinePropertyControlComponent } from './mobile-default-controls/off-line/property-control/off-line-property.component';
@NgModule({
  imports: [SharedModule, AngularDraggableModule, MobilePreviewExecutionExecutionSharedModule],
  exports: [SharedModule, TemplateLayoutComponent, MobilePreviewExecutionExecutionSharedModule],
  declarations: [
    TemplateLayoutComponent,
    ToolBoxComponent,
    DesignerScreenComponent,
    PropertiesComponent,
    MobileGeneralLayoutPropertyComponent,
    MobileFontComponent,
    MobileLayoutPageFooterProperty,
    MobileLayoutPageHeaderProperty,
    HeaderDesignerScreenComponent,
    FooterDesignerScreenComponent,
    ImageControlComponent,
    LabelControlComponent,
    VideoControlComponent,
    SliderControlComponent,
    ButtonControlComponent,
    MiddleDesignerScreenComponent,
    MobileImageFormComponent,
    MobileLabelFormComponent,
    MobileSliderFormComponent,
    MobileVideoFormComponent,
    QuestionPropertyPanelComponent,
    GlobalQuestionPropertyControlComponent,
    VerticalPreServiceQuestionModeComponent,
    GlobalQuestionDefaultControlComponent,
    ServicePropertyControlComponent,
    MobileServiceDefaultControlComponent,
    ServiceQuestionPropertyControlComponent,
    ServiceQuestionDefaultControlComponent,
    MobileWelcomeDefaultControlComponent,
    WelcomePropertyControlComponent,
    MobileButtonFormComponent,
    MobileButtonsFormComponent,
    TicketPropertyControlComponent,
    MobileTicketDefaultControlComponent,
    MobileLanguageDefaultControlComponent,
    LanguagePropertyControlComponent,
    TicketItemPropertyComponent,
    LaviMobileVideoComponent,
    MobileLayoutPagePropertyComponent,
    MobileNoQueueDefaultControlComponent,
    NoQueuePropertyControlComponent,
    SurveyQuestionDefaultControlComponent,
    SurveyQuestionPropertyControlComponent,
    MobileOffLineDefaultControlComponent,
    MobileOffLinePropertyControlComponent,
  ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class TemplateModule { }
