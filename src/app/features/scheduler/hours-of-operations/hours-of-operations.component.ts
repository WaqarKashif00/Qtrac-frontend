import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ICountryDropdownList } from 'src/app/models/common/country-dropdown-list.interface';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { WeekDays } from 'src/app/models/enums/week-days.enum';
import { IHolidayList } from './hours-of-operation.interface';
import { HoursOfOperationService } from './hours-operation.service';

@Component({
  selector: 'lavi-hours-of-operations',
  templateUrl: './hours-of-operations.component.html',
  styleUrls: ['./hours-of-operations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    HoursOfOperationService],
})
export class HoursOfOperationsComponent extends AbstractComponent {
  HolidayList$: Observable<IHolidayList[]>;
  BranchCountries$: Observable<ICountryDropdownList[]>;
  IsEditedMode$: Observable<boolean>;


  get MyHoursOfOperationForm(){
   return this.service.HoursOfOperationForm;
  }

  get FocusIfTemplateNameRequired(){
    return this.MyHoursOfOperationForm.get('generalConfiguration.templateName').hasError('required');
  }

  get SaturdayFormArray(){
    return this.service.GetSaturdayFormArray();
  }

  get SundayFormArray(){
    return this.service.GetSundayFormArray();
  }

  get MondayFormArray(){
    return this.service.GetMondayFormArray();
  }

  get TuesdayFormArray(){
    return this.service.GetTuesdayFormArray();
  }

  get WednesdayFormArray(){
    return this.service.GetWednesdayFormArray();
  }

  get ThursdayFormArray(){
    return this.service.GetThursdayFormArray();
  }

  get FridayFormArray(){
    return this.service.GetFridayFormArray();
  }

  constructor(private service: HoursOfOperationService) {
    super();
    this.HolidayList$ = this.service.HolidayList$;
    this.BranchCountries$ = service.BranchCountries$;
    this.IsEditedMode$ = service.IsEditMode$;
    service.GetCountries();
    service.SetMode();
  }

  AddHours(day: string){
    let weekFormArray;
    weekFormArray = this.GetWeekArray(day, weekFormArray);
    this.service.AddFormArray(weekFormArray);
  }

  RemoveTimeFrame(event){
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
    let weekFormArray;
    weekFormArray = this.GetWeekArray(event[0], weekFormArray);
    this.service.RemoveItemFromArray(weekFormArray, event[1]);
    }
  }

  private GetWeekArray(day: string, weekFormArray: any) {
    if (day === WeekDays.Sunday) {
      weekFormArray = this.SundayFormArray;
    }
    else if (day === WeekDays.Monday) {
      weekFormArray = this.MondayFormArray;
    }
    else if (day === WeekDays.Tuesday) {
      weekFormArray = this.TuesdayFormArray;
    }
    else if (day === WeekDays.Wednesday) {
      weekFormArray = this.WednesdayFormArray;
    }
    else if (day === WeekDays.Thursday) {
      weekFormArray = this.ThursdayFormArray;
    }
    else if (day === WeekDays.Friday) {
      weekFormArray = this.FridayFormArray;
    }
    else if (day === WeekDays.Saturday) {
      weekFormArray = this.SaturdayFormArray;
    }
    else {
      weekFormArray = [];
    }
    return weekFormArray;
  }

  save() {
    this.service.SaveHoursOfOperation(this.MyHoursOfOperationForm);
  }

  DeleteNonWorkingDays(id){
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.service.RemoveNonWorkingDays(id);
    }
  }

  LoadHolidayListData(event) {
    this.service.LoadHolidayList(event[0], event[1]);
  }

  AddNonWorkingHoliday(formGroup: any) {
    this.service.AddNonWorkingHoliday(formGroup);
  }
}
