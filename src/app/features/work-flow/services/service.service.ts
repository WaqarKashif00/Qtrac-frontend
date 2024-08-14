import { ChangeDetectorRef, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { GroupResult } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AppNotificationService } from 'src/app/core/services/notification.service';
import { cloneObject, isObject } from 'src/app/core/utilities/core-utilities';
import { Service, SurveyQuestionSet } from 'src/app/models/common/work-flow-detail.interface';
import { EmptyHoursValue, WorkingHour } from 'src/app/models/constants/working-hours.constant';
import { HoursOfOperationAPIService } from 'src/app/shared/api-services/hoo-api.service';
import { checkDateValidation, requiredFileType } from 'src/app/shared/validators/common.validator';
import { TranslateService } from '../../../core/services/translate.service';
import { ITimeInterval, IWorkingDay } from '../../scheduler/hours-of-operations/hours-of-operation.interface';
import { WorkflowMessages } from '../message-constant';
import { HoursOfOperation } from '../models/hours-of-operation.interface';
import { IServiceFormGroup, IServiceName } from '../models/service-form-group';
import { SupportedLanguage } from '../models/supported-language';
import { SurveyTemplate } from '../models/survey-template.interface';
import { TicketTemplate } from '../models/ticket-template.interface';
import { AppointmentTemplate, IServiceDescription, IServiceIcon, Service as ServiceRequest, ServiceName } from '../models/work-flow-request.interface';
import { IWorkingDaysAndDates } from '../models/work-flow-response.interface';
import { WorkFlowService } from '../work-flow.service';
import { Days, Months } from '../workflow.constant';

@Injectable()
export class ServiceService extends AbstractComponentService {


  CompanyBaseApiUrl = '/api/company';
  serviceList$: Observable<Service[]>;
  Routings$: Observable<GroupResult[]>;
  SurveyQuestions$: Observable<SurveyQuestionSet[]>
  supportedLanguageList$: Observable<SupportedLanguage[]>;
  supportedLanguages = [];
  isEditingHooOffset: boolean;
  editInProgressHooOffset: FormGroup;
  onAddClickValidation: boolean;
  TempServiceName: any = [];
  TempServiceDescription: any = [];
  TempServiceIcon: any = [];
  get CompanyId() { return this.authStateService.CompanyId; }

  OpenServiceModal$: Observable<boolean>;
  private OpenServiceModalSubject: BehaviorSubject<boolean>;

  HoursOfOperations$: Observable<any[]>;
  private HoursOfOperationsSubject: BehaviorSubject<any[]>;

  SurveyTemplates$: Observable<SurveyTemplate[]>;
  private SurveyTemplatesSubject: BehaviorSubject<SurveyTemplate[]>;

  TicketTemplates$: Observable<TicketTemplate[]>;
  private TicketTemplatesSubject: BehaviorSubject<TicketTemplate[]>;

  Appointments$: Observable<AppointmentTemplate[]>;

  AddEditServiceForm: FormGroup;

  IsEditMode = false;
  count = 0;
  copyCount: number;
  private readonly DefaultHours = EmptyHoursValue;
  private readonly Default24Hour = WorkingHour.Hours[0];

