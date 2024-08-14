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
  selector: 'lavi-during-date-range-hours',
  templateUrl: './during-date-range-hours.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuringDateRangeHoursComponent extends AbstractComponent {
  @Input() DuringDateRangeWorkingDaysFormArray: FormArray;

  @Output() AddDateArray = new EventEmitter();
  @Output() RemoveWorkingDate = new EventEmitter();
  @Output() AddHours = new EventEmitter();
  @Output() RemoveHours = new EventEmitter();
  @Output() ValidationToTimeControl = new EventEmitter();
  fromDateFormControl = new FormControl(new Date());
  toDateFormControl = new FormControl(new Date());
  IsValidFromDate: boolean = true;
  IsValidToDate: boolean = true;
  InValidDate: boolean = false;
  IsAlreadyExist: Boolean = false;

  public disabledDates = (date: Date): boolean => {
    return date < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0);
  };

  AddDate() {
    this.ValidateDate();
    this.DateAlreadyExist(
      ConvertDate(this.fromDateFormControl.value),
      ConvertDate(this.toDateFormControl.value)
    );
    if (
      this.IsValidFromDate &&
      this.IsValidToDate &&
      !this.InValidDate &&
      !this.IsAlreadyExist
    ) {
      this.AddDateArray.emit([
        this.fromDateFormControl.value,
        this.toDateFormControl.value,
        this.DuringDateRangeWorkingDaysFormArray,
      ]);
    }
  }
  RemoveWorkingDateForm(index) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.RemoveWorkingDate.emit([
        this.DuringDateRangeWorkingDaysFormArray,
        index,
      ]);
    }
  }
  ValidateDate() {
    const fromDate = ConvertDate(this.fromDateFormControl.value);
    const toDate = ConvertDate(this.toDateFormControl.value);
    this.IsAlreadyExist = false;
    this.IsValidFromDate = this.fromDateFormControl.value ? true : false;
    this.IsValidToDate = this.toDateFormControl.value ? true : false;
    this.InValidDate =
      fromDate.getTime() > toDate.getTime() && toDate ? true : false;
  }
  DateAlreadyExist(fromDate, toDate) {
    this.DuringDateRangeWorkingDaysFormArray.controls.forEach(
      (duringDateRangeWorkingDay) => {
        const rangeFromDate = ConvertDate(
          duringDateRangeWorkingDay.value.fromDate
        );
        const rangeToDate = ConvertDate(duringDateRangeWorkingDay.value.toDate);
        if (
          (rangeFromDate.getTime() <= fromDate.getTime() &&
            fromDate.getTime() <= rangeToDate.getTime()) ||
          (rangeFromDate.getTime() <= toDate.getTime() &&
            toDate.getTime() <= rangeToDate.getTime()) ||
          (rangeFromDate.getTime() >= toDate.getTime() &&
            toDate.getTime() >= rangeToDate.getTime())
        ) {
          this.IsAlreadyExist = true;
        }
      }
    );
  }

  constructor() {
    super();
  }

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
