import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { HoursOfOperationMessage } from 'src/app/models/validation-message/hours-of-operations';
import { WorkingHour } from 'src/app/models/constants/working-hours.constant';

@Component({
  selector: 'lavi-hours',
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoursComponent extends AbstractComponent {

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
  workingHoursWith12HourFormat = this.workingHours.filter(x => x !== this.TwentyFourHours);

  constructor() {
    super();
  }

  public AddHours(){
    this.AddHoursForm.emit();
  }

  public ValidateToTime(event){
   this.ValidationToTimeControl.emit(event);
  }

  public RemoveTimeFrame(index: number){
    this.RemoveHoursForm.emit(index);
  }

}
