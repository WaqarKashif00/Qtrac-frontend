import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IKioskButtonControlData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';

@Component({
  selector: 'lavi-preview-button',
  templateUrl: './preview-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./preview-button.component.scss']
})
export class PreviewButtonComponent extends AbstractComponent {
  @Input() Button: IKioskButtonControlData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Input() FixedButton = false;
  @Input() ShowBackButtonInPanel = false;

  @Output() ShowNextQuestion: EventEmitter<void> = new EventEmitter<void>();


  ClickButton() {
    this.ShowNextQuestion.emit();
  }

  GetUrl(src){
    return (src?.find(x => x.languageCode === (this.SelectedLanguage))?.url);
  }
}
