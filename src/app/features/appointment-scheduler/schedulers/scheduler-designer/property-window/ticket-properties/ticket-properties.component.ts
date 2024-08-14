import {
  ChangeDetectionStrategy, Component,
  EventEmitter,
  Input, Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { TicketProperty } from 'src/app/features/appointment-scheduler/models/controls/ticket-property.control';
import {
  AllowNotifyEmailItems, AllowNotifySmsItems, EnableTermsConditionsItems
} from 'src/app/models/constants/general-properties.constant';
import { CommonValidationMessages } from 'src/app/models/validation-message/common-validation.messages';

@Component({
  selector: 'lavi-ticket-properties',
  templateUrl: './ticket-properties.component.html',
  styleUrls: ['./ticket-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketPropertiesComponent extends AbstractComponent {
  AllowNotifySms: Array<string> = AllowNotifySmsItems;
  AllowNotifyEmail: Array<string> = AllowNotifyEmailItems;
  EnableTermsConditions: Array<string> = EnableTermsConditionsItems;

  @Input() TicketPropertyControl: TicketProperty;
  @Output() OnDataChanged: EventEmitter<FormGroup> =
    new EventEmitter<FormGroup>();

    ValidationMessage = CommonValidationMessages;

  Init() {
    this.subs.sink = this.TicketPropertyControl.form.valueChanges.subscribe(
      (data) => {
        this.OnDataChanged.emit(this.TicketPropertyControl.form);
      }
    );
  }
}
