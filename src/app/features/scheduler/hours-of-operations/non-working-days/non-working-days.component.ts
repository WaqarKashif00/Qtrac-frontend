import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { HoursOfOperationMessage } from 'src/app/models/validation-message/hours-of-operations';
import { IHolidayList } from '../hours-of-operation.interface';
import { ICountryDropdownList } from 'src/app/models/common/country-dropdown-list.interface';
import { checkDateValidation } from 'src/app/shared/validators/common.validator';
import { HoursOfOperationService } from '../hours-operation.service';

@Component({
  selector: 'lavi-non-working-days',
  templateUrl: './non-working-days.component.html',
  styleUrls: ['./non-working-days.component.scss'],
})
export class NonWorkingDaysComponent extends AbstractComponent {
  @Input() defaultHolidayList: IHolidayList[];
  @Input() countries: ICountryDropdownList[];
  @Output() LoadHolidayData = new EventEmitter();
  @Output() AddNonWorkingDay: EventEmitter<any> = new EventEmitter();
  @Output() DeleteNonWorkingDay: EventEmitter<string> = new EventEmitter();
  @Output() EditNonWorkingDay: EventEmitter<IHolidayList> = new EventEmitter();
 
  nonWorkingDayForm: FormGroup;
  nonWorkingDays: IHolidayList;
  HoursOfOperationMessage = HoursOfOperationMessage;
  DefaultCountryValue: ICountryDropdownList = { country: 'Select Country', countryCode: null };
  SelectedCountryValue: ICountryDropdownList = { country: 'Select Country', countryCode: null };
  

  get Year(){
  return new Date().getFullYear();
  }

  constructor(private formBuilder: FormBuilder,private service: HoursOfOperationService) {
    super();

    this.nonWorkingDayForm = this.formBuilder.group(
      {
        fromDate: ['', Validators.required],
        toDate: ['', Validators.required],
        description: ['', Validators.required],
      },
      { validator: checkDateValidation }
    );
  }
  EditHoliday(holiday:IHolidayList){
    if(typeof(holiday.fromDate) == 'string'){
      holiday.fromDate = new Date(holiday.fromDate)
    }
    if(typeof(holiday.toDate) == 'string'){
      holiday.toDate = new Date(holiday.toDate)
    }
    this.service.NonWorkingId = holiday.id
    this.service.IsNonWokingEditMode=true;
    this.nonWorkingDayForm.patchValue(holiday)
  }

  DeleteHoliday(id) {
    this.DeleteNonWorkingDay.emit(id);
  }

  LoadHolidayList() {
    this.LoadHolidayData.emit([this.SelectedCountryValue.countryCode, this.Year]);
  }

  AddNonWorkingDayToList() {
      this.service.AddNonWorkingHoliday({
        form : this.nonWorkingDayForm,
        isEditMode :this.service.IsNonWokingEditMode,
        id: this.service.NonWorkingId
      });
  }
}
