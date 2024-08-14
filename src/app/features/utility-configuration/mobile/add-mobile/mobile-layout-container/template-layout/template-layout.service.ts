import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IDynamicVariable } from '../../../../../../models/common/dynamic-variable.interface';
import { Control } from '../../../models/controls/control';
import { DesignerPanelControl } from '../../../models/controls/designer-panel.control';
import { FooterControl } from '../../../models/controls/footer.control';
import { HeaderControl } from '../../../models/controls/header.control';
import { ImageControl } from '../../../models/controls/image.control';
import { LabelControl } from '../../../models/controls/label.control';
import { PageProperties } from '../../../models/controls/page-properties';
import { SliderControl } from '../../../models/controls/slider.control';
import { VideoControl } from '../../../models/controls/video.control';
import { ICurrentLanguage } from '../../../models/current-language.interface';
import { IMobileMoveEndControlEvent } from '../../../models/mobile-control-move-end-event.interface';
import { IMobileResizeControlEvent } from '../../../models/mobile-control-resize-event.interface';
import { IGlobalQuestionPageData } from '../../../models/mobile-global-question-page-data.interface';
import { ILanguagePageData } from '../../../models/mobile-language-page-data.interface';
import { IMarketingPageData } from '../../../models/mobile-marketing-page-data.interface';
import { IMobileMoveEvent } from '../../../models/mobile-move-event.interface';
import { INoQueuePageData } from '../../../models/mobile-no-queue-page-data.interface';
import { IServicePageData } from '../../../models/mobile-service-page-data.interface';
import { IServiceQuestionPageData } from '../../../models/mobile-service-question-page-data.interface';
import { IMobileSupportedLanguage } from '../../../models/mobile-supported-language.interface';
import { ISurveyPageData } from '../../../models/mobile-survey-page-data.interface';
import { IThankYouPageData } from '../../../models/mobile-thank-you-page-data.interface';
import { ITicketPageData } from '../../../models/mobile-ticket-page-data.interface';
import { IWelcomePageData } from '../../../models/mobile-welcome-page-data.interface';
import { IMobilePageDetails } from '../../../models/pages.interface';
import { MobileLayoutContainerService } from '../mobile-layout-container.service';
import { IOffLinePage } from '../../../models/off-line-page.interface';

@Injectable()
export class TemplateLayoutService extends AbstractComponentService {

  DesignerPanel$: Observable<DesignerPanelControl>;
  PageProperties$: Observable<PageProperties>;
  CurrentPage$: Observable<IMobilePageDetails>;
  HeaderControl$: Observable<HeaderControl>;
  FooterControl$: Observable<FooterControl>;
  WelcomePageData$: Observable<IWelcomePageData>;
  LanguagePageData$: Observable<ILanguagePageData>;
  GlobalQuestionPageData$: Observable<IGlobalQuestionPageData>;
  ServicePageData$: Observable<IServicePageData>;
  ServiceQuestionPageData$: Observable<IServiceQuestionPageData>;
  TicketPageData$: Observable<ITicketPageData>;
  ThankYouPageData$: Observable<IThankYouPageData>;
  MarketingPageData$: Observable<IMarketingPageData>;
  SurveyPageData$: Observable<ISurveyPageData>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  LanguageList$: Observable<IMobileSupportedLanguage[]>;
  DynamicVariables$: Observable<IDynamicVariable[]>;
  NoQueuePageData$: Observable<INoQueuePageData>;
  OffLinePageData$: Observable<IOffLinePage>

  get Workflow() {
    return this.layoutService.WorkFlowData;
  }
  constructor(private layoutService: MobileLayoutContainerService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.DesignerPanel$ = this.layoutService.DesignerPanel$;
    this.PageProperties$ = this.layoutService.PageProperties$;
    this.CurrentPage$ = this.layoutService.CurrentPage$;
    this.HeaderControl$ = this.layoutService.HeaderControl$;
    this.FooterControl$ = this.layoutService.FooterControl$;
    this.WelcomePageData$ = this.layoutService.WelcomePageData$;
    this.LanguagePageData$ = this.layoutService.LanguagePageData$;
    this.GlobalQuestionPageData$ = this.layoutService.GlobalQuestionPageData$;
    this.ServicePageData$ = this.layoutService.ServicePageData$;
    this.ServiceQuestionPageData$ = this.layoutService.ServiceQuestionPageData$;
    this.TicketPageData$ = this.layoutService.TicketPageData$;
    this.ThankYouPageData$ = this.layoutService.ThankYouPageData$;
    this.MarketingPageData$ = this.layoutService.MarketingPageData$;
    this.SurveyPageData$ = this.layoutService.SurveyPageData$;
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$;
    this.LanguageList$ = this.layoutService.LanguageList$;
    this.DynamicVariables$ = this.layoutService.DynamicVariables$;
    this.NoQueuePageData$ = this.layoutService.NoQueuePageData$;
    this.OffLinePageData$ = this.layoutService.OffLinePage$
  }

