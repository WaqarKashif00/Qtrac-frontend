import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-working-hours',
  templateUrl: './working-hours.component.html',
})
export class WorkingHoursComponent extends AbstractComponent {

  @Input() WorkingHourForm: FormGroup;
  @Input() SaturdayTimeFrameArray: FormArray;
  @Input() SundayTimeFrameArray: FormArray;
  @Input() MondayTimeFrameArray: FormArray;
  @Input() TuesdayTimeFrameArray: FormArray;
  @Input() WednesdayTimeFrameArray: FormArray;
  @Input() ThursdayTimeFrameArray: FormArray;
  @Input() FridayTimeFrameArray: FormArray;

  @Output() AddHours = new EventEmitter();
  @Output() RemoveHours = new EventEmitter();
  @Output() ValidateToTimeControl = new EventEmitter();

  constructor() {
    super();
  }

  AddHoursForm(day: string){
    this.AddHours.emit(day);
  }

  RemoveHoursForm(day: string, index: number){
    this.RemoveHours.emit([day, index]);
  }

  ValidateToTime(fromTime){
    this.ValidateToTimeControl.emit(fromTime);
  }

}
