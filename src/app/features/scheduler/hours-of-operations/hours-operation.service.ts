import { Injectable } from '@angular/core';
import {
  AbstractControl, FormArray, FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { time } from 'console';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { ICountryDropdownList } from 'src/app/models/common/country-dropdown-list.interface';
import { WorkingHour } from 'src/app/models/constants/working-hours.constant';
import { HoursOfOperationAPIService } from 'src/app/shared/api-services/hoo-api.service';
import { checkDateValidation } from 'src/app/shared/validators/common.validator';
import { HouseOfOperationsValidatorService } from 'src/app/shared/validators/house-of-operations.validator';
import { BranchAPIService } from '../../../shared/api-services/branch-api.service';
import { HoursOfOperationMessages } from '../message';
import {
  IHolidayList,
  IHoursOfOperation,
  ITime,
  ITimeInterval,
  IWorkingDay
} from './hours-of-operation.interface';

@Injectable()
export class HoursOfOperationService extends AbstractComponentService {

  private readonly DefaultHours = WorkingHour.Hours[0];
  private readonly DefaultStartHour = WorkingHour.Hours[1];
  private readonly DefaultEndHour = WorkingHour.Hours[47];
  private HolidayListSubject: BehaviorSubject<IHolidayList[]>;
  private SubjectIsEditMode: BehaviorSubject<boolean>;
  private BranchCountriesSubject: BehaviorSubject<ICountryDropdownList[]>;

  locationBaseAPIUrl = this.appConfigService.config.locationBaseAPIUrl + '/api';
  HolidayList$: Observable<IHolidayList[]>;
  IsEditMode$: Observable<boolean>;
  IsEditMode: boolean;
  BranchCountries$: Observable<ICountryDropdownList[]>;
  CompanyId = this.authService.CompanyId;
  HoursOfOperationForm: FormGroup;
  HoursOfOperationId = this.browserStorageService.HoursOfOperationId;
  Countries: ICountryDropdownList[] = [];
  IsNonWokingEditMode: boolean;
  NonWorkingId:string;

  get WorkingHoursForm(): FormGroup {
    return this.HoursOfOperationForm.controls.workingHours as FormGroup;
  }
  get TemplateNameFormControl(){
    return this.HoursOfOperationForm.get('generalConfiguration.templateName');
  }

  GetSaturdayFormArray() {
    return this.HoursOfOperationForm.controls.workingHours.get(
      'saturday.availableTimeFrames'
    ) as FormArray;
  }

  GetSundayFormArray() {
    return this.HoursOfOperationForm.controls.workingHours.get(
      'sunday.availableTimeFrames'
    ) as FormArray;
  }

  GetMondayFormArray() {
    return this.HoursOfOperationForm.controls.workingHours.get(
      'monday.availableTimeFrames'
    ) as FormArray;
  }

  GetTuesdayFormArray() {
    return this.HoursOfOperationForm.controls.workingHours.get(
      'tuesday.availableTimeFrames'
    ) as FormArray;
  }

  GetWednesdayFormArray() {
    return this.HoursOfOperationForm.controls.workingHours.get(
      'wednesday.availableTimeFrames'
    ) as FormArray;
  }

  GetThursdayFormArray() {
    return this.HoursOfOperationForm.controls.workingHours.get(
      'thursday.availableTimeFrames'
    ) as FormArray;
  }

  GetFridayFormArray() {
    return this.HoursOfOperationForm.controls.workingHours.get(
      'friday.availableTimeFrames'
    ) as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private hoursOfOperationAPIService: HoursOfOperationAPIService,
    private branchAPIService: BranchAPIService,
    private readonly houseOfOperationValidatorService: HouseOfOperationsValidatorService
  ) {
    super();
    this.SetInitialValues();
  }

  private SetInitialValues() {
    this.GetCountries();
    this.IsEditMode = false;
    this.HolidayListSubject = new BehaviorSubject<IHolidayList[]>([]);
    this.HolidayList$ = this.HolidayListSubject.asObservable();
    this.SubjectIsEditMode = new BehaviorSubject<boolean>(false);
    this.IsEditMode$ = this.SubjectIsEditMode.asObservable();
    this.BranchCountriesSubject = new BehaviorSubject<ICountryDropdownList[]>([]);
    this.BranchCountries$ = this.BranchCountriesSubject.asObservable();
    this.SetFormGroup(this.SetDefaultValues());
    this.ValidationsIfWeekDaysOpen();
  }

  SetFormGroup(formValues: IHoursOfOperation) {
    this.HoursOfOperationForm = this.formBuilder.group({
      generalConfiguration: this.formBuilder.group(
        {
          templateName: [
            formValues.generalConfiguration.templateName, {
              updateOn: 'change',
              validators: [Validators.required],
              asyncValidators: [
                this.houseOfOperationValidatorService.TemplateNameAlreadyExistValidator(this.CompanyId, this.HoursOfOperationId, formValues.generalConfiguration.templateName)
              ]
            }
          ],
          description: [
            formValues.generalConfiguration.description,
          ],
         
          isExceptionTemplate: [
            formValues.generalConfiguration.isExceptionTemplate,
          ],
          fromDate: [formValues.generalConfiguration.fromDate],
          toDate: [formValues.generalConfiguration.toDate],
        },
        { validator: checkDateValidation }
      ),
      workingHours: this.formBuilder.group({
        saturday: this.GetFormGroup(formValues.workingHours.saturday),
        sunday: this.GetFormGroup(formValues.workingHours.sunday),
        monday: this.GetFormGroup(formValues.workingHours.monday),
        tuesday: this.GetFormGroup(formValues.workingHours.tuesday),
        wednesday: this.GetFormGroup(formValues.workingHours.wednesday),
        thursday: this.GetFormGroup(formValues.workingHours.thursday),
        friday: this.GetFormGroup(formValues.workingHours.friday),
      }),
    });
  }

  private GetFormGroup(formValues: IWorkingDay): FormGroup {
    return this.formBuilder.group({
      dayId: [formValues.dayId],
      dayText: [formValues.dayText],
      isOpen: [formValues.isOpen],
      availableTimeFrames: this.formBuilder.array([
        this.formBuilder.group(
          {
            fromTime: [formValues.availableTimeFrames[0].fromTime],
            toTime: [this.DefaultEndHour],
          },
          { validators: this.checkTimeValidation.bind(this) }
        ),
      ]),
    });
  }

  public ValidationsIfWeekDaysOpen() {
    this.ValidateSundayTimeFrames();
    this.ValidateMondayTimeFrames();
    this.ValidateTuesdayTimeFrames();
    this.ValidateWednesdayTimeFrames();
    this.ValidateThursdayTimeFrames();
    this.ValidateFridayTimeFrames();
    this.ValidateSaturdayTimeFrames();
  }

  private ValidateSundayTimeFrames() {
    const sundayForm = this.WorkingHoursForm.controls.sunday as FormGroup;
    this.subs.sink = sundayForm.controls.isOpen.valueChanges.subscribe(
      (isSundayOpen) => {
        if (isSundayOpen) {
          this.IfSundayHoursIsOpen();
        } else {
          this.IfSundayHoursIsClose();
        }
      }
    );

    this.IfSundayTimeFrameChanges();
  }

  private IfSundayTimeFrameChanges() {
    this.subs.sink = this.HoursOfOperationForm.controls.workingHours
      .get('sunday.availableTimeFrames')
      .valueChanges.subscribe((timeFrame) => {
        if (timeFrame.length > 0 && timeFrame[0].fromTime) {
          const toTimeControl = this.WorkingHoursForm.get(
            'sunday.availableTimeFrames.0.toTime'
          );
          this.SetValidationsToTimeControl(
            toTimeControl,
            this.GetSundayFormArray(),
            timeFrame[0].fromTime
          );
        }
      });
  }

  private IfSundayHoursIsClose() {
    this.GetSundayFormArray().clear();
  }

  private IfSundayHoursIsOpen() {
    this.GetSundayFormArray().push(
      this.GetWeekHoursFormGroup(this.DefaultHours, this.DefaultEndHour)
    );
  }

  public SetValidationsToTimeControl(toTimeControl, weekArrays, fromTime: any) {
    if (fromTime !== this.DefaultHours) {
      toTimeControl.setValidators(Validators.required);
      toTimeControl.updateValueAndValidity({
        emitEvent: false,
        onlySelf: true,
      });
    } else {
      toTimeControl.clearValidators();
      toTimeControl.updateValueAndValidity({
        emitEvent: false,
        onlySelf: true,
      });
      this.RemoveItems(weekArrays, 1);
    }
  }

  private RemoveItems(weekArrays: any, fromIndex: number) {
    for (let i = fromIndex; i < weekArrays.length; i++) {
      weekArrays.removeAt(i);
    }
  }

  private ValidateMondayTimeFrames() {
    const mondayForm = this.WorkingHoursForm.controls.monday as FormGroup;
    this.subs.sink = mondayForm.controls.isOpen.valueChanges.subscribe(
      (isMondayOpen) => {
        if (isMondayOpen) {
          this.IfMondayHoursIsOpen();
        } else {
          this.IfMondayHoursIsClose();
        }
      }
    );

    this.IfMondayTimeFrameChanges();
  }

  private IfMondayTimeFrameChanges() {
    this.subs.sink = this.HoursOfOperationForm.controls.workingHours
      .get('monday.availableTimeFrames')
      .valueChanges.subscribe((timeFrame) => {
        if (timeFrame.length > 0 && timeFrame[0].fromTime) {
          const toTimeControl = this.WorkingHoursForm.get(
            'monday.availableTimeFrames.0.toTime'
          );
          this.SetValidationsToTimeControl(
            toTimeControl,
            this.GetMondayFormArray(),
            timeFrame[0].fromTime
          );
        }
      });
  }

  private IfMondayHoursIsClose() {
    this.GetMondayFormArray().clear();
  }

  private IfMondayHoursIsOpen() {
    this.GetMondayFormArray().push(
      this.GetWeekHoursFormGroup(this.DefaultHours, this.DefaultEndHour)
    );
  }

  private ValidateTuesdayTimeFrames() {
    const tuesdayForm = this.WorkingHoursForm.controls.tuesday as FormGroup;
    this.subs.sink = tuesdayForm.controls.isOpen.valueChanges.subscribe(
      (isTuesdayOpen) => {
        if (isTuesdayOpen) {
          this.IfTuesdayHoursIsOpen();
        } else {
          this.IfTuesdayHoursIsClose();
        }
      }
    );

    this.IfTuesdayTimeFrameChanges();
  }

  private IfTuesdayTimeFrameChanges() {
    this.subs.sink = this.HoursOfOperationForm.controls.workingHours
      .get('tuesday.availableTimeFrames')
      .valueChanges.subscribe((timeFrame) => {
        if (timeFrame.length > 0 && timeFrame[0].fromTime) {
          const toTimeControl = this.WorkingHoursForm.get(
            'tuesday.availableTimeFrames.0.toTime'
          );
          this.SetValidationsToTimeControl(
            toTimeControl,
            this.GetTuesdayFormArray(),
            timeFrame[0].fromTime
          );
        }
      });
  }

  private IfTuesdayHoursIsClose() {
    this.GetTuesdayFormArray().clear();
  }

  private IfTuesdayHoursIsOpen() {
    this.GetTuesdayFormArray().push(
      this.GetWeekHoursFormGroup(this.DefaultHours, this.DefaultEndHour)
    );
  }

  private ValidateWednesdayTimeFrames() {
    const wednesdayForm = this.WorkingHoursForm.controls.wednesday as FormGroup;
    this.subs.sink = wednesdayForm.controls.isOpen.valueChanges.subscribe(
      (isWednesdayOpen) => {
        if (isWednesdayOpen) {
          this.IfWednesdayHoursIsOpen();
        } else {
          this.IfWednesdayHoursIsClose();
        }
      }
    );

    this.IfWednesdayTimeFrameChanges();
  }

  private IfWednesdayTimeFrameChanges() {
    this.subs.sink = this.HoursOfOperationForm.controls.workingHours
      .get('wednesday.availableTimeFrames')
      .valueChanges.subscribe((timeFrame) => {
        if (timeFrame.length > 0 && timeFrame[0].fromTime) {
          const toTimeControl = this.WorkingHoursForm.get(
            'wednesday.availableTimeFrames.0.toTime'
          );
          this.SetValidationsToTimeControl(
            toTimeControl,
            this.GetWednesdayFormArray(),
            timeFrame[0].fromTime
          );
        }
      });
  }

  private IfWednesdayHoursIsClose() {
    this.GetWednesdayFormArray().clear();
  }

  private IfWednesdayHoursIsOpen() {
    this.GetWednesdayFormArray().push(
      this.GetWeekHoursFormGroup(this.DefaultHours, this.DefaultEndHour)
    );
  }

  private ValidateThursdayTimeFrames() {
    const thursdayForm = this.WorkingHoursForm.controls.thursday as FormGroup;
    this.subs.sink = thursdayForm.controls.isOpen.valueChanges.subscribe(
      (isThursdayOpen) => {
        if (isThursdayOpen) {
          this.IfThursdayHoursIsOpen();
        } else {
          this.IfThursdayHoursIsClose();
        }
      }
    );

    this.IfThursdayTimeFrameChanges();
  }

  private IfThursdayTimeFrameChanges() {
    this.subs.sink = this.HoursOfOperationForm.controls.workingHours
      .get('thursday.availableTimeFrames')
      .valueChanges.subscribe((timeFrame) => {
        if (timeFrame.length > 0 && timeFrame[0].fromTime) {
          const toTimeControl = this.WorkingHoursForm.get(
            'thursday.availableTimeFrames.0.toTime'
          );
          this.SetValidationsToTimeControl(
            toTimeControl,
            this.GetThursdayFormArray(),
            timeFrame[0].fromTime
          );
        }
      });
  }

  private IfThursdayHoursIsClose() {
    this.GetThursdayFormArray().clear();
  }

  private IfThursdayHoursIsOpen() {
    this.GetThursdayFormArray().push(
      this.GetWeekHoursFormGroup(this.DefaultHours, this.DefaultEndHour)
    );
  }

  private ValidateFridayTimeFrames() {
    const fridayForm = this.WorkingHoursForm.controls.friday as FormGroup;
    this.subs.sink = fridayForm.controls.isOpen.valueChanges.subscribe(
      (isFridayOpen) => {
        if (isFridayOpen) {
          this.IfFridayHoursIsOpen();
        } else {
          this.IfFridayHoursIsClose();
        }
      }
    );

    this.IfFridayTimeFrameChanges();
  }

  private IfFridayTimeFrameChanges() {
    this.subs.sink = this.HoursOfOperationForm.controls.workingHours
      .get('friday.availableTimeFrames')
      .valueChanges.subscribe((timeFrame) => {
        if (timeFrame.length > 0 && timeFrame[0].fromTime) {
          const toTimeControl = this.WorkingHoursForm.get(
            'friday.availableTimeFrames.0.toTime'
          );
          this.SetValidationsToTimeControl(
            toTimeControl,
            this.GetFridayFormArray(),
            timeFrame[0].fromTime
          );
        }
      });
  }

  private IfFridayHoursIsClose() {
    this.GetFridayFormArray().clear();
  }

  private IfFridayHoursIsOpen() {
    this.GetFridayFormArray().push(
      this.GetWeekHoursFormGroup(this.DefaultHours, this.DefaultEndHour)
    );
  }

  private ValidateSaturdayTimeFrames() {
    const saturdayForm = this.WorkingHoursForm.controls.saturday as FormGroup;
    this.subs.sink = saturdayForm.controls.isOpen.valueChanges.subscribe(
      (isSaturdayOpen) => {
        if (isSaturdayOpen) {
          this.IfSaturdayHoursIsOpen();
        } else {
          this.IfSaturdayHoursIsClose();
        }
      }
    );

    this.IfSaturdayTimeFrameChanges();
  }

  private IfSaturdayTimeFrameChanges() {
    this.subs.sink = this.HoursOfOperationForm.controls.workingHours
      .get('saturday.availableTimeFrames')
      .valueChanges.subscribe((timeFrame) => {
        if (timeFrame.length > 0 && timeFrame[0].fromTime) {
          const toTimeControl = this.WorkingHoursForm.get(
            'saturday.availableTimeFrames.0.toTime'
          );
          this.SetValidationsToTimeControl(
            toTimeControl,
            this.GetSaturdayFormArray(),
            timeFrame[0].fromTime
          );
        }
      });
  }

  private IfSaturdayHoursIsClose() {
    this.GetSaturdayFormArray().clear();
  }

  private IfSaturdayHoursIsOpen() {
    this.GetSaturdayFormArray().push(
      this.GetWeekHoursFormGroup(this.DefaultHours, this.DefaultEndHour)
    );
  }

  private clearValidationsOfControl(
    fromTimeControl: AbstractControl,
    toTimeControl: AbstractControl
  ) {
    fromTimeControl.clearValidators();
    fromTimeControl.updateValueAndValidity({
      emitEvent: false,
      onlySelf: true,
    });
    this.clearToTimeControlValidations(toTimeControl);
  }

  private clearToTimeControlValidations(toTimeControl: AbstractControl) {
    toTimeControl.clearValidators();
    toTimeControl.updateValueAndValidity({ emitEvent: false, onlySelf: true });
  }

  private setValidationsToControls(
    fromTimeControl: AbstractControl,
    toTimeControl: AbstractControl
  ) {
    if (fromTimeControl.value === this.DefaultHours) {
      this.clearToTimeControlValidations(toTimeControl);
    } else {
      fromTimeControl.setValidators(Validators.required);
      toTimeControl.setValidators(Validators.required);
      fromTimeControl.updateValueAndValidity({
        emitEvent: false,
        onlySelf: true,
      });
      toTimeControl.updateValueAndValidity({
        emitEvent: false,
        onlySelf: true,
      });
    }
  }

  public AddFormArray(formArray) {
    formArray.push(this.GetTimeFrameFormGroup());
  }

  public RemoveItemFromArray(formArray: FormArray, index: number) {
    if (formArray.length !== 0 && index && index !== 0) {
      formArray.removeAt(index);
    }
  }

  private GetTimeFrameFormGroup(): FormGroup {
    return this.formBuilder.group(
      {
        fromTime: [this.DefaultStartHour, Validators.required],
        toTime: [this.DefaultEndHour, Validators.required],
      },
      { validators: this.checkTimeValidation }
    );
  }

  SetDefaultValues() {
    const values: IHoursOfOperation = {
      generalConfiguration: {
        templateName: '',
        description: '',
        isExceptionTemplate: false,
        fromDate: new Date(),
        toDate: new Date(),
       
      },
      workingHours: {
        sunday: {
          dayId: 0,
          dayText: 'Sunday',
          isOpen: false,
          availableTimeFrames: this.GetDefaultTimeFrames(),
        },
        monday: {
          dayId: 1,
          dayText: 'Monday',
          isOpen: false,
          availableTimeFrames: this.GetDefaultTimeFrames(),
        },
        tuesday: {
          dayId: 2,
          dayText: 'Tuesday',
          isOpen: false,
          availableTimeFrames: this.GetDefaultTimeFrames(),
        },
        wednesday: {
          dayId: 3,
          dayText: 'Wednesday',
          isOpen: false,
          availableTimeFrames: this.GetDefaultTimeFrames(),
        },
        thursday: {
          dayId: 4,
          dayText: 'Thursday',
          isOpen: false,
          availableTimeFrames: this.GetDefaultTimeFrames(),
        },
        friday: {
          dayId: 5,
          dayText: 'Friday',
          isOpen: false,
          availableTimeFrames: this.GetDefaultTimeFrames(),
        },
        saturday: {
          dayId: 6,
          dayText: 'Saturday',
          isOpen: false,
          availableTimeFrames: this.GetDefaultTimeFrames(),
        },
      },
    };
    return values;
  }

  private GetDefaultTimeFrames(): ITimeInterval[] {
    return [
      {
        fromTime: this.DefaultHours,
        toTime: this.DefaultEndHour,
      },
    ];
  }

  SetValuesInFormGroup(formValues: IHoursOfOperation) {
    this.SetGeneralSettingForm(formValues);
    this.SetWorkingHoursForm(formValues);
  }

  private SetWorkingHoursForm(formValues: IHoursOfOperation) {
    this.SetIsOpenControl(formValues);
    if (formValues.workingHours.saturday.isOpen) {
      formValues.workingHours.saturday.availableTimeFrames = this.SetDefaultTimeFrame(
        formValues.workingHours.saturday.availableTimeFrames
      );
      this.CreateFormArray(
        formValues.workingHours.saturday.availableTimeFrames,
        this.GetSaturdayFormArray()
      );
    }
    if (formValues.workingHours.sunday.isOpen) {
      formValues.workingHours.sunday.availableTimeFrames = this.SetDefaultTimeFrame(
        formValues.workingHours.sunday.availableTimeFrames
      );
      this.CreateFormArray(
        formValues.workingHours.sunday.availableTimeFrames,
        this.GetSundayFormArray()
      );
    }
    if (formValues.workingHours.monday.isOpen) {
      formValues.workingHours.monday.availableTimeFrames = this.SetDefaultTimeFrame(
        formValues.workingHours.monday.availableTimeFrames
      );
      this.CreateFormArray(
        formValues.workingHours.monday.availableTimeFrames,
        this.GetMondayFormArray()
      );
    }
    if (formValues.workingHours.tuesday.isOpen) {
      formValues.workingHours.tuesday.availableTimeFrames = this.SetDefaultTimeFrame(
        formValues.workingHours.tuesday.availableTimeFrames
      );
      this.CreateFormArray(
        formValues.workingHours.tuesday.availableTimeFrames,
        this.GetTuesdayFormArray()
      );
    }
    if (formValues.workingHours.wednesday.isOpen) {
      formValues.workingHours.wednesday.availableTimeFrames = this.SetDefaultTimeFrame(
        formValues.workingHours.wednesday.availableTimeFrames
      );
      this.CreateFormArray(
        formValues.workingHours.wednesday.availableTimeFrames,
        this.GetWednesdayFormArray()
      );
    }
    if (formValues.workingHours.thursday.isOpen) {
      formValues.workingHours.thursday.availableTimeFrames = this.SetDefaultTimeFrame(
        formValues.workingHours.thursday.availableTimeFrames
      );
      this.CreateFormArray(
        formValues.workingHours.thursday.availableTimeFrames,
        this.GetThursdayFormArray()
      );
    }
    if (formValues.workingHours.friday.isOpen) {
      formValues.workingHours.friday.availableTimeFrames = this.SetDefaultTimeFrame(
        formValues.workingHours.friday.availableTimeFrames
      );
      this.CreateFormArray(
        formValues.workingHours.friday.availableTimeFrames,
        this.GetFridayFormArray()
      );
    }
  }

  private SetIsOpenControl(formValues: IHoursOfOperation) {
    this.HoursOfOperationForm.get('workingHours.saturday.isOpen').setValue(
      formValues.workingHours.saturday.isOpen
    );
    this.HoursOfOperationForm.get('workingHours.sunday.isOpen').setValue(
      formValues.workingHours.sunday.isOpen
    );
    this.HoursOfOperationForm.get('workingHours.monday.isOpen').setValue(
      formValues.workingHours.monday.isOpen
    );
    this.HoursOfOperationForm.get('workingHours.tuesday.isOpen').setValue(
      formValues.workingHours.tuesday.isOpen
    );
    this.HoursOfOperationForm.get('workingHours.wednesday.isOpen').setValue(
      formValues.workingHours.wednesday.isOpen
    );
    this.HoursOfOperationForm.get('workingHours.thursday.isOpen').setValue(
      formValues.workingHours.thursday.isOpen
    );
    this.HoursOfOperationForm.get('workingHours.friday.isOpen').setValue(
      formValues.workingHours.friday.isOpen
    );
  }

  private SetDefaultTimeFrame(timeFrame: ITimeInterval[]) {
    return timeFrame.length === 0
      ? [{ fromTime: this.DefaultHours, toTime: null }]
      : timeFrame;
  }

  private SetGeneralSettingForm(formValues: IHoursOfOperation) {
    this.TemplateNameFormControl.clearAsyncValidators();
    this.HoursOfOperationForm.get('generalConfiguration.templateName').setValue(
      formValues.generalConfiguration.templateName
    );
    this.TemplateNameFormControl.setAsyncValidators(
      this.houseOfOperationValidatorService.TemplateNameAlreadyExistValidator(this.CompanyId, this.HoursOfOperationId, formValues.generalConfiguration.templateName)
    );
    this.HoursOfOperationForm.get('generalConfiguration.description').setValue(
      formValues.generalConfiguration.description
    );
   
    this.HoursOfOperationForm.get(
      'generalConfiguration.isExceptionTemplate'
    ).setValue(formValues.generalConfiguration.isExceptionTemplate);
    this.HoursOfOperationForm.get('generalConfiguration.fromDate').setValue(
      new Date(formValues.generalConfiguration.fromDate)
    );
    this.HoursOfOperationForm.get('generalConfiguration.toDate').setValue(
      new Date(formValues.generalConfiguration.toDate)
    );
  }

  public GetTimeFrames(TimeFrames) {
    const timeArray = [];
    if (TimeFrames.length > 0) {
      for (const timeFrame of TimeFrames) {
        const fromTime =
          timeFrame.fromTime && timeFrame.fromTime !== this.DefaultHours
            ? this.ConvertTime12to24(this.GetTimeInString(timeFrame.fromTime))
            : timeFrame.fromTime;
        const toTime = timeFrame.toTime
          ? this.ConvertTime12to24(this.GetTimeInString(timeFrame.toTime))
          : timeFrame.toTime;
        timeArray.push({ fromTime, toTime });
      }
    }
    return timeArray;
  }

  private GetTimeInString(timeFrame: ITime) {
    const format = timeFrame.hours >= 12 ? 'PM' : 'AM';
    return timeFrame.hours + ':' + timeFrame.minutes + ' ' + format;
  }

  public ConvertTime12to24(fromAndToTime) {
    const [time, modifier] = fromAndToTime.split(' ');
    let [hours, minutes] = time.split(':');

    minutes = minutes === '0' ? '00' : minutes;

    if (hours === '12') {
      return `${hours}:${minutes} ${modifier}`;
    }

    if (modifier === 'PM') {
      if (hours > 12) {
        hours = parseInt(hours, 10) - 12;
      } else {
        hours = parseInt(hours, 10) + 12;
      }
    }

    if (modifier === 'AM' && hours === '0') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes} ${modifier}`;
  }

  public SetMode() {
    if (this.HoursOfOperationId) {
      this.SetEditMode();
    } else {
      this.SetAddMode();
    }
    this.SubjectIsEditMode.next(this.IsEditMode);
  }

  SetAddMode() {
    this.IsEditMode = false;
  }

  private SetEditMode() {
    this.IsEditMode = true;
    this.GetHoursOfOperationDetails();
  }

  GetHoursOfOperationDetails() {
    this.hoursOfOperationAPIService.Get(this.CompanyId, this.HoursOfOperationId)
      .subscribe((x: IHoursOfOperation) => {
        this.SetValuesInFormGroup(x);
        this.HolidayListSubject.next(x.nonWorkingDaysList);
      });
  }

  LoadHolidayList(countryId: string, year: number) {
    if (countryId) {
      let confirmMessagePop = true;
      if (this.HolidayListSubject.value.length > 0) {
        confirmMessagePop = confirm(HoursOfOperationMessages.ConfirmMessageForHolidayList + year + ' ?');
      }
      if (confirmMessagePop) {
        this.subs.sink = this.hoursOfOperationAPIService.GetHolidays(this.CompanyId, year, countryId)
          .subscribe((list: any) => {
            list = list.filter(x => x.public);
            this.HolidayListSubject.next([]);
            const holidays = [];
            this.FormatHolidayList(list, holidays);
            if (this.HolidayListSubject.value.length > 0) {
              this.checkIfHolidaysAlreadyAdded(holidays);
            } else {
              this.HolidayListSubject.next(
                this.HolidayListSubject.value.concat(holidays)
              );
            }
          });
      }
      else {
      }
    } else {
      this.AppNotificationService.NotifyError(
        HoursOfOperationMessages.SelectCountryMessage
      );
    }
  }

  private FormatHolidayList(list: any, holidays: any[]) {
    if (list) {
      for (const holiday of list) {
        holidays.push({
          id: holiday.uuid,
          description: holiday.name,
          fromDate: new Date(holiday.date).toISOString(),
          toDate: new Date(holiday.date).toISOString(),
        });
      }
    }
  }

  private checkIfHolidaysAlreadyAdded(holidays: any[]) {
    const holidayList = holidays.reduce((acc, eachArr2Elem) => {
      if (
        this.HolidayListSubject.value.findIndex(
          (eachArr1Elem) =>
            eachArr1Elem.id === eachArr2Elem.id &&
            eachArr1Elem.description === eachArr2Elem.description &&
            eachArr1Elem.fromDate === eachArr2Elem.fromDate &&
            eachArr1Elem.toDate === eachArr2Elem.toDate
        ) === -1
      ) {
        const holidayExists = this.DateFallsInBetween(eachArr2Elem);
        if (!holidayExists) {
          acc.push(eachArr2Elem);
        }
      }
      return acc;
    }, []);
    this.HolidayListSubject.next(
      this.HolidayListSubject.value.concat(holidayList)
    );
  }

  RemoveNonWorkingDays(id: string) {
    const hoursOfOperation = this.HolidayListSubject.value.filter(
      (x) => x.id !== id
    );
    this.HolidayListSubject.next(hoursOfOperation);
  }

  SaveHoursOfOperation(MyHoursOfOperationForm: FormGroup) {
    this.formService.CallFormMethod(MyHoursOfOperationForm).then((x: any) => {
      let hoursOfOperationId: string;
      if (!this.IsEditMode) {
        hoursOfOperationId = this.uuid;
      }
      Object.assign(x, {
        companyId: this.CompanyId,
        pk: this.CompanyId,
        type: 'hours_of_operation_data',
        id: this.IsEditMode ? this.HoursOfOperationId : hoursOfOperationId,
        nonWorkingDaysList: this.HolidayListSubject.value,
      });
 
      
      
      this.SetTimeFrames(x);
      if (this.IsEditMode) {
        this.subs.sink = this.hoursOfOperationAPIService.Update(this.CompanyId, x)
          .subscribe((updateResponse) => {
            if (updateResponse) {
              this.AppNotificationService.Notify(
                HoursOfOperationMessages.UpdateMessage
              );
              this.routeHandlerService.RedirectToHoursOfOperation();
            } else {
              this.AppNotificationService.NotifyError(
                HoursOfOperationMessages.ErrorMessage
              );
            }
          });
      } else {
        this.subs.sink = this.hoursOfOperationAPIService.Create(this.CompanyId, x)
          .subscribe((saveResponse: any) => {
            if (saveResponse) {
              this.browserStorageService.SetHoursOfOperationId(
                saveResponse.hoursOfOperationId
              );
              this.AppNotificationService.Notify(
                HoursOfOperationMessages.SaveMessage
              );
              this.routeHandlerService.RedirectToHoursOfOperation();
            } else {
              this.AppNotificationService.NotifyError(
                HoursOfOperationMessages.ErrorMessage
              );
            }
          });
      }
    });
  }

  private SetTimeFrames(x: any) {
    x.workingHours.friday.availableTimeFrames = x.workingHours.friday.isOpen
      ? this.getTimeFrameArray(x.workingHours.friday.availableTimeFrames)
      : [];
    x.workingHours.saturday.availableTimeFrames = x.workingHours.saturday.isOpen
      ? this.getTimeFrameArray(x.workingHours.saturday.availableTimeFrames)
      : [];
    x.workingHours.sunday.availableTimeFrames = x.workingHours.sunday.isOpen
      ? this.getTimeFrameArray(x.workingHours.sunday.availableTimeFrames)
      : [];
    x.workingHours.monday.availableTimeFrames = x.workingHours.monday.isOpen
      ? this.getTimeFrameArray(x.workingHours.monday.availableTimeFrames)
      : [];
    x.workingHours.tuesday.availableTimeFrames = x.workingHours.tuesday.isOpen
      ? this.getTimeFrameArray(x.workingHours.tuesday.availableTimeFrames)
      : [];
    x.workingHours.wednesday.availableTimeFrames = x.workingHours.wednesday
      .isOpen
      ? this.getTimeFrameArray(x.workingHours.wednesday.availableTimeFrames)
      : [];
    x.workingHours.thursday.availableTimeFrames = x.workingHours.thursday.isOpen
      ? this.getTimeFrameArray(x.workingHours.thursday.availableTimeFrames)
      : [];
  }

  private getTimeFrameArray(TimeFrames: ITimeInterval[]) {
    const timeFrameArray = [];
    for (const time of TimeFrames) {
      if (time) {
        const fromTime =
          time.fromTime && time.fromTime !== this.DefaultHours
            ? this.ConvertTimeInStringTo24HourFormat(time.fromTime)
            : time.fromTime;
        let toTime = time.toTime
          ? this.ConvertTimeInStringTo24HourFormat(time.toTime)
          : time.toTime;
        if (fromTime === this.DefaultHours) {
          toTime = null;
        }
        if (fromTime && toTime) {
          timeFrameArray.push({ fromTime, toTime });
        }
      }
    }
    return timeFrameArray;
  }

  AddNonWorkingHoliday(formGroup: any) : any{
      this.formService.CallFormMethod<IHolidayList>(formGroup?.form).then((x) => {

        if (!this.IsHolidayNameAlreadyExist(x,formGroup.id)) {
          if (!this.DateFallsInBetween(x,formGroup.id)) {
            if(formGroup.isEditMode){
              let index = this.HolidayListSubject?.value.findIndex(x=>x.id == formGroup.id);
              Object.assign(x, { id: formGroup.id });
              this.HolidayListSubject.value[index]= x;
            }else{
              Object.assign(x, { id: this.uuid });
              this.HolidayListSubject.value.push(x);
            }
            this.HolidayListSubject.next(this.HolidayListSubject.value);
            formGroup?.form.reset();
            this.IsNonWokingEditMode = false;
            this.NonWorkingId= null;
          } else {
            this.AppNotificationService.NotifyError(
              HoursOfOperationMessages.HolidayExistsMessage
            );
          }
        } else {
          this.AppNotificationService.NotifyError(
            HoursOfOperationMessages.DescriptionExistsMessage
          );
        }
      });
  }

  private IsHolidayNameAlreadyExist(x: IHolidayList,id:string) {
    return this.HolidayListSubject.value.some(
      (holiday) => holiday.description === x.description && holiday.id!=id
    );
  }

  private DateFallsInBetween(x: IHolidayList,id?:string) {
    const isDateFallsInBetween = this.HolidayListSubject.value.some(
      (holiday) =>{
        if(holiday.id !== id){
        (new Date(x.fromDate) >= new Date(holiday.fromDate) &&
          new Date(x.fromDate) <= new Date(holiday.toDate)) ||
        (new Date(holiday.fromDate) >= new Date(x.fromDate) &&
          new Date(holiday.fromDate) <= new Date(x.toDate)) && holiday.id!=id
      }
    });

    return isDateFallsInBetween;
  }

  private SetCountries() {
    this.branchAPIService.GetCountries(this.CompanyId)
      .subscribe((countryCodes: string[]) => {
        this.BranchCountriesSubject.next(this.GetCountryObjects(countryCodes));
      });
  }

  public GetCountries() {
    this.subs.sink = this.formService
      .GetAPICall<ICountryDropdownList[]>(
        this.locationBaseAPIUrl + '/countries'
      )
      .subscribe((countries) => {
        this.Countries = countries;
        this.SetCountries();
      });
  }

  private GetCountryObjects(countryCodes: string[]): ICountryDropdownList[] {
    let countries = [];
    if (this.Countries) {
      countries = this.Countries.filter(x => countryCodes.includes(x.countryCode));
    }
    return countries;
  }

  ConvertTimeInStringTo24HourFormat(fromAndToTime: string) {
    const time = fromAndToTime;
    let hrs = Number(time.match(/^(\d+)/)[1]);
    const mins = Number(time.match(/:(\d+)/)[1]);
    const format = time.match(/\s(.*)$/)[1];
    if (format === 'PM' && hrs !== 12) {
      hrs = hrs + 12;
    }
    if (format === 'AM' && hrs === 12) {
      hrs = 0;
    }
    let hours = hrs;
    let minutes = mins;
    if (hrs < 10) {
      hours = 0 + hours;
    }
    if (mins < 10) {
      minutes = 0 + minutes;
    }
    return { hours, minutes };
  }

  checkTimeValidation: ValidatorFn = (
    control: FormGroup
  ): ValidationErrors | null => {
    try {
      const startingTimeField = control.get('fromTime').value;
      const endingTimeField = control.get('toTime').value;

      const startTimeFormat = startingTimeField.match(/\s(.*)$/)[1];
      const endTimeFormat = endingTimeField.match(/\s(.*)$/)[1];
      if (startingTimeField !== this.DefaultHours) {
        this.setValidationsToControls(
          control.get('fromTime'),
          control.get('toTime')
        );
      }

      const startTime = this.ConvertTime12to24(startingTimeField);
      const endTime = this.ConvertTime12to24(endingTimeField);

      let startTimeHrs = Number(startTime.match(/^(\d+)/)[1]);
      let endTimeHrs = Number(endTime.match(/^(\d+)/)[1]);

      const startTimeMins = Number(startTime.match(/:(\d+)/)[1]);
      const endTimeMins = Number(endTime.match(/:(\d+)/)[1]);
      if (startTimeFormat === 'AM' && startTimeHrs === 12) {
        startTimeHrs = 0;
      }
      if (endTimeFormat === 'AM' && endTimeHrs === 12) {
        endTimeHrs = 0;
      }
      const ToTimeInMinutes = endTimeHrs * 60 + endTimeMins;
      const StartTimeMinutes = startTimeHrs * 60 + startTimeMins;

      if (StartTimeMinutes > ToTimeInMinutes) {
        return { greaterTime: true };
      } else if (StartTimeMinutes === ToTimeInMinutes) {
        return {
          invalidEndTime: true,
        };
      } else {
        return null;
      }
    } catch (err) { }
  }



  CreateFormArray(timeFrame, weekFormArrays) {
    weekFormArrays.removeAt(0);
    const timeFrames = this.GetTimeFrames(timeFrame);
    timeFrames.forEach((x) => {
      weekFormArrays.push(this.GetWeekHoursFormGroup(x.fromTime, x.toTime));
    });
  }

  private GetWeekHoursFormGroup(fromTime: string, toTime: string): any {
    return this.formBuilder.group(
      {
        fromTime: [fromTime],
        toTime: [toTime ? toTime : this.DefaultEndHour],
      },
      { validators: this.checkTimeValidation }
    );
  }
}
