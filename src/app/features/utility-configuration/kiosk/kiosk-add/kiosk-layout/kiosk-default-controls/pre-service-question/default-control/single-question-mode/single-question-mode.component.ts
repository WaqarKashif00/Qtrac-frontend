import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { IMoveEvent } from '../../../../Models/move-event.interface';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ServiceBoxControl } from '../../../../Models/controls/service-box.control';
import { debounceTime, delay } from 'rxjs/operators';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { PreServiceQuestionService } from '../../pre-service-question.service';
import { IWorkFlowDetail } from '../../../../Models/kiosk-layout-data.interface';
import { GetDefaultOrSelectedGlobalQuestionLanguageItem } from '../../../../../../../template-shared/utilities';

@Component({
  selector: 'lavi-single-pre-question-mode',
  templateUrl: './single-question-mode.component.html',
})
export class SinglePreQuestionModeComponent extends AbstractComponent {
  @Input() Items: Array<ServiceBoxControl>;
  @Input() Panel;
  @Input() Buttons;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Input() GridSize: number = 50;
  @Input() IsOnlyGrid: boolean = false;
  @Input() DivLayoutDesignContainer: Component;
  @Input() Workflow: IWorkFlowDetail;
  @Output() ResizeStop = new EventEmitter<IResizeEvent>();
  @Output() MoveEnd = new EventEmitter<IMoveEvent>();
  @Output() OnPanelCLick = new EventEmitter<void>();
  @Output() ButtonResizeStop = new EventEmitter<[IResizeEvent, string]>();
  @Output() ButtonMoveEnd = new EventEmitter<[IMoveEvent, string]>();
  @Output() ButtonClick = new EventEmitter<void>();

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

    this.subs.sink = this.Buttons[1]?.form.valueChanges
      .pipe(delay(200), debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Buttons[1], this.Buttons[1].form);
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
  OnButtonClick() {
    this.ButtonClick.emit();
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
      this.SelectedLanguage, this.DefaultLanguage, this.Workflow.preServiceQuestions, true, this.Panel);
    return preServiceQuestionItem;
  }

  OnControlClick(){
    this.allowDrag = false;
  }

  DraggableDivClick(){
    this.allowDrag = true;
  }
}
