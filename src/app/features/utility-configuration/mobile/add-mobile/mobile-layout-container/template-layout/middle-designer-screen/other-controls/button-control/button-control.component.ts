import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ButtonControl } from 'src/app/features/utility-configuration/mobile/models/controls/button.control';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { Language } from 'src/app/models/enums/language-enum';
import { ICurrentLanguage } from '../../../../../../models/current-language.interface';

@Component({
  selector: 'lavi-button-control',
  templateUrl: './button-control.component.html',
})
export class ButtonControlComponent extends AbstractComponent {

  @Input() Button: ButtonControl;
  @Input() SelectedLanguage: ICurrentLanguage;

  @Output() OnButtonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() OnButtonMove: EventEmitter<IMobileMoveEvent> = new EventEmitter<IMobileMoveEvent>();
  @Output() OnButtonResize: EventEmitter<IResizeEvent> = new EventEmitter<IResizeEvent>();

  onControlClick() {
    this.OnButtonClick.emit();
  }
  onControlMoveEnd(event) {
    this.OnButtonMove.emit(event);
  }
  onControlResizeStop(event) {
    this.OnButtonResize.emit(event);
  }

  GetUrl(src){
    return (src?.find(x => x.languageCode === (this.SelectedLanguage.selectedLanguage))?.url) || '';
  }
}
