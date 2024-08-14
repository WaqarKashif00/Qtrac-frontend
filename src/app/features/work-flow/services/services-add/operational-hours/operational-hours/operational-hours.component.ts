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

@Component({
  selector: 'lavi-operational-hours',
  templateUrl: './operational-hours.component.html',
  styleUrls: ['./operational-hours.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationalHoursComponent extends AbstractComponent {
  @Input() HourForm: FormGroup;
  @Input() TimeFrameFormArray: FormArray;
  @Input() DayName: string;
  @Input() HideIf24Hours: boolean;

  @Output() AddHoursForm = new EventEmitter();
  @Output() RemoveHoursForm = new EventEmitter();
  @Output() ValidationToTimeControl = new EventEmitter();

  TwentyFourHours = WorkingHour.Hours[0];
  HoursOfOperationMessage = HoursOfOperationMessage;
  workingHours = WorkingHour.Hours;
  workingHoursWith12HourFormat = this.workingHours.filter(
    (x) => x !== this.TwentyFourHours
  );

  get AvailableTimeFrame() {
    return this.HourForm.get('availableTimeFrameFormGroup') as FormGroup;
  }
  
  constructor() {
    super();

  }

  ResetTimeFrame(){
    this.AvailableTimeFrame.reset();
    while (this.TimeFrameFormArray.length !== 0) {
      this.TimeFrameFormArray.removeAt(0)
    }
  }


  public AddHours() {
    this.AddHoursForm.emit(this.AvailableTimeFrame);
  }

  public ValidateToTime(event) {
    this.ValidationToTimeControl.emit(event);
  }

  public RemoveTimeFrame(index: number) {
    this.RemoveHoursForm.emit(index);
  }
}
