import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ConvertDate } from 'src/app/core/utilities/workflow-service-available';
import { CommonMessages } from 'src/app/models/constants/message-constant';

@Component({
  selector: 'lavi-on-custom-date-hours',
  templateUrl: './on-custom-date-hours.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnCustomDateHoursComponent extends AbstractComponent {
  @Input() OnCustomDateWorkingDaysFormArray: FormArray;

  @Output() AddDateArray = new EventEmitter();
  @Output() RemoveWorkingDate = new EventEmitter();
  @Output() AddHours = new EventEmitter();
  @Output() RemoveHours = new EventEmitter();
  @Output() ValidationToTimeControl = new EventEmitter();

  fromDateFormControl = new FormControl(new Date());
  IsValidDate: boolean = true;
  IsAlreadyExist: Boolean = false;
  AddDate() {
    this.ValidateDate();
    this.DateAlreadyExist(this.fromDateFormControl.value);
    if (
      this.fromDateFormControl.value &&
      this.IsValidDate &&
      !this.IsAlreadyExist
    ) {
      this.AddDateArray.emit([
        this.fromDateFormControl.value,
        null,
        this.OnCustomDateWorkingDaysFormArray,
      ]);
    }
  }

  RemoveWorkingDateForm(index) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.RemoveWorkingDate.emit([
        this.OnCustomDateWorkingDaysFormArray,
        index,
      ]);
    }
  }

  ValidateDate() {
    this.IsAlreadyExist = false;
    this.IsValidDate = this.fromDateFormControl.value ? true : false;
  }
  DateAlreadyExist(fromDate) {
    const FromDate = ConvertDate(fromDate);
    this.OnCustomDateWorkingDaysFormArray.controls.forEach(
      (onCustomDateWorkingDay) => {
        const onCustomFromDate = ConvertDate(
          onCustomDateWorkingDay.value.fromDate
        );
        if (onCustomFromDate.getTime() == FromDate.getTime()) {
          this.IsAlreadyExist = true;
          return;
        }
      }
    );
  }

  constructor() {
    super();
  }
  
  public disabledDates = (date: Date): boolean => {
    return date < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0);
  };
  AddHoursForm(timeFormArray, avaliabletimeForm) {
    this.AddHours.emit([timeFormArray, avaliabletimeForm]);
  }
  RemoveHoursForm(index, timeFormArray) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.RemoveHours.emit([timeFormArray, index]);
    }
  }

  ValidateToTime(fromTime) {
    this.ValidationToTimeControl.emit(fromTime);
  }
}
