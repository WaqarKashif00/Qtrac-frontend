import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { HoursOfOperationMessage } from 'src/app/models/validation-message/hours-of-operations';
import { WorkingHour } from 'src/app/models/constants/working-hours.constant';
import { CommonMessages } from 'src/app/models/constants/message-constant';

@Component({
  selector: 'lavi-operational-date-hours',
  templateUrl: './operational-date-hours.component.html',
  styleUrls: ['./operational-date-hours.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationalDateHoursComponent extends AbstractComponent {
  @Input() TimeFrameFormArray: FormArray;
  @Input() AvailableTimeFrame: FormGroup;
  @Input() DayName: string;
  @Input() HideIf24Hours: boolean;

  @Output() AddHoursForm = new EventEmitter();
  @Output() RemoveHoursForm = new EventEmitter();
  @Output() RemoveWorkingDateForm = new EventEmitter();
  @Output() ValidationToTimeControl = new EventEmitter();

  TwentyFourHours = WorkingHour.Hours[0];
  HoursOfOperationMessage = HoursOfOperationMessage;
  workingHours = WorkingHour.Hours;
  workingHoursWith12HourFormat = this.workingHours.filter(
    (x) => x !== this.TwentyFourHours
  );

  constructor() {
    super();
  }

  public AddHours() {
    this.AddHoursForm.emit();
  }

  public ValidateToTime(event) {
    this.ValidationToTimeControl.emit(event);
  }

  public RemoveTimeFrame(index: number) {
    this.RemoveHoursForm.emit(index);
  }

  public RemoveWorkingDate() {
    this.RemoveWorkingDateForm.emit();
  }
}
