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
  selector: 'lavi-weekly-hours',
  templateUrl: './weekly-hours.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeklyHoursComponent extends AbstractComponent {
  @Input() WeeklyWorkingDaysForm: FormGroup;

  @Output() AddHours = new EventEmitter();
  @Output() RemoveHours = new EventEmitter();
  @Output() ValidationToTimeControl = new EventEmitter();

  get SaturdayTimeFrameArray() {
    return this.GetSaturdayFormArray();
  }

  get SundayTimeFrameArray() {
    return this.GetSundayFormArray();
  }

  get MondayTimeFrameArray() {
    return this.GetMondayFormArray();
  }

  get TuesdayTimeFrameArray() {
    return this.GetTuesdayFormArray();
  }

  get WednesdayTimeFrameArray() {
    return this.GetWednesdayFormArray();
  }

  get ThursdayTimeFrameArray() {
    return this.GetThursdayFormArray();
  }

  get FridayTimeFrameArray() {
    return this.GetFridayFormArray();
  }

  constructor() {
    super();
  }

  private GetWeekArray(day: string, timeFormArray: any) {
    if (day === WeekDays.Sunday) {
      timeFormArray = this.SundayTimeFrameArray;
    } else if (day === WeekDays.Monday) {
      timeFormArray = this.MondayTimeFrameArray;
    } else if (day === WeekDays.Tuesday) {
      timeFormArray = this.TuesdayTimeFrameArray;
    } else if (day === WeekDays.Wednesday) {
      timeFormArray = this.WednesdayTimeFrameArray;
    } else if (day === WeekDays.Thursday) {
      timeFormArray = this.ThursdayTimeFrameArray;
    } else if (day === WeekDays.Friday) {
      timeFormArray = this.FridayTimeFrameArray;
    } else if (day === WeekDays.Saturday) {
      timeFormArray = this.SaturdayTimeFrameArray;
    } else {
      timeFormArray = [];
    }
    return timeFormArray;
  }

  GetSaturdayFormArray() {
    return this.WeeklyWorkingDaysForm.controls.saturday.get(
      'availableTimeFrames'
    ) as FormArray;
  }

  GetSundayFormArray() {
    return this.WeeklyWorkingDaysForm.controls.sunday.get(
      'availableTimeFrames'
    ) as FormArray;
  }

  GetMondayFormArray() {
    return this.WeeklyWorkingDaysForm.controls.monday.get(
      'availableTimeFrames'
    ) as FormArray;
  }

  GetTuesdayFormArray() {
    return this.WeeklyWorkingDaysForm.controls.tuesday.get(
      'availableTimeFrames'
    ) as FormArray;
  }

  GetWednesdayFormArray() {
    return this.WeeklyWorkingDaysForm.controls.wednesday.get(
      'availableTimeFrames'
    ) as FormArray;
  }

  GetThursdayFormArray() {
    return this.WeeklyWorkingDaysForm.controls.thursday.get(
      'availableTimeFrames'
    ) as FormArray;
  }

  GetFridayFormArray() {
    return this.WeeklyWorkingDaysForm.controls.friday.get(
      'availableTimeFrames'
    ) as FormArray;
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
}
