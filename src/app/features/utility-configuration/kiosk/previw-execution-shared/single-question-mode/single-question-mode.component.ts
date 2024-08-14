import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Validations } from 'src/app/models/constants/validation.constant';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { IKioskPreviewPageData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';

@Component({
  selector: 'lavi-single-question-mode',
  templateUrl: './single-question-mode.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleQuestionModeComponent extends AbstractComponent {
  @Input() Data: IKioskPreviewPageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Input() BranchCountryCode: string;

  @Output() ShowNextPage: EventEmitter<string> = new EventEmitter();
  @Output() OnAppointment: EventEmitter<string> = new EventEmitter();

  index: number;
  IsSaveClick: boolean;
  NextButtonName = 'Next Button';
  BackButtonName = 'Back Button';
  AppointmentButtonName = 'Appointment Button';
  FinishButtonName = 'Finish Button';
  Buttons = [
    this.BackButtonName,
    this.AppointmentButtonName
  ];
  ShowBackButtonInPanel = false;
  OpenAppointmentModal = false;

  Init() {
    this.index = 0;
    this.Data.items[0].selected = true;
    this.SetShowButtonProperty();
    this.ShowBackButtonInPanel = false;
    this.IsSaveClick = false;
  }
  private SetShowButtonProperty() {
    this.Data.buttons.map(x => x.showButton = true);
    let finishBtnData = this.Data.buttons.find(x => x.name === this.FinishButtonName);
    if (finishBtnData) finishBtnData.showButton = false;
  }

  showNextQuestion(name: string, id) {
    if (name === this.BackButtonName && !(this.ShowBackButtonInPanel)) {
      this.ShowNextPage.emit(name);
    } else if (name === this.BackButtonName) {
      this.index = this.index - 1 > 0 ? this.index - 1 : 0;
      this.ShowPreviousItem();
    }
    else if (name === this.AppointmentButtonName) {
      this.OpenAppointmentDialog();
    }
    else {
      this.ValidateDataAndShowButton(name, id);
    }
  }

  private ValidateDataAndShowButton(btnName: string, id: any) {
    if ((this.Data.items[this.index].required &&
      this.Data.items[this.index].answer || !(this.Data.items[this.index].required)) &&
      this.IsValidData()) {
      this.UpdateIndex(btnName);
      if (this.index === this.Data.items.length - 1) {
        this.ShowFinishButton();
      }
      if (this.index !== this.Data.items.length) {
        this.IsSaveClick = false;
        if (btnName === this.BackButtonName) {
          this.ShowPreviousItem();
        }
        else {
          this.ShowNextItem();
        }
      } else {
        this.ShowNextPage.emit(id);
      }
    } else {
      this.IsSaveClick = true;
    }
  }

  private UpdateIndex(btnName: string) {
    if (btnName === this.BackButtonName) {
      this.index = this.index - 1;
    }
    else {
      this.index = this.index + 1;
    }
  }

  private IsValidData() {
    let valid = true;
    const item = this.Data.items[this.index];
    if (item.itemType === QuestionType.Email.value && item.answer) {
      valid = (item.answer).match(Validations.EmailRegX);
    }

    if ((item.itemType === QuestionType.PhoneNumber.value  || item.itemType === QuestionType.SMSPhoneNumber.value) && item.answer) {
      valid = item.isValid;
    }

    return valid;
  }

  private ShowFinishButton() {
    this.ShowBackButtonInPanel = false;
    this.Data.buttons.map((x) => (x.showButton = true));
    this.Data.buttons.find(x => x.name === this.NextButtonName).showButton = false;
  }

  private ShowNextItem() {
    this.ShowBackButtonInPanel = true;
    this.Data.items.map((x) => (x.selected = false));
    this.Data.items[this.index].selected = true;
  }

  private ShowPreviousItem() {
    this.ShowBackButtonInPanel = !(this.index === 0);
    this.SetShowButtonProperty();
    this.Data.items.map((x) => (x.selected = false));
    this.Data.items[this.index].selected = true;
  }

  OpenAppointmentDialog() {
    this.OpenAppointmentModal = true;
  }

  CloseAppointmentDialog() {
    this.OpenAppointmentModal = false;
  }

  HaveAppointment(appointmentId: string): void {
    this.OnAppointment.emit(appointmentId);
  }

}
