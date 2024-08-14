import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, Output
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { debounceTime, delay } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';
import { updatePropertiesWithForm2 } from '../../../../../../../../core/utilities/core-utilities';
import { BorderSizes } from '../../../../../../../../models/constants/font.constant';
import { ButtonControl } from '../../../Models/controls/button.control';

@Component({
  selector: 'lavi-button-property-control',
  templateUrl: './button-property-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPropertyControlComponent extends AbstractComponent {
  @Input() PanelHeader: string;
  @Input() Buttons: ButtonControl[];
  @Input() TextFormArray: FormArray;
  @Input() ButtonImageFormArray: FormArray;
  @OnChange('OnIsPageButtonSelectedPropertyChange')
  @Input() IsPageButtonSelected:boolean

  @Output() ButtonDropdownChange: EventEmitter<string> = new EventEmitter();
  @Output() OpenDialog: EventEmitter<string> = new EventEmitter();
  @Output() CloseDialog: EventEmitter<void> = new EventEmitter();
  @Output() TranslateText: EventEmitter<string> = new EventEmitter();
  @Output() UpdateTranslatedText: EventEmitter<any> = new EventEmitter();
  @Output() UpdateButtons: EventEmitter<ButtonControl[]> = new EventEmitter();
  @Output() OpenButtonImageModal: EventEmitter<string> = new EventEmitter();
  @Output() ApplyImageChanges: EventEmitter<any> = new EventEmitter();
  @Output() IsPageButtonSelectedChange: EventEmitter<any> = new EventEmitter();



  Open = false;
  ButtonName: string;
  OpenImageModal = false;
  BorderSizes = BorderSizes;

  Init(){
    this.SubscribeOnButtonValueChanges();
    this.ButtonName = this.GetButtonNameByPropertyShowWindowProperty();
  }

  private SubscribeOnButtonValueChanges() {
    this.subs.sink = this.Buttons[0]?.form.valueChanges
      .pipe(delay(200), debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Buttons[0], this.Buttons[0].form);
        this.UpdateButtons.emit(this.Buttons);
      });
    this.subs.sink = this.Buttons[1]?.form.valueChanges
      .pipe(delay(200), debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Buttons[1], this.Buttons[1].form);
        this.UpdateButtons.emit(this.Buttons);
      });
    this.subs.sink = this.Buttons[2]?.form.valueChanges
      .pipe(delay(200), debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Buttons[2], this.Buttons[2].form);
        this.UpdateButtons.emit(this.Buttons);
      });
    this.subs.sink = this.Buttons[3]?.form.valueChanges
      .pipe(delay(200), debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Buttons[3], this.Buttons[3].form);
        this.UpdateButtons.emit(this.Buttons);
      });
  }

  OnButtonDropdownChange(event){
    this.ButtonName = event.target.value;
    this.ButtonDropdownChange.emit(event.target.value);
  }

  OpenTranslateDialog(){
    this.Open = true;
    this.ButtonName = this.GetButtonNameByPropertyShowWindowProperty();
    this.OpenDialog.emit(this.GetButtonNameByPropertyShowWindowProperty());
  }

  private GetButtonNameByPropertyShowWindowProperty(): string {
    return this.Buttons.find(x => x.showPropertyWindow).name;
  }

  CloseTranslateDialog(){
    this.Open = false;
  }

  Translate(text: string){
    this.TranslateText.emit(text);
  }
  OnIsPageButtonSelectedPropertyChange(){
    this.IsPageButtonSelectedChange.emit(this.IsPageButtonSelected)
  }
  UpdateTranslatedTextInForm(event){
    this.UpdateTranslatedText.emit([event, this.ButtonName]);
    this.Open = false;
  }

  OpenImageDialog(){
    this.OpenImageModal = true;
    this.ButtonName = this.GetButtonNameByPropertyShowWindowProperty();
    this.OpenButtonImageModal.emit(this.ButtonName);
  }

  Save(event){
    this.ApplyImageChanges.emit([event, this.ButtonName]);
    this.CloseImageDialog();
  }

  CloseImageDialog(){
    this.OpenImageModal = false;
  }
}
