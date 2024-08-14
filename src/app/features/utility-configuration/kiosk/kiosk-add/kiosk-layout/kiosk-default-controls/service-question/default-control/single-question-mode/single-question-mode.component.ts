import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { IMoveEvent } from '../../../../Models/move-event.interface';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ServiceBoxControl } from '../../../../Models/controls/service-box.control';
import { debounceTime, delay } from 'rxjs/operators';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { ServiceQuestionService } from '../../service-question.service';
import { IWorkFlowDetail } from '../../../../Models/kiosk-layout-data.interface';
import { GetDefaultOrSelectedServiceQuestionLanguageItem } from '../../../../../../../template-shared/utilities';

@Component({
  selector: 'lavi-service-question-single-question-mode',
  templateUrl: './single-question-mode.component.html',
})
export class SingleQuestionModeComponent extends AbstractComponent {
  @Input() Items: Array<ServiceBoxControl>;
  @Input() Panel;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Input() Buttons;
  @Input() GridSize = 50;
  @Input() IsOnlyGrid = false;
  @Input() DivLayoutDesignContainer: Component;
  @Input() Workflow: IWorkFlowDetail;
  @Output() ResizeStop = new EventEmitter<IResizeEvent>();
  @Output() MoveEnd = new EventEmitter<IMoveEvent>();
  @Output() OnPanelClick = new EventEmitter<void>();
  @Output() ButtonResizeStop = new EventEmitter<[IResizeEvent, string]>();
  @Output() ButtonMoveEnd = new EventEmitter<[IMoveEvent, string]>();

  allowDrag = true;

  constructor(private service: ServiceQuestionService) {
    super();
  }

  Init() {
    this.subs.sink = this.Buttons[0].form.valueChanges
      .pipe(delay(200), debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Buttons[0], this.Buttons[0].form);
        this.service.UpdateButtonData(this.Buttons);
      });

    this.subs.sink = this.Buttons[1].form.valueChanges
      .pipe(delay(200), debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Buttons[1], this.Buttons[1].form);
        this.service.UpdateButtonData(this.Buttons);
      });

    this.subs.sink = this.Buttons[2]?.form.valueChanges
      .pipe(delay(200), debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Buttons[2], this.Buttons[2].form);
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
  OnClick() {
    this.OnPanelClick.emit();
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
    return src?.find(
      (x) => x.languageCode === (this.SelectedLanguage || this.DefaultLanguage)
    )?.url;
  }

  GetItem(item) {
    const questions = this.Workflow.questionSets.find(x => x.id === this.Items[0].questionSetId);
    const serviceQuestionItem = GetDefaultOrSelectedServiceQuestionLanguageItem(item,
      this.SelectedLanguage, this.DefaultLanguage, questions, true, this.Panel);
    return serviceQuestionItem;
  }

  OnControlClick(){
    this.allowDrag = false;
  }

  DraggableDivClick(){
    this.allowDrag = true;
  }
}