  UpdatedDesignerPanelDetail(designerPanelControl: DesignerPanelControl) {
    this.layoutService.UpdatedDesignerPanelDetail(designerPanelControl);
  }
  UpdatedFooterControlDetail(footerControl: FooterControl) {
    this.layoutService.UpdatedFooterControlDetail(footerControl);
  }
  UpdatedHeaderControlDetail(headerControl: HeaderControl) {
    this.layoutService.UpdatedHeaderControlDetail(headerControl);
  }
  AddNewImageControl(event: IMobileMoveEvent) {
    this.layoutService.AddNewImageControl(event);
  }
  AddNewLabelControl(event: IMobileMoveEvent) {
    this.layoutService.AddNewLabelControl(event);
  }
  AddNewSliderControl(event: IMobileMoveEvent) {
    this.layoutService.AddNewSliderControl(event);
  }
  AddNewVideoControl(event: IMobileMoveEvent) {
    this.layoutService.AddNewVideoControl(event);
  }
  RemoveVideo(control: VideoControl) {
    this.layoutService.RemoveVideo(control);
  }
  RemoveSlider(control: SliderControl) {
    this.layoutService.RemoveSlider(control);
  }
  RemoveImage(control: ImageControl) {
    this.layoutService.RemoveImage(control);
  }
  RemoveLabel(control: LabelControl) {
    this.layoutService.RemoveLabel(control);
  }
  ControlResizeEnd(event: IMobileResizeControlEvent) {
    this.layoutService.ControlResizeEnd(event);
  }
  ControlMoveEnd(event: IMobileMoveEndControlEvent) {
    this.layoutService.ControlMoveEnd(event);
  }
  UpdateOtherControlData(control: Control) {
    this.layoutService.UpdateOtherControlData(control);
  }
  ChangeOtherControlPropertyWindow(value: string) {
    this.layoutService.ChangeOtherControlPropertyWindow(value);
  }
  ConvertLanguageArrayToObject(langArray) {
    return this.layoutService.ConvertTranslatedLanguageArrayToObject(langArray);
  }
  OnClickImage(control: ImageControl) {
    this.layoutService.OnImageClick(control);
  }
  OnClickLabel(control: LabelControl) {
    this.layoutService.OnLabelClick(control);
  }
  OnClickVideo(control: VideoControl) {
    this.layoutService.OnVideoClick(control);
  }
  OnClickSlider(control: SliderControl) {
    this.layoutService.OnSliderClick(control);
  }
  OnLanguageDefaultControlSelection() {
    this.layoutService.OnPageDefaultControlSelection('LanguagePageDataSubject');
  }
  WelcomeButtonSelection() {
    this.layoutService.OnPageButtonSelection('WelcomePageDataSubject');
  }

  OfflineButtonSelection() {
    this.layoutService.OnPageButtonSelection('OffLinePageDataSubject');
  }

  NoQueueButtonSelection() {
    this.layoutService.OnPageButtonSelection('NoQueuePageDataSubject');
  }
  ServicePageButtonSelection() {
    this.layoutService.OnPageButtonSelection('ServicePageDataSubject');
  }
  ServicePagePanelSelection() {
    this.layoutService.OnPageDefaultControlSelection('ServicePageDataSubject');
  }
  GlobalQuestionDefaultControlSelection() {
    this.layoutService.OnPageDefaultControlSelection('GlobalQuestionPageDataSubject');
  }
  GlobalQuestionButtonSelection() {
    this.layoutService.OnPageButtonSelection('GlobalQuestionPageDataSubject');

  }
  ServiceQuestionPageDefaultControlSelection() {
    this.layoutService.OnPageDefaultControlSelection('ServiceQuestionPageDataSubject');
  }

  SurveyQuestionPageDefaultControlSelection() {
    this.layoutService.OnPageDefaultControlSelection('SurveyPageDataSubject');
  }

  TicketPageDefaultControlSelection() {
    this.layoutService.OnPageDefaultControlSelection('TicketPageDataSubject');
  }
  TicketPageButtonSelection() {
    this.layoutService.OnPageButtonSelection('TicketPageDataSubject');
  }
  OnFooterClick() {
    this.layoutService.OnFooterSelection();
  }
  OnHeaderClick() {
    this.layoutService.OnHeaderSelection();
  }
  IncreaseZIndex() {
    this.layoutService.IncreaseZIndex();
  }

  DecreaseZIndex() {
    this.layoutService.DecreaseZIndex();
  }

}