  checkTimeValidation: ValidatorFn = (
    control: FormGroup
  ): ValidationErrors | null => {
    try {
      const startingTimeField = control.get('fromTime').value;
      const endingTimeField = control.get('toTime').value;

      const startTimeFormat = startingTimeField.match(/\s(.*)$/)[1];
      const endTimeFormat = endingTimeField.match(/\s(.*)$/)[1];
      if (startingTimeField !== this.Default24Hour) {
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

  private setValidationsToControls(
    fromTimeControl: AbstractControl,
    toTimeControl: AbstractControl
  ) {
    if (fromTimeControl.value === this.Default24Hour) {
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

  private clearToTimeControlValidations(toTimeControl: AbstractControl) {
    toTimeControl.clearValidators();
    toTimeControl.updateValueAndValidity({ emitEvent: false, onlySelf: true });
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


  get ServiceNamesFormArray() {
    return this.AddEditServiceForm.get('serviceNames') as FormArray;
  }

  get ServiceDescriptionsFormArray() {
    return this.AddEditServiceForm.get('descriptions') as FormArray;
  }

  get ServiceIconFormArray() {
    return this.AddEditServiceForm.get('serviceIconUrls') as FormArray;
  }

  get OnCustomDateFormArray() {
    return this.AddEditServiceForm.controls.operationalWorkingHours.get('onCustomDateWorkingDays') as FormArray;
  }

  get DuringDateRangeFormArray() {
    return this.AddEditServiceForm.controls.operationalWorkingHours.get('duringDateRangeWorkingDays') as FormArray;
  }

  get WeeklyFormGroup() {
    return this.AddEditServiceForm.controls.operationalWorkingHours.get('weeklyWorkingDays') as FormGroup;
  }

  get DailyFormGroup() {
    return this.AddEditServiceForm.controls.operationalWorkingHours.get('dailyWorkingDays') as FormGroup;
  }

  get ServiceIcon() {
    return this.workFlowService.serviceIcons;
  }

  IsServiceNameDialogOpen: boolean;
  IsServiceDescriptionDialogOpen: boolean;
  IsServiceIconDialogOpen: boolean;

  constructor(
    private workFlowService: WorkFlowService,
    private ref: ChangeDetectorRef,
    private translateService: TranslateService,
    private authStateService: AuthStateService,
    private appNotificationService: AppNotificationService,
    private readonly hoursOfOperationAPIService: HoursOfOperationAPIService
  ) {
    super();
    this.InitSubjectAndObservables();
    this.SubscribeSupportedLanguages();
    this.GetHoursOfOperationsDataAPI()
  }

  public InitRequiredAddEditConfigurations() {
    this.InitFormGroup();
    this.PushQueueAndQuestionSetInRoutingSubject();
  }

  private InitSubjectAndObservables() {
    this.serviceList$ = this.workFlowService.Services$;
    this.Routings$ = this.workFlowService.Routings$;
    this.SurveyQuestions$ = this.workFlowService.SurveyQuestionSets$
    this.supportedLanguageList$ = this.workFlowService.SupportedLanguages$;

    this.OpenServiceModalSubject = new BehaviorSubject<boolean>(false);
    this.OpenServiceModal$ = this.OpenServiceModalSubject.asObservable();

    this.HoursOfOperationsSubject = new BehaviorSubject<any[]>([]);
    this.HoursOfOperations$ = this.HoursOfOperationsSubject.asObservable();

    this.SurveyTemplatesSubject = new BehaviorSubject<SurveyTemplate[]>([]);
    this.SurveyTemplates$ = this.SurveyTemplatesSubject.asObservable();

    this.TicketTemplatesSubject = new BehaviorSubject<TicketTemplate[]>([]);
    this.TicketTemplates$ = this.TicketTemplatesSubject.asObservable();

    this.Appointments$ = this.workFlowService.AppointTemplateList$;
  }

  private SubscribeSupportedLanguages() {
    this.subs.sink = this.supportedLanguageList$.subscribe(languages => {
      this.supportedLanguages = languages;
    });
  }

  InitFormGroup() {
    this.AddEditServiceForm = this.formBuilder.group({
      id: [],
      serviceNames: this.formBuilder.array([]),
      descriptions: this.formBuilder.array([]),
      serviceIconUrls: this.formBuilder.array([]),
      routing: [],
      surveyTemplate: [],
      ticketTemplate: [],
      acceptWalkins: [true],
      appointmentTemplate: [],
      acceptAppointments: [],
      averageWaitTime: [null, Validators.pattern('^[0-9]*$')],
      serviceOccur: [],
      hoursOfOperationId: [],
      operationalWorkingHours: this.GetInitOperationalHoursFormGroup(this.SetDefaultValues()),
    });

    this.subs.sink = this.AddEditServiceForm.controls.acceptAppointments.valueChanges.subscribe((x) => {
      if (x) {
        this.AddEditServiceForm.controls.appointmentTemplate.setValidators(Validators.required);
        this.AddEditServiceForm.controls.appointmentTemplate.reset();
      } else {
        this.AddEditServiceForm.controls.appointmentTemplate.clearValidators();
        this.AddEditServiceForm.controls.appointmentTemplate.updateValueAndValidity();
      }
    });

  }

  GetInitOperationalHoursFormGroup(formValues) {
    return this.formBuilder.group({
      weeklyWorkingDays: this.formBuilder.group({
        saturday: this.GetFormGroup(formValues.weeklyWorkingDays.saturday),
        sunday: this.GetFormGroup(formValues.weeklyWorkingDays.sunday),
        monday: this.GetFormGroup(formValues.weeklyWorkingDays.monday),
        tuesday: this.GetFormGroup(formValues.weeklyWorkingDays.tuesday),
        wednesday: this.GetFormGroup(formValues.weeklyWorkingDays.wednesday),
        thursday: this.GetFormGroup(formValues.weeklyWorkingDays.thursday),
        friday: this.GetFormGroup(formValues.weeklyWorkingDays.friday),
      }),
      dailyWorkingDays: this.formBuilder.group({
        saturday: this.GetFormGroup(formValues.dailyWorkingDays.saturday),
        sunday: this.GetFormGroup(formValues.dailyWorkingDays.sunday),
        mondayToFriday: this.GetFormGroup(formValues.dailyWorkingDays.mondayToFriday),
      }),
      onCustomDateWorkingDays: this.formBuilder.array([]),
      duringDateRangeWorkingDays: this.formBuilder.array([]),
    })
  }

  private GetFormGroup(formValues: IWorkingDay): FormGroup {
    return this.formBuilder.group({
      dayId: [formValues.dayId],
      dayText: [formValues.dayText],
      isOpen: [formValues.isOpen],
      availableTimeFrameFormGroup: this.GetDefaultTimeFrameFormGroup(),
      availableTimeFrames: this.formBuilder.array([]),
    });
  }

  GetDefaultTimeFrameFormGroup() {
    return this.formBuilder.group(
      {
        fromTime: [this.DefaultHours, Validators.required],
        toTime: [this.DefaultHours, Validators.required],
      },
      { validators: this.checkTimeValidation }
    )
  }


  SetDefaultValues() {
    const values: IWorkingDaysAndDates = {
      weeklyWorkingDays: {
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
      dailyWorkingDays: {
        sunday: {
          dayId: 0,
          dayText: 'Sunday',
          isOpen: false,
          availableTimeFrames: this.GetDefaultTimeFrames(),
        },
        saturday: {
          dayId: 6,
          dayText: 'Saturday',
          isOpen: false,
          availableTimeFrames: this.GetDefaultTimeFrames(),
        },
        mondayToFriday: {
          dayId: 7,
          dayText: 'MondayToFriday',
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
        toTime: this.DefaultHours,
      },
    ];
  }

  SetEditFormGroupData(service: Service) {
    this.IsEditMode = true;
    this.count = 0;
    this.AddEditServiceForm.patchValue({
      id: service.id,
      routing: service.routing,
      surveyTemplate: service.surveyTemplate,
      ticketTemplate: service.ticketTemplate,
      acceptWalkins: service.acceptWalkins,
      acceptAppointments: service.acceptAppointments,
      appointmentTemplate: service.appointmentTemplate,
      averageWaitTime: service.averageWaitTime,
      serviceOccur: service?.serviceOccur,
      hoursOfOperationId: service?.hoursOfOperationId,
      operationalWorkingHours: service?.operationalWorkingHours
    });
    this.SetServiceFormArray(service.serviceNames);
    this.SetServiceDescriptionFormArray(service.descriptions);

    this.SetServiceIconFormArray(service.serviceIconUrls, service.id);
    switch (service.serviceOccur?.value) {
      case "WEEKLY":
        this.SetWeeklyFromGroup(service.operationalWorkingHours?.weeklyWorkingDays);
        break;
      case "DAILY":
        this.SetDailyFromGroup(service.operationalWorkingHours?.dailyWorkingDays);
        break;
      case "CUSTOM_DATES":
        this.SetOnCustomDateFromArray(service.operationalWorkingHours?.onCustomDateWorkingDays);
        break;
      case "DURING_DATE_RANGE":
        this.SetDuringDateRangeFromArray(service.operationalWorkingHours?.duringDateRangeWorkingDays);
        break;
      default:
        break;
    }
  }

  SetServiceFormArray(serviceNames: ServiceName[]) {
    this.ServiceNamesFormArray.clear();
    this.supportedLanguages.forEach((language: SupportedLanguage) => {

      this.ServiceNamesFormArray.push(this.formBuilder.group(
        {
          languageId: [language.languageCode],
          languageName: [language.language],
          isDefault: [language.isDefault],
          serviceName: [null, Validators.required]
        }));
    });
    if (serviceNames) {
      serviceNames.forEach(service => {
        this.ServiceNamesFormArray.controls.forEach((form: FormGroup) => {
          if (form.value.languageId == service.languageId) {
            form.controls.serviceName.setValue(service.serviceName);
          }
        });
      });

    }
  }

  SetServiceDescriptionFormArray(serviceDescriptions: IServiceDescription[]) {
    this.ServiceDescriptionsFormArray.clear();
    this.supportedLanguages.forEach((language: SupportedLanguage) => {

      this.ServiceDescriptionsFormArray.push(this.formBuilder.group(
        {
          languageId: [language.languageCode],
          languageName: [language.language],
          isDefault: [language.isDefault],
          description: [null]
        }));
    });
    if (serviceDescriptions) {
      serviceDescriptions.forEach(service => {
        this.ServiceDescriptionsFormArray.controls.forEach((form: FormGroup) => {
          if (form.value.languageId == service.languageId) {
            form.controls.description.setValue(service.description);
          }
        });
      });

    }
  }

  SetServiceIconFormArray(serviceIconUrls: IServiceIcon[], serviceId?: string) {
    this.ServiceIconFormArray.clear();
    this.supportedLanguages.forEach((language: SupportedLanguage) => {
      let url = serviceIconUrls?.find(x => x.languageId === language.languageCode)?.url;
      const serviceIcons = this.ServiceIcon?.find(x => x.serviceId == serviceId)?.serviceIcons;

      serviceIcons?.forEach(element => {
        if (typeof (element[element.languageId]) == 'object' && element.languageId == language.languageCode) {
          url = element[element.languageId];
        }
      });

      this.ServiceIconFormArray.push(this.formBuilder.group(
        {
          languageId: [language.languageCode],
          [language.languageCode]: url || '/assets/profileDefaultImage.png',
          languageName: [language.language],
          isDefault: [language.isDefault],
          url: [null, [requiredFileType(['png', 'jpg', 'jpeg'], 4000000)]]
        }));
    });
    if (serviceIconUrls) {
      serviceIconUrls.forEach(service => {
        this.ServiceIconFormArray.controls.forEach((form: FormGroup) => {
          if (form.value.languageId == service.languageId) {
            form.controls.url.setValue(service.url);
          }
        });
      });
    }
  }

  SetWeeklyFromGroup(WeeklyWorkingDays) {
    this.WeeklyFormGroup.patchValue({
      saturday: this.SetWeeklyTimeFrameValue(WeeklyWorkingDays?.saturday),
      sunday: this.SetWeeklyTimeFrameValue(WeeklyWorkingDays?.sunday),
      monday: this.SetWeeklyTimeFrameValue(WeeklyWorkingDays?.monday),
      tuesday: this.SetWeeklyTimeFrameValue(WeeklyWorkingDays?.tuesday),
      wednesday: this.SetWeeklyTimeFrameValue(WeeklyWorkingDays?.wednesday),
      thursday: this.SetWeeklyTimeFrameValue(WeeklyWorkingDays?.thursday),
      friday: this.SetWeeklyTimeFrameValue(WeeklyWorkingDays?.friday),
    });
  }


  SetDailyFromGroup(DailyWorkingDays) {
    this.DailyFormGroup.patchValue({
      saturday: this.SetDailyTimeFrameValue(DailyWorkingDays?.saturday),
      sunday: this.SetDailyTimeFrameValue(DailyWorkingDays?.sunday),
      mondayToFriday: this.SetDailyTimeFrameValue(DailyWorkingDays?.mondayToFriday),
    });
  }


  private SetWeeklyTimeFrameValue(formValues) {
    const day = formValues?.dayText?.toLowerCase();
    formValues.availableTimeFrames.forEach((timeFrame) => {
      (this.WeeklyFormGroup.get(day).get('availableTimeFrames') as FormArray).push(
        this.AvailableTimeFrameDataConvertToFormGroup(timeFrame)
      );
    })
    return this.GetDataPerDay(formValues);
  }

  private SetDailyTimeFrameValue(formValues) {
    const day = formValues?.dayText?.substring(0, 1).toLowerCase().concat(formValues?.dayText?.substring(1, formValues?.dayText?.length))
    formValues.availableTimeFrames.forEach((timeFrame) => {
      (this.DailyFormGroup.get(day).get('availableTimeFrames') as FormArray).push(
        this.AvailableTimeFrameDataConvertToFormGroup(timeFrame)
      );
    })
    return this.GetDataPerDay(formValues);
  }
  private GetDataPerDay(formValues: IWorkingDay) {

    return {
      dayId: formValues?.dayId,
      dayText: formValues?.dayText,
      isOpen: formValues?.isOpen,
      availableTimeFrameFormGroup: {
        fromTime: this.DefaultHours,
        toTime: this.DefaultHours,
      },
    };
  }
  SetOnCustomDateFromArray(OnCustomDateWorkingDays) {
    this.OnCustomDateFormArray.clear();
    if (OnCustomDateWorkingDays?.length > 0) {
      OnCustomDateWorkingDays?.forEach((OnCustomDateWorkingDay) => {
        const onCustomFromDate = new Date(OnCustomDateWorkingDay?.fromDate);
        this.OnCustomDateFormArray.push(this.formBuilder.group({
          dateId: OnCustomDateWorkingDay?.dateId,
          dateText: OnCustomDateWorkingDay?.dateText,
          fromDate: onCustomFromDate,
          toDate: OnCustomDateWorkingDay?.toDate,
          availableTimeFrameFormGroup: this.GetDefaultTimeFrameFormGroup(),
          availableTimeFrames: this.SetAvailableTimeFrames(OnCustomDateWorkingDay?.availableTimeFrames)
        }));
      })
    }
  }

  SetDuringDateRangeFromArray(DuringDateRangeWorkingDays) {
    this.DuringDateRangeFormArray.clear();
    if (DuringDateRangeWorkingDays?.length > 0) {
      DuringDateRangeWorkingDays?.forEach((DuringDateRangeWorkingDay) => {
        const duringRangeFromDate = new Date(DuringDateRangeWorkingDay?.fromDate);
        const duringRangeToDate = new Date(DuringDateRangeWorkingDay?.toDate);
        this.DuringDateRangeFormArray.push(this.formBuilder.group({
          dateId: DuringDateRangeWorkingDay?.dateId,
          dateText: DuringDateRangeWorkingDay?.dateText,
          fromDate: duringRangeFromDate,
          toDate: duringRangeToDate,
          availableTimeFrameFormGroup: this.GetDefaultTimeFrameFormGroup(),
          availableTimeFrames: this.SetAvailableTimeFrames(DuringDateRangeWorkingDay?.availableTimeFrames)
        }));
      })
    }
  }
  private SetAvailableTimeFrames(availableTimeFrames): FormArray {
    let fromArray: FormArray = this.formBuilder.array([])
    availableTimeFrames?.forEach((availableTimeFrame) => {
      fromArray.push(
        this.AvailableTimeFrameDataConvertToFormGroup(availableTimeFrame)
      );
    });
    return fromArray
  }

  private AvailableTimeFrameDataConvertToFormGroup(avaliabletimeForm): FormGroup {
    return this.formBuilder.group(
      {
        fromTime: [avaliabletimeForm.fromTime, Validators.required],
        toTime: (avaliabletimeForm.fromTime === this.Default24Hour) ? [avaliabletimeForm.toTime] : [avaliabletimeForm.toTime, Validators.required],
      },
      { validators: this.checkTimeValidation }
    );
  }


  SetEditData(service) {
    this.SetEditFormGroupData(service);
  }

  OpenModalAndInitAddConfigurations() {
    this.InitRequiredAddConfigurations();
    this.OpenModal();
  }

  OpenModalAndInitEditConfigurations() {
    this.InitRequiredEditConfigurations();
    this.OpenModal();
  }

  private InitRequiredEditConfigurations() {
    this.InitFormGroup();
    this.SetSupportedlanguageServiceNameFormArray();
    this.SetSupportedlanguageServiceDescriptionFormArray();
    this.SetSupportedlanguageServiceIconsFormArray();
  }

  private InitRequiredAddConfigurations() {
    this.SetDefaultFormGroup();
    this.InitFormGroup();
    this.SetSupportedlanguageServiceNameFormArray();
    this.SetSupportedlanguageServiceDescriptionFormArray();
    this.SetSupportedlanguageServiceIconsFormArray();
  }

  SetSupportedlanguageServiceDescriptionFormArray() {
    const serviceDescriptions: IServiceDescription[] = [];
    if (this.supportedLanguages) {
      this.supportedLanguages.forEach(language => {
        serviceDescriptions.push(
          {
            isDefault: language.isDefault,
            languageId: language.languageCode,
            languageName: language.language,
            description: null
          });
      });
    }
    this.SetServiceDescriptionFormArray(serviceDescriptions);
  }

  SetSupportedlanguageServiceIconsFormArray() {
    const serviceIcons: IServiceIcon[] = [];
    if (this.supportedLanguages) {
      this.supportedLanguages.forEach(language => {
        serviceIcons.push(
          {
            isDefault: language.isDefault,
            languageId: language.languageCode,
            languageName: language.language,
            url: null
          });
      });
    }
    this.SetServiceIconFormArray(serviceIcons);
  }

  private SetDefaultFormGroup() {
    this.AddEditServiceForm.patchValue({
      id: null,
      serviceNames: [],
      description: [],
      serviceIconUrls: [],
      routing: null,
      surveyTemplate: null,
      ticketTemplate: null,
      acceptWalkins: true,
      acceptAppointments: null,
      averageWaitTime: null,
      serviceOccur: null,
      hoursOfOperationId: null,
      operationalWorkingHours: null,
    });
  }

  private SetSupportedlanguageServiceNameFormArray() {

    const serviceNames: ServiceName[] = [];
    if (this.supportedLanguages) {
      this.supportedLanguages.forEach(language => {
        serviceNames.push(
          {
            isDefault: language.isDefault,
            languageId: language.languageCode,
            languageName: language.language,
            serviceName: null
          });
      });
    }
    this.SetServiceFormArray(serviceNames);
  }


  translate(defaultText: string, formArray: FormArray, property: string) {
    if (defaultText) {

      this.subs.sink = this.translateService.GetTranslatedTexts(defaultText).subscribe(TranslateResponses => {
        if (TranslateResponses && TranslateResponses.length !== 0) {
          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < TranslateResponses.length; index++) {
            const TranslatedResponse = TranslateResponses[index];
            // tslint:disable-next-line: prefer-for-of
            for (let ind = 0; ind < formArray.length; ind++) {
              const serviceNameFormGroup = formArray.at(ind) as FormGroup;
              if (ind !== 0 && TranslatedResponse.languageId === serviceNameFormGroup.get('languageId').value) {
                serviceNameFormGroup.get(property).setValue(TranslatedResponse.translatedText);
              }
            }
          }
        }
        this.ref.detectChanges();
      });
    }
    this.ref.detectChanges();
  }




  CloseModalAndResetForm() {
    this.OpenServiceModalSubject.next(false);
    this.AddEditServiceForm.reset();
  }

  Add(request: FormGroup): void {
    let firstServiceName = this.ServiceNamesFormArray.at(0).get('serviceName').value;
    firstServiceName = firstServiceName ? firstServiceName.toLowerCase().trim() : '';
    const serviceNameAlreadyExist = this.workFlowService.GetServices()
      .some(service => service.serviceNames.some(serviceName => serviceName.serviceName.toLowerCase().trim() === firstServiceName && !service.isDeleted));

    if (serviceNameAlreadyExist) {
      this.ServiceNamesFormArray.at(0).get('serviceName').setErrors({ isExists: true });
      this.AppNotificationService.NotifyError('Service with same name already exists');
      return;
    }

    if (!request.controls.acceptAppointments.value && !request.controls.acceptWalkins.value) {
      this.appNotificationService.NotifyError(`Accept walkins and accept appointment both can't be disable together.`);
      return;
    }



    this.formService.CallFormMethod<IServiceFormGroup>(request).then((response) => {
      // Just to remove the extra offset which is not needed.
      const serviceRequest = this.GetServiceRequest(response, this.uuid);
      this.workFlowService.AddService(serviceRequest);
      this.CloseModalAndResetForm();
      this.ref.detectChanges();
    });
  }

  private GetServiceRequest(response: IServiceFormGroup, id: string): ServiceRequest {
    return {
      id,
      appointmentTemplate: response.appointmentTemplate && isObject(response.appointmentTemplate) ? {
        id: response.appointmentTemplate.id,
        templateName: response.appointmentTemplate.templateName
      } : null,
      acceptAppointments: response.acceptAppointments,
      acceptWalkins: response.acceptWalkins,
      routing: response.routing,
      serviceNames: response.serviceNames,
      descriptions: response.descriptions,
      serviceIconUrls: response.serviceIconUrls,
      surveyTemplate: response.surveyTemplate,
      ticketTemplate: response.ticketTemplate,
      averageWaitTime: response.averageWaitTime,
      serviceOccur: response.serviceOccur,
      hoursOfOperationId: response.hoursOfOperationId,
      operationalWorkingHours: response.operationalWorkingHours,
    };
  }



  CopyService(service: ServiceRequest) {
    this.copyCount = 0;
    const cloneService = cloneObject(service);
    if (cloneService.serviceNames) {
      const serviceName = cloneService.serviceNames.find(x => x.isDefault).serviceName;
      this.isCopyExistCount(serviceName);
      cloneService.serviceNames.forEach(serviceName => {
        for (let i = 1; i <= this.copyCount; i++) {
          serviceName.serviceName += WorkflowMessages.CopyPostFixMessage;
        }
      });
    }
    cloneService.id = this.uuid;
    this.workFlowService.AddService(cloneService);
  }

  private isCopyExistCount(serviceName: any) {

    this.copyCount = this.copyCount + 1;
    const isCopyExist = this.CheckServiceCopyNameExist(serviceName + WorkflowMessages.CopyPostFixMessage);
    if (isCopyExist) {
      this.isCopyExistCount(serviceName + WorkflowMessages.CopyPostFixMessage);
    }
  }

  private CheckServiceCopyNameExist(serviceName: string) {
    const serviceList = this.workFlowService.ServicesSubject.value;
    for (let i = 0; i < serviceList.length; i++) {
      const serviceNames = serviceList[i].serviceNames;
      for (let j = 0; j < serviceNames.length; j++) {
        if (serviceNames[j].serviceName == serviceName) {
          return true;
        }
      }
    }
    return false;
  }

  Edit(request: FormGroup): void {
    const id = request.get('id').value;
    const surveyTemplate = request.get('surveyTemplate').value;
    let firstServiceName = this.ServiceNamesFormArray.at(0).get('serviceName').value;
    firstServiceName = firstServiceName ? firstServiceName.toLowerCase().trim() : '';
    const serviceNameAlreadyExist = this.workFlowService.GetServices()
      .some(service => service.id !== id &&
        service.serviceNames.some(serviceName => serviceName.serviceName.toLowerCase().trim() === firstServiceName && !service.isDeleted));

    if (serviceNameAlreadyExist) {
      this.ServiceNamesFormArray.at(0).get('serviceName').setErrors({ isExists: true });
      this.AppNotificationService.NotifyError('Service with same name already exists');
      return;
    }

    if (!request.controls.acceptWalkins.value && !request.controls.acceptAppointments.value) {
      this.appNotificationService.NotifyError(`Accept walkins and accept appointment both can't be disable together.`);
      return;
    }
    if (surveyTemplate && !surveyTemplate.id) {
      request.get('surveyTemplate').setValue(null);
    }
    this.formService.CallFormMethod<IServiceFormGroup>(request).then((response) => {
      const serviceRequest = this.GetServiceRequest(response, response.id);
      this.workFlowService.EditService(serviceRequest, this.ServiceIcon);
      this.CloseModalAndResetForm();
    })
  }

  Delete(id: string): void {
    this.workFlowService.DeleteService(id);
  }

  OpenModal() {
    this.OpenServiceModalSubject.next(true);
  }

  CloseModal() {
    this.OpenServiceModalSubject.next(false);
  }

  public CallMultipleDropDownAPI(): any {
    const companyId = this.CompanyId;
    this.subs.sink = this.formService.CombineAPICall(
      this.GetSurveyTemplates(companyId),
      this.GetTicketTemplates(companyId),
    ).subscribe(([surveyTemplates, ticketTemplates]) => {
      this.SurveyTemplatesSubject.next(surveyTemplates);
      this.TicketTemplatesSubject.next(ticketTemplates);
    });
  }

  GetHoursOfOperationsDataAPI() {
    this.hoursOfOperationAPIService.GetAll(this.CompanyId).subscribe((c: any) => {
      this.HoursOfOperationsSubject.next(c);
    });
  }

  public GetHoursOfOperations(companyId: string) {
    return this.getHoursOfOperationsData(companyId);
  }

  private getHoursOfOperationsData(companyId: string): Observable<HoursOfOperation[]> {
    const hoursOfOperations: HoursOfOperation[] = [
      { id: '9599fb96-bc23-4f5e-98f9-b3fe9687ec42', type: 'Loan specialist schedule' },
      { id: 'ace9ffa2-133d-4769-b15c-2f8cfd64a905', type: 'Location hours' }
    ];
    return of(hoursOfOperations);
  }

  public GetSurveyTemplates(companyId: string) {
    return this.getSurveyTemplatesData(companyId);
  }

  private getSurveyTemplatesData(companyId: string): Observable<SurveyTemplate[]> {
    const surveyTemplates: SurveyTemplate[] = [
      { id: '1f455e82-e6c4-4e67-8dc4-1e4452aa0630', type: 'General Survey' },
      { id: '7db28ff2-ae5c-4a73-9e69-7efdeec3a856', type: 'Quick Survey' }
    ];
    return of(surveyTemplates);
  }

  public GetTicketTemplates(companyId: string) {
    return this.getTicketTemplatesData(companyId);
  }

  private getTicketTemplatesData(companyId: string): Observable<TicketTemplate[]> {
    const ticketTemplates: TicketTemplate[] = [
      { id: '4b2db96a-12b6-431e-8277-2c203277bfca', type: 'General ticket' },
      { id: 'cd90859a-71d3-4918-9394-4c09db74e78d', type: 'Promotional ticket' }
    ];
    return of(ticketTemplates);
  }

  createDescriptionTempData() {
    this.ServiceDescriptionsFormArray.controls.forEach((formGroup: FormGroup) => {
      formGroup.get("description").markAsPristine()
      formGroup.get("description").markAsUntouched()
    })
    this.ServiceDescriptionsFormArray.value?.forEach((element: IServiceDescription) => {
      this.TempServiceDescription.push({
        language: element.languageId,
        description: element.description
      });
    });
    this.IsServiceDescriptionDialogOpen = true;
  }

  createNameTempData() {
    this.ServiceNamesFormArray.controls.forEach((formGroup: FormGroup) => {
      formGroup.get("serviceName").markAsPristine()
      formGroup.get("serviceName").markAsUntouched()
    })
    this.ServiceNamesFormArray.value?.forEach((element: IServiceName) => {
      this.TempServiceName.push({
        language: element.languageId,
        serviceName: element.serviceName
      });
    });
    this.IsServiceNameDialogOpen = true;
  }

  createIconTempData() {

    this.ServiceIconFormArray.value?.forEach((element: IServiceIcon) => {
      this.TempServiceIcon.push({
        language: element.languageId,
        url: element.url,
        file: element[element.languageId]
      });
      element[element.languageId] = element.url;
    });
    this.IsServiceIconDialogOpen = true;
  }

  PushQueueAndQuestionSetInRoutingSubject() {
    this.workFlowService.PushQueueAndQuestionSetInRoutingSubject();
  }

  changeListData(data: any) {
    this.workFlowService.ServicesSubject.next(data);
  }

  setNameTempDataOnCancel() {
    this.ServiceNamesFormArray.controls.forEach((formGroup: FormGroup) => {
      const tempService = this.TempServiceName?.find(x => x.language == formGroup.get('languageId').value);
      formGroup.get('serviceName').setValue(tempService?.serviceName);
    });
    this.TempServiceName = [];
    this.IsServiceNameDialogOpen = false;
  }

  setDescriptionTempDataOnCancel() {
    this.ServiceDescriptionsFormArray.controls.forEach((formGroup: FormGroup) => {
      const tempServiceDescription = this.TempServiceDescription?.find(x => x.language == formGroup.get('languageId').value);
      formGroup.get('description').setValue(tempServiceDescription?.description);
    });
    this.TempServiceDescription = [];
    this.IsServiceDescriptionDialogOpen = false;
  }

  setIconTempDataOnCancel() {

    this.ServiceIconFormArray.controls.forEach((formGroup: FormGroup) => {
      const tempServiceIcon = this.TempServiceIcon?.find(x => x.language == formGroup.get('languageId').value);
      formGroup.get('url').setValue(tempServiceIcon?.url);
      formGroup.get(tempServiceIcon?.language).setValue(tempServiceIcon?.file || '/assets/profileDefaultImage.png');
    });
    this.TempServiceIcon = [];
    this.IsServiceIconDialogOpen = false;

  }

  SaveNameForm() {
    this.ServiceNamesFormArray.controls.forEach((element: FormGroup) => {
      element.controls.serviceName.setValue(element.value.serviceName);
      element.controls.serviceName?.markAsDirty()
      element.controls.ServiceName?.markAsTouched()
    });
    this.ServiceNamesFormArray.updateValueAndValidity();
    if (this.ServiceNamesFormArray.invalid) {
      this.IsServiceNameDialogOpen = true;
      return;
    }
    this.IsServiceNameDialogOpen = false;
    this.TempServiceName = [];
  }

  SaveDescriptionForm() {
    this.ServiceDescriptionsFormArray.controls.forEach((element: FormGroup) => {
      element.controls.description.setValue(element.value.description);
      element.controls.description.markAsDirty()
      element.controls.description.markAsTouched()
    });
    this.ServiceDescriptionsFormArray.updateValueAndValidity();
    if (this.ServiceDescriptionsFormArray.invalid) {
      this.IsServiceDescriptionDialogOpen = true;
      return;
    }
    this.IsServiceDescriptionDialogOpen = false;
    this.TempServiceDescription = [];
  }

  SaveIconForm() {
    this.ServiceIconFormArray.controls.forEach((x: FormGroup) => {
      if (typeof (x.value[x.value.languageId]) != 'object') {
        x.get(x.value.languageId).setValue(this.TempServiceIcon?.find(y => y.language == x.value.languageId)?.file);
      }
    });
    this.ServiceIconFormArray.updateValueAndValidity();

    this.ServiceIconFormArray.controls.forEach((x: FormGroup) => {
      if (x.value[x.value.languageId] && typeof (x.value[x.value.languageId]) == 'object'
        &&
        !this.formService.IsValidImageFile(x.get(x.value.languageId).value)
      ) {
        x.get('url').setErrors({ requiredFileType: true });
        return;
      } else {
        x.get('url').updateValueAndValidity();
      }
    });
    this.ServiceIconFormArray.updateValueAndValidity();

    if (this.ServiceIconFormArray.invalid) {
      this.IsServiceIconDialogOpen = true;
      return;
    }
    this.IsServiceIconDialogOpen = false;
    this.TempServiceIcon = [];
  }

  findChoices(searchText: string) {
    return this.workFlowService.findChoices(searchText);
  }

  public AddFormArray(timeFormArray, avaliabletimeForm) {
    if (avaliabletimeForm.value.fromTime === this.Default24Hour) {
      avaliabletimeForm.controls.toTime.clearValidators();
      avaliabletimeForm.controls.toTime.updateValueAndValidity();
    } else {
      avaliabletimeForm.controls.toTime.setValidators(Validators.required);
    }
    if (avaliabletimeForm.valid) {
      timeFormArray.push(this.GetAvailableTimeFrameFormGroupData(avaliabletimeForm));
      avaliabletimeForm.reset();
    }
  }

  public RemoveItemFromArray(formArray: FormArray, index: number) {
    if (formArray.length > 0) {
      formArray.removeAt(index);
    }
  }

  private GetAvailableTimeFrameFormGroupData(avaliabletimeForm): FormGroup {
    return this.formBuilder.group(
      {
        fromTime: [avaliabletimeForm.value.fromTime, Validators.required],
        toTime: (avaliabletimeForm.value.fromTime === this.Default24Hour) ? [avaliabletimeForm.value.toTime] : [avaliabletimeForm.value.toTime, Validators.required],
      },
      { validators: this.checkTimeValidation }
    );
  }

  AddDateArray(fromDate, toDate, dateFormArray) {
    dateFormArray.push(this.formBuilder.group({
      dateId: fromDate.getDate().toString() + (fromDate.getMonth() + 1).toString() + fromDate.getFullYear().toString(),
      dateText: this.GetDateText(fromDate, toDate),
      fromDate: fromDate,
      toDate: toDate,
      availableTimeFrameFormGroup: this.GetDefaultTimeFrameFormGroup(),
      availableTimeFrames: this.formBuilder.array([]),
    }))

  }

  private GetDateText(fromDate, toDate) {
    const FromDate = new Date(fromDate);
    const ToDate = (toDate === null) ? null : new Date(toDate);
    return (ToDate === null) ? (Days[FromDate.getDay()] + ' ' + FromDate.getDate() + ((FromDate.getDate() % 10 > 3) ? 'th' : '') + ',' + Months[FromDate.getMonth()] + ' ' + FromDate.getFullYear()) :
      (Days[FromDate.getDay()] + ' ' + FromDate.getDate() + ((FromDate.getDate() % 10 > 3) ? 'th' : '') + ',' + ((Months[FromDate.getMonth()] === Months[ToDate.getMonth()]) ? '' : Months[FromDate.getMonth()]) + ' ' + ((FromDate.getFullYear() === ToDate.getFullYear()) ? '' : FromDate.getFullYear()) + ' - ' + Days[ToDate.getDay()] + ' ' + ToDate.getDate() + ((ToDate.getDate() % 10 > 3) ? 'th' : '') + ',' + Months[ToDate.getMonth()] + ' ' + ToDate.getFullYear())

  }
}
