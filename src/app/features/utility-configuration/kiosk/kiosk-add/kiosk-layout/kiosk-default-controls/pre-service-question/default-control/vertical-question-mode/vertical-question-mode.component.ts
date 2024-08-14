import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { debounceTime, delay } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { IWorkFlowDetail } from '../../../../../../../../../models/common/workflow-detail.interface';
import { GetDefaultOrSelectedGlobalQuestionLanguageItem } from '../../../../../../../template-shared/utilities';
import { ButtonControl } from '../../../../Models/controls/button.control';
import { ServiceBoxControl } from '../../../../Models/controls/service-box.control';
import { IMoveEvent } from '../../../../Models/move-event.interface';
import { PreServiceQuestionService } from '../../pre-service-question.service';
@Component({
  selector: 'lavi-vertical-pre-question-mode',
  templateUrl: './vertical-question-mode.component.html',
})
export class VerticalPreServiceQuestionModeComponent extends AbstractComponent {
  @Input() Items: Array<ServiceBoxControl>;
  @Input() Panel;
  @Input() Buttons: Array<ButtonControl>;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Input() GridSize = 50;
  @Input() IsOnlyGrid = false;
  @Input() DivLayoutDesignContainer: Component;
  @Input() Workflow: IWorkFlowDetail;
  @Output() ResizeStop = new EventEmitter<IResizeEvent>();
  @Output() MoveEnd = new EventEmitter<IMoveEvent>();
  @Output() ButtonResizeStop = new EventEmitter<[IResizeEvent, string]>();
  @Output() ButtonMoveEnd = new EventEmitter<[IMoveEvent, string]>();
  @Output() OnPanelCLick = new EventEmitter<void>();

  allowDrag = true;

  constructor(private service: PreServiceQuestionService) {
    super();
  }

  Init() {
    this.subs.sink = this.Buttons[0]?.form.valueChanges
      .pipe(delay(200), debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Buttons[0], this.Buttons[0].form);
        this.service.UpdateButtonData(this.Buttons);
      });
    this.subs.sink = this.Buttons[2]?.form.valueChanges
      .pipe(delay(200), debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Buttons[2], this.Buttons[2].form);
        this.service.UpdateButtonData(this.Buttons);
      });
    this.subs.sink = this.Buttons[3]?.form.valueChanges
      .pipe(delay(200), debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Buttons[3], this.Buttons[3].form);
        this.service.UpdateButtonData(this.Buttons);
      });
  }

  OnResizeStop(event: IResizeEvent) {
    this.ResizeStop.emit(event);
  }

  OnMoveEnd(event: IMoveEvent) {
    event = {
      x: event.x < 0 ? 0 : Math.round(event.x),
      y: event.y < 0 ? 0 : Math.round(event.y),
    };
    this.MoveEnd.emit(event);
  }
  OnClick(){
    this.OnPanelCLick.emit()
  }
  OnButtonMoveEnd(event: IMoveEvent, name: string) {
    event = {
      x: event.x < 0 ? 0 : Math.round(event.x),
      y: event.y < 0 ? 0 : Math.round(event.y),
    };
    this.ButtonMoveEnd.emit([event, name]);
  }

  OnButtonResizeStop(event: IResizeEvent, name: string) {
    this.ButtonResizeStop.emit([event, name]);
  }

  GetUrl(src) {
    return (src?.find(x => x.languageCode === (this.SelectedLanguage || this.DefaultLanguage))?.url);
  }

  GetItem(item) {
    const preServiceQuestionItem = GetDefaultOrSelectedGlobalQuestionLanguageItem(item,
      this.SelectedLanguage, this.DefaultLanguage, this.Workflow.preServiceQuestions,true, this.Panel);
    return preServiceQuestionItem;
  }

  OnControlClick(){
    this.allowDrag = false;
  }

  DraggableDivClick(){
    this.allowDrag = true;
  }
}
