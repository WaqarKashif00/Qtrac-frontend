import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { WeekDays } from 'src/app/models/enums/week-days.enum';

@Component({
  selector: 'lavi-daily-hours',
  templateUrl: './daily-hours.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyHoursComponent extends AbstractComponent {
  @Input() DailyWorkingDaysForm: FormGroup;

  @Output() AddHours = new EventEmitter();
  @Output() RemoveHours = new EventEmitter();
  @Output() ValidationToTimeControl = new EventEmitter();

  get SaturdayTimeFrameArray() {
    return this.GetSaturdayFormArray();
  }

  get SundayTimeFrameArray() {
    return this.GetSundayFormArray();
  }

  get MondayToFridayTimeFrameArray() {
    return this.GetMondayToFridayFormArray();
  }

  constructor() {
    super();
  }

  AddHoursForm(day: string, avaliabletimeForm) {
    let timeFormArray;
    timeFormArray = this.GetWeekArray(day, timeFormArray);
    this.AddHours.emit([timeFormArray, avaliabletimeForm]);
  }

  RemoveHoursForm(day: string, index: number) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      let timeFormArray;
      timeFormArray = this.GetWeekArray(day, timeFormArray);
      this.RemoveHours.emit([timeFormArray, index]);
    }
  }
  ValidateToTime(fromTime) {
    this.ValidationToTimeControl.emit(fromTime);
  }
  GetSaturdayFormArray() {
    return this.DailyWorkingDaysForm.controls.saturday.get(
      'availableTimeFrames'
    ) as FormArray;
  }

  GetSundayFormArray() {
    return this.DailyWorkingDaysForm.controls.sunday.get(
      'availableTimeFrames'
    ) as FormArray;
  }

  GetMondayToFridayFormArray() {
    return this.DailyWorkingDaysForm.controls.mondayToFriday.get(
      'availableTimeFrames'
    ) as FormArray;
  }

  private GetWeekArray(day: string, timeFormArray: any) {
    if (day === WeekDays.Sunday) {
      timeFormArray = this.SundayTimeFrameArray;
    } else if (day === WeekDays.MondayToFriday) {
      timeFormArray = this.MondayToFridayTimeFrameArray;
    } else if (day === WeekDays.Saturday) {
      timeFormArray = this.SaturdayTimeFrameArray;
    } else {
      timeFormArray = [];
    }
    return timeFormArray;
  }
}
