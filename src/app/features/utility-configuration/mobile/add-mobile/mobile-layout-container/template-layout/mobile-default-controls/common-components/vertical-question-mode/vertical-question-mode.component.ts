import { Component, Input, EventEmitter, Output } from '@angular/core';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { GetDefaultOrSelectedGlobalQuestionLanguageItem, GetDefaultOrSelectedServiceQuestionLanguageItem } from '../../../../../../../template-shared/utilities';
import { IMobileWorkFlowDetail } from '../../../../../../models/mobile-work-flow-detail.interface';

@Component({
  selector: 'lavi-vertical-item',
  templateUrl: './vertical-question-mode.component.html',
})
export class VerticalPreServiceQuestionModeComponent extends AbstractComponent {

  @Input() Panel: PanelControl;
  @Input() SelectedLanguage: ICurrentLanguage;
  @Input() CurrentPage: IMobilePageDetails;
  @Input() WorkFlowData: IMobileWorkFlowDetail;

  @Output() ResizeStop = new EventEmitter<IResizeEvent>();
  @Output() MoveEnd = new EventEmitter<IMobileMoveEvent>();
  @Output() ItemClick: EventEmitter<void> = new EventEmitter();

  OnResizeStop(event: IResizeEvent) {
    this.ResizeStop.emit(event);
  }
  OnMoveEnd(event: IMobileMoveEvent) {
    this.MoveEnd.emit(event);
  }

  GetUrl(src) {
    return (src?.find(x => x.languageCode === (this.SelectedLanguage.selectedLanguage))?.url) || '';
  }

  GetItem(item) {
    if (this.CurrentPage.IsGlobalQuestionPage) {
      return this.GetGlobalQuestionItem(item);
    } else if (this.CurrentPage.IsServiceQuestionPage) {
      return this.GetServiceQuestionItem(item);
    } else {
      return this.GetSurveyQuestionItem(item)
    }
  }

  private GetServiceQuestionItem(item: any) {
    const questionSet = this.WorkFlowData.questionSets.find(x => x.id === this.Panel.items[0].itemsSetId);
    const serviceQuestionItem = GetDefaultOrSelectedServiceQuestionLanguageItem(item,
      this.SelectedLanguage.selectedLanguage, this.SelectedLanguage.defaultLanguage, questionSet, false);
    return serviceQuestionItem;
  }

  private GetSurveyQuestionItem(item: any) {
    const questionSet = this.WorkFlowData.surveyQuestions.find(x => x.id === this.Panel.items[0].itemsSetId);
    const surveyQuestionItem = GetDefaultOrSelectedServiceQuestionLanguageItem(item,
      this.SelectedLanguage.selectedLanguage, this.SelectedLanguage.defaultLanguage, questionSet, false);
    return surveyQuestionItem;
  }

  private GetGlobalQuestionItem(item: any) {
    const preServiceQuestionItem = GetDefaultOrSelectedGlobalQuestionLanguageItem(item,
      this.SelectedLanguage.selectedLanguage, this.SelectedLanguage.defaultLanguage, this.WorkFlowData.preServiceQuestions, false);
    return preServiceQuestionItem;
  }
  OnClick() {
    this.ItemClick.emit()
  }
}
