import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AppointmentSchedulerMessages } from 'src/app/features/appointment-scheduler/scheduler.messages';
import { IWorkFlowDropDown } from 'src/app/features/utility-configuration/kiosk/kiosk-add/kiosk-layout/Models/workflow-dropdown.interface';
import { Validations } from 'src/app/models/constants/validation.constant';
import {
  AllowNotifySms,
  AppointmentSchedulerPageName,
  EnableMultiVerification,
  EnableTermsConditions,
  SchedulerType,
  ShowIconInFooter
} from 'src/app/models/enums/appointment-scheduler.enum';
import { AppointmentSchedulerAPIService } from 'src/app/shared/api-services/appointment-scheduler-api.service';
import { WorkflowAPIService } from 'src/app/shared/api-services/workflow-api.service';
import { ILanguageDropdownList } from '../../../../models/common/language-dropdownlist.interface';
import { IAppointmentNotificationPreferences } from '../../models/appointment-notification-preferences.interface';
import { Announcement } from '../../models/controls/announcement.control';
import { FooterProperties } from '../../models/controls/footer.control';
import { Control } from '../../models/controls/control';
import { DesignerPanel } from '../../models/controls/designer-panel.control';
import { TicketProperty } from '../../models/controls/ticket-property.control';
import { IFirstAvailable } from '../../models/first-available.interface';
import {
  BranchWorkingTime,
  NearestBranchDisplayData
} from '../../models/nearest-branch-display-data.interface';
import { ISchedulerControlData } from '../../models/schedular-controls-data.interface';
import { ISchedulerData } from '../../models/schedular-data.interface';
import { IQuestionItem } from '../../models/scheduler-execution-data.interface';
import { ISchedularService } from '../../models/sechduler-services.interface';
import { IAvailableSlot, IMiles } from '../../models/selection-item.interface';
import { IStepDetails } from '../../models/step-details.interface';
import { WorkingDay } from '../../models/working-day';
import { SchedulersService } from '../schedulers.service';
import { CompanyAPIService } from '../../../../shared/api-services/company-api.service';
import { ICurrentLanguage } from '../../models/current-language.interface';
import { Language } from '../../models/enum/language-enum';
import { AppointmentTextInterface } from '../../models/appointment-text.interface';
import { AppointmentTextEnum, AppointmentTextTypeEnum } from '../../models/enum/appointment-text.enum';

@Injectable()
export class AppointmentSchedulerService extends AbstractComponentService {
  //#region  Property Declarations
  private SelectedPageSubject: BehaviorSubject<string>;
  SelectedPage$: Observable<string>;

  private SchedulerControlsDataSubject: BehaviorSubject<ISchedulerControlData>;
  SchedulerControlsData$: Observable<ISchedulerControlData>;

  WorkFlowList$: Observable<IWorkFlowDropDown[]>;
  private WorkFlowListSubject: BehaviorSubject<IWorkFlowDropDown[]>;

  StepDetails$: Observable<IStepDetails>;
  private StepDetailsSubject: BehaviorSubject<IStepDetails>;

  SchedulerServices$: Observable<ISchedularService[]>;
  private SchedulerServicesSubject: BehaviorSubject<ISchedularService[]>;

  Opened$: Observable<boolean>;
  private OpenedSubject: BehaviorSubject<boolean>;

  IsEditMode$: Observable<boolean>;
  private IsEditModeSubject: BehaviorSubject<boolean>;

  SchedulerFirstAvailableTimeSlot$: Observable<IFirstAvailable[]>;
  private SchedulerFirstAvailableTimeSlotSubject: BehaviorSubject<
    IFirstAvailable[]
  >;

  SchedulerSelectedDatesTimeSlot$: Observable<IFirstAvailable>;
  private SchedulerSelectedDatesTimeSlotSubject: BehaviorSubject<IFirstAvailable>;

  WorkingDays$: Observable<WorkingDay[]>;
  private WorkingDaysSubject: BehaviorSubject<WorkingDay[]>;

  ShowCancelButton$: Observable<boolean>;
  private ShowCancelButtonSubject: BehaviorSubject<boolean>;

  ShowSubmitButton$: Observable<boolean>;
  private ShowSubmitButtonSubject: BehaviorSubject<boolean>;

  ShowContinueButton$: Observable<boolean>;
  private ShowContinueButtonSubject: BehaviorSubject<boolean>;

  NearestBranchDisplayData$: Observable<NearestBranchDisplayData[]>;
  private NearestBranchDisplayDataSubject: BehaviorSubject<
    NearestBranchDisplayData[]
  >;

  Miles$: Observable<IMiles[]>;
  private MilesSubject: BehaviorSubject<IMiles[]>;

  AppointmentNotificationPreferences$: Observable<IAppointmentNotificationPreferences>;
  private AppointmentNotificationPreferencesSubject: BehaviorSubject<IAppointmentNotificationPreferences>;

  GlobalQuestions$: Observable<IQuestionItem[]>;
  private GlobalQuestionsSubject: BehaviorSubject<IQuestionItem[]>;

  Languages$: Observable<ILanguageDropdownList[]>;
  private LanguagesSubject: BehaviorSubject<ILanguageDropdownList[]>;

  private SelectedLanguageSubject: BehaviorSubject<ICurrentLanguage>;
  SelectedLanguage$: Observable<ICurrentLanguage>;

  private AppointmentTextsSubject: BehaviorSubject<AppointmentTextInterface>
  AppointmentTexts$: Observable<AppointmentTextInterface>

  DefaultLanguageCode = Language.English;

  SelectedWorkFlowValue: string;

  //#endregion

  //#region LifeCycle Initialization
  constructor(
    private readonly appointmentSchedulerAPIService: AppointmentSchedulerAPIService,
    private readonly workflowAPIService: WorkflowAPIService,
    private schedulersService: SchedulersService,
    private readonly companyAPIService: CompanyAPIService,
  ) {
    super();
    this.InitializeSubjects();
    this.InitializeData();
    this.subs.sink = this.companyAPIService.GetLanguages(this.authService.CompanyId)
      .subscribe((x: ILanguageDropdownList[]) => {
        this.LanguagesSubject.next(x);
        if (x.length > 0) {
          const data: ICurrentLanguage = {
            defaultLanguage: x.find((x) => x.isDefault).languageCode,
            selectedLanguage: x.find((x) => x.isDefault).languageCode,
          };
          this.SendNextLanguageSubject(data);
        }
      });
  }

  private InitializeSubjects() {
    const announcementStyles = {
      text: { en: 'Our website will be down from 2 am to 3 am tomorrow.' },
      color: '#ef5555',
      backColor: '#faebd7',
      showAnnouncement: true,
    };
    const footerStyles = {
      text: { en: '' },
      color: '#ef5555',
      backColor: '#ebebeb',
    }
    const tabTexts = {
      serviceTabText: { en: 'Service' },
      informationTabText: { en: 'Information' },
      locationTabText: { en: 'Location' },
      appointmentTabText: { en: 'Appointment' },
      reviewTabText: { en: 'Review' }
    }

    const headingTexts = {
      serviceHeadingText: { en: 'Services Available' },
      informationHeadingText: { en: 'GENERAL QUESTIONS' },
      locationHeadingText: { en: 'Find Nearest Location' },
      appointmentHeadingText: { en: 'Schedule Appointment' },
      reviewHeadingText: { en: 'Appointment Notification Preferences' }
    }
    this.SelectedPageSubject = new BehaviorSubject<string>('');
    this.SelectedPage$ = this.SelectedPageSubject.asObservable();
    this.OpenedSubject = new BehaviorSubject<boolean>(true);
    this.Opened$ = this.OpenedSubject.asObservable();
    this.IsEditModeSubject = new BehaviorSubject<boolean>(this.IsEditMode());
    this.IsEditMode$ = this.IsEditModeSubject.asObservable();
    this.WorkFlowListSubject = new BehaviorSubject<IWorkFlowDropDown[]>([]);
    this.WorkFlowList$ = this.WorkFlowListSubject.asObservable();
    this.GlobalQuestionsSubject = new BehaviorSubject<IQuestionItem[]>(
      this.GetDefaultQuestions()
    );
    this.GlobalQuestions$ = this.GlobalQuestionsSubject.asObservable();
    this.SchedulerServicesSubject = new BehaviorSubject<ISchedularService[]>(
      this.GetSchedulerDefaultServices()
    );
    this.SchedulerServices$ = this.SchedulerServicesSubject.asObservable();
    this.StepDetailsSubject = new BehaviorSubject<IStepDetails>(
      this.GetDefaultSteps()
    );
    this.StepDetails$ = this.StepDetailsSubject.asObservable();
    this.SchedulerControlsDataSubject =
      new BehaviorSubject<ISchedulerControlData>(
        this.GetDefaultSchedularControlData(
          null,
          '#270f0f',
          '#eaeaea',
          this.authService.CompanyLogoUrl,
          SchedulerType.LocationFirst,
          ShowIconInFooter.YES,
          EnableMultiVerification.DISABLED,
          '#ffd90b',
          '#180101',
          '#ffffff',
          '#ae8b8b',
          '#ffffff',
          '#000000',
          '#ed682c',
          '#ffffff',
          { en: 'Continue' },
          '#ffffff',
          '#0c0000',
          { en: 'Back' },
          AllowNotifySms.NO,
          AllowNotifySms.YES,
          '',
          announcementStyles.text,
          announcementStyles.color,
          announcementStyles.backColor,
          announcementStyles.showAnnouncement,
          this.IsEditMode() ? '' : this.GetDefaultTemplateName(),
          false,
          EnableTermsConditions.YES,
          footerStyles.text,
          footerStyles.color,
          footerStyles.backColor,
          tabTexts.serviceTabText,
          tabTexts.informationTabText,
          tabTexts.locationTabText,
          tabTexts.appointmentTabText,
          tabTexts.reviewTabText,
          headingTexts.serviceHeadingText,
          headingTexts.informationHeadingText,
          headingTexts.locationHeadingText,
          headingTexts.appointmentHeadingText,
          headingTexts.reviewHeadingText,
        )
      );
    this.SchedulerControlsData$ =
      this.SchedulerControlsDataSubject.asObservable();
    this.NearestBranchDisplayDataSubject = new BehaviorSubject<
      NearestBranchDisplayData[]
    >(this.GetNearestBranchData());
    this.NearestBranchDisplayData$ =
      this.NearestBranchDisplayDataSubject.asObservable();
    this.MilesSubject = new BehaviorSubject<IMiles[]>(this.GetMiles());
    this.Miles$ = this.MilesSubject.asObservable();
    this.WorkingDaysSubject = new BehaviorSubject<WorkingDay[]>([]);
    this.WorkingDays$ = this.WorkingDaysSubject.asObservable();
    this.SchedulerFirstAvailableTimeSlotSubject = new BehaviorSubject<
      IFirstAvailable[]
    >(this.GetDefaultFirstAvailableTimeSlot());
    this.SchedulerFirstAvailableTimeSlot$ =
      this.SchedulerFirstAvailableTimeSlotSubject.asObservable();
    this.SchedulerSelectedDatesTimeSlotSubject =
      new BehaviorSubject<IFirstAvailable>(this.GetDefaultTimeSlot());
    this.SchedulerSelectedDatesTimeSlot$ =
      this.SchedulerSelectedDatesTimeSlotSubject.asObservable();
    this.ShowCancelButtonSubject = new BehaviorSubject<boolean>(true);
    this.ShowCancelButton$ = this.ShowCancelButtonSubject.asObservable();
    this.ShowSubmitButtonSubject = new BehaviorSubject<boolean>(false);
    this.ShowSubmitButton$ = this.ShowSubmitButtonSubject.asObservable();
    this.ShowContinueButtonSubject = new BehaviorSubject<boolean>(true);
    this.ShowContinueButton$ = this.ShowContinueButtonSubject.asObservable();
    this.AppointmentNotificationPreferencesSubject =
      new BehaviorSubject<IAppointmentNotificationPreferences>(
        this.GetDefaultNotificationPreferencesData()
      );
    this.AppointmentNotificationPreferences$ =
      this.AppointmentNotificationPreferencesSubject.asObservable();
    this.LanguagesSubject = new BehaviorSubject<ILanguageDropdownList[]>([]);
    this.Languages$ = this.LanguagesSubject.asObservable();

    this.SelectedLanguageSubject = new BehaviorSubject<ICurrentLanguage>({
      defaultLanguage: this.DefaultLanguageCode,
      selectedLanguage: this.DefaultLanguageCode,
    });
    this.SelectedLanguage$ = this.SelectedLanguageSubject.asObservable();

    this.AppointmentTextsSubject = new BehaviorSubject<AppointmentTextInterface>(this.getDefaultAppointmentTexts());
    this.AppointmentTexts$ = this.AppointmentTextsSubject.asObservable();

  }

  // private InitializeObservables() {
 
  //   this.AppointmentTexts$ = this.schedulersService.AppointmentTexts$
  // }

  GetDefaultQuestions(): IQuestionItem[] {
    const questions: IQuestionItem[] = [];
    questions.push({
      answer: null,
      isQuestionVisible: true,
      isVisible: true,
      itemId: '1',
      itemText: 'What is your name?',
      itemType: 'TEXT',
      itemTypeSetting: null,
      required: false,
      setId: null,
    });
    questions.push({
      answer: null,
      isQuestionVisible: true,
      isVisible: true,
      itemId: '1',
      itemText: 'What is your Address?',
      itemType: 'TEXT',
      itemTypeSetting: null,
      required: false,
      setId: null,
    });
    return questions;
  }

  GetNearestBranchData(): NearestBranchDisplayData[] {
    const data: NearestBranchDisplayData[] = [];
    data.push({
      branchAddress: '1930 Anderson vilah, LA 402234',
      branchDistance: '5 miles',
      branchId: '12345',
      branchLatitude: 12.2323,
      branchLongitude: 34.2323,
      branchName: 'LA Rimpah',
      countryCode: 'USA',
      branchPhoneNumber: '(232) 323232',
      branchServices: ['Account Service'],
      isBranchSelected: true,
      isPreviouslyVisited: false,
      milesInDistance: 4,
      workingHours: this.GetWorkingHours(),
    });
    data.push({
      branchAddress: '1930 milson part, LA 402234',
      branchDistance: '5 miles',
      branchId: '12346',
      branchLatitude: 12.2323,
      branchLongitude: 36.2323,
      branchName: 'Milson Vella',
      countryCode: 'USA',
      branchPhoneNumber: '(232) 8989898',
      branchServices: ['Demo Service'],
      isBranchSelected: false,
      isPreviouslyVisited: false,
      milesInDistance: 4,
      workingHours: this.GetWorkingHours(),
    });
    return data;
  }

  GetWorkingHours(): BranchWorkingTime[] {
    const list: BranchWorkingTime[] = [];
    list.push({ day: 'Sat', isOpen: true, time: [] });
    list.push({ day: 'Sun', isOpen: true, time: [] });
    list.push({ day: 'Mon', isOpen: false, time: [] });
    list.push({ day: 'Tues', isOpen: false, time: [] });
    list.push({ day: 'Wed', isOpen: true, time: [] });
    list.push({ day: 'Thurs', isOpen: true, time: [] });
    list.push({ day: 'Fri', isOpen: true, time: [] });
    return list;
  }

  private GetDefaultTemplateName(): string {
    const AppointmentSchedulerNameList: number[] = [];

    if (this.schedulersService.AppointmentSchedulers$ != null && this.schedulersService.AppointmentSchedulers$ != undefined) {
      this.schedulersService.AppointmentSchedulers$
        .subscribe((response) => {
          response.map(x => x.designerPanel.name).forEach(x => {
            const regexp = new RegExp('^appointment-\\d+$');
            if (regexp.test(x.toLowerCase())) {
              const digit = x.match(/\d+/);
              if (digit != null) {
                AppointmentSchedulerNameList.push(parseInt(digit[0]));
              }
            }
          });

          if (AppointmentSchedulerNameList != null && AppointmentSchedulerNameList != undefined
            && AppointmentSchedulerNameList.length > 0) {
            AppointmentSchedulerNameList.sort(function (x, y) { return x - y; });
          }
        });
    }

    if (AppointmentSchedulerNameList == null || AppointmentSchedulerNameList == undefined || AppointmentSchedulerNameList.length <= 0) {
      if ((this.schedulersService.AppointmentSchedulers$ == null || this.schedulersService.AppointmentSchedulers$ == undefined)
        && this.browserStorageService.SchedulerName) {
        return this.browserStorageService.SchedulerName;
      }

      this.browserStorageService.SetSchedulerName('Appointment-1');
      return 'Appointment-1';
    }

    const count = AppointmentSchedulerNameList.slice(-1)[0] + 1;
    const missing = new Array();

    for (let i = 1; i <= count; i++) {
      if (AppointmentSchedulerNameList.indexOf(i) == -1) {
        missing.push(i);
      }
    }

    this.browserStorageService.SetSchedulerName('Appointment-' + missing[0]);
    return 'Appointment-' + missing[0];
  }

  private GetMiles(): IMiles[] {
    return [
      {
        text: '5 miles',
        value: 5,
        isSelected: false,
      },
      {
        text: '10 miles',
        value: 10,
        isSelected: false,
      },
      {
        text: '20 miles',
        value: 20,
        isSelected: false,
      },
      {
        text: '50 miles',
        value: 50,
        isSelected: false,
      },
      {
        text: '100 miles',
        value: 100,
        isSelected: true,
      },
    ];
  }

  GetDefaultTimeSlot(): IFirstAvailable {
    const currentDate = new Date();
    const slots = this.GetDefaultAvailableTimeSlot();
    slots[0].isSelected = true;
    return {
      availableSpots: slots,
      selectedDateText: currentDate.toDateString(),
      selectedDateValue: currentDate.toString(),
    };
  }

  GetDefaultFirstAvailableTimeSlot(): IFirstAvailable[] {
    const currentDate = new Date();
    const slots: IFirstAvailable[] = [];
    slots.push({
      availableSpots: this.GetDefaultAvailableTimeSlot(),
      selectedDateText: currentDate.toDateString(),
      selectedDateValue: currentDate.toString(),
    });
    currentDate.setDate(currentDate.getDate() + 1);
    slots.push({
      availableSpots: this.GetDefaultAvailableTimeSlot(),
      selectedDateText: currentDate.toDateString(),
      selectedDateValue: currentDate.toString(),
    });
    currentDate.setDate(currentDate.getDate() + 1);
    slots.push({
      availableSpots: this.GetDefaultAvailableTimeSlot(),
      selectedDateText: currentDate.toDateString(),
      selectedDateValue: currentDate.toString(),
    });
    slots[0].availableSpots[0].isSelected = true;
    return slots;
  }

  GetDefaultAvailableTimeSlot(): IAvailableSlot[] {
    const slots: IAvailableSlot[] = [];
    slots.push({
      isSelected: false,
      text: '10:00 AM',
      value: {
        hours: 10,
        minutes: 0,
      },
    });
    slots.push({
      isSelected: false,
      text: '12:00 PM',
      value: {
        hours: 12,
        minutes: 0,
      },
    });
    slots.push({
      isSelected: false,
      text: '02:00 PM',
      value: {
        hours: 14,
        minutes: 0,
      },
    });
    slots.push({
      isSelected: false,
      text: '04:00 PM',
      value: {
        hours: 16,
        minutes: 0,
      },
    });
    return slots;
  }

  private InitializeData() {
    if (this.IsEditMode()) {
      this.InitializeEditableLayoutData();
    } else {
      this.SetAddModeData();
    }
  }

  private IsEditMode() {
    return this.browserStorageService.SchedulerId ? true : false;
  }

  private InitializeEditableLayoutData() {
    this.OpenedSubject.next(false);
    this.subs.sink = this.workflowAPIService
      .GetDropdownList(this.authService.CompanyId)
      .subscribe((list: IWorkFlowDropDown[]) => {
        this.appointmentSchedulerAPIService
          .Get<ISchedulerData>(
            this.authService.CompanyId,
            this.browserStorageService.SchedulerId
          )
          .subscribe((data: ISchedulerData) => {
            this.SetEditModeData(data);
          });
        this.WorkFlowListSubject.next(list);
      });
  }

  private SetAddModeData() {
    this.subs.sink = this.workflowAPIService
      .GetDropdownList(this.authService.CompanyId)
      .subscribe((list: IWorkFlowDropDown[]) => {
        this.SetFirstWorkFlowIdAsDefaultSelectedWorkflowValue(list);

        this.IsEditModeSubject.next(false);
        this.OpenedSubject.next(true);
        this.WorkFlowListSubject.next(list);
        this.browserStorageService.RemoveSchedulerId();
      });
  }

  private SetEditModeData(data: ISchedulerData) {
    this.UpdateControlProperties(
      this.SchedulerControlsDataSubject.value.designerPanel,
      data.designerPanel
    );
    this.UpdateControlProperties(
      this.SchedulerControlsDataSubject.value.ticketProperties,
      data.ticketProperties
    );
    const announcementStyles = {
      text: { en: 'Our website will be down from 2 am to 3 am tomorrow.' },
      color: '#ef5555',
      backColor: '#faebd7',
      showAnnouncement: true,
    };
    const footerStyles = {
      text: { en: '' },
      color: '#ef5555',
      backColor: '#ebebeb',
    }
    const tabTexts = {
      serviceTabText: { en: 'Service' },
      informationTabText: { en: 'Information' },
      locationTabText: { en: 'Location' },
      appointmentTabText: { en: 'Appointment' },
      reviewTabText: { en: 'Review' }
    }
    const headingTexts = {
      serviceHeadingText: { en: 'Services Available' },
      informationHeadingText: { en: 'GENERAL QUESTIONS' },
      locationHeadingText: { en: 'Find Nearest Location' },
      appointmentHeadingText: { en: 'Schedule Appointment' },
      reviewHeadingText: { en: 'Appointment Notification Preferences' }
    }
    const schedulerData: ISchedulerControlData = {
      designerPanel: Object.create(
        this.SchedulerControlsDataSubject.value.designerPanel
      ),
      ticketProperties: Object.create(
        this.SchedulerControlsDataSubject.value.ticketProperties
      ),
      announcement: Object.create(
        this.SchedulerControlsDataSubject.value.announcement
      ),
      footerProperties: Object.create(
        this.SchedulerControlsDataSubject.value.footerProperties
      )
    };
    schedulerData.designerPanel.workflowName =
      this.WorkFlowListSubject.value.find(
        (x) => x.workFlowId == data.designerPanel.workflowId
      )?.name;
    this.SelectedWorkFlowValue = data.designerPanel.workflowId;
    this.browserStorageService.SetSchedulerId(data.schedulerId);

    schedulerData.designerPanel.form.patchValue({
      name: data.designerPanel.name,
      workFlowId: data.designerPanel.workflowId,
      headerColor: data.designerPanel.headerColor,
      headerBackgroundColor: data.designerPanel.headerBackgroundColor,
      schedulerType: data.designerPanel.schedulerType,
      showLaviIconInFooter: data.designerPanel.showLaviIconInFooter,
      enableMultiVerification: data.designerPanel.enableMultiVerification,
      imageFileURL: data.designerPanel.imageFileURL,
      activeBackColor: data.designerPanel.activeBackColor,
      activeTextColor: data.designerPanel.activeTextColor,
      inActiveBackColor: data.designerPanel.inActiveBackColor,
      inActiveTextColor: data.designerPanel.inActiveTextColor,
      formBackColor: data.designerPanel.formBackColor,
      formTextColor: data.designerPanel.formTextColor,
      primaryButtonBackColor: data.designerPanel.primaryButtonBackColor,
      primaryButtonTextColor: data.designerPanel.primaryButtonTextColor,
      primaryButtonText: data.designerPanel.primaryButtonText || { en: 'Continue' },
      secondaryButtonBackColor: data.designerPanel.secondaryButtonBackColor,
      secondaryButtonTextColor: data.designerPanel.secondaryButtonTextColor,
      secondaryButtonText: data.designerPanel.secondaryButtonText || { en: 'Back' },
      showServiceIconsOnly: data.designerPanel.showServiceIconsOnly || false,
      serviceTabText: data.designerPanel.serviceTabText || tabTexts.serviceTabText,
      informationTabText: data.designerPanel.informationTabText || tabTexts.informationTabText,
      locationTabText: data.designerPanel.locationTabText || tabTexts.locationTabText,
      appointmentTabText: data.designerPanel.appointmentTabText || tabTexts.appointmentTabText,
      reviewTabText: data.designerPanel.reviewTabText || tabTexts.reviewTabText,
      serviceHeadingText: data.designerPanel.serviceHeadingText || headingTexts.serviceHeadingText,
      informationHeadingText: data.designerPanel.informationHeadingText || headingTexts.informationHeadingText,
      locationHeadingText: data.designerPanel.locationHeadingText || headingTexts.locationHeadingText,
      appointmentHeadingText: data.designerPanel.appointmentHeadingText || headingTexts.appointmentHeadingText,
      reviewHeadingText: data.designerPanel.reviewHeadingText || headingTexts.reviewHeadingText,
    });
    schedulerData.ticketProperties.form.patchValue({
      notifyViaSMS: data.ticketProperties.notifyViaSMS,
      notifyViaEmail: data.ticketProperties.notifyViaEmail,
      termsAndConditionsUrl: data.ticketProperties.termsAndConditionsUrl,
      enableTermsConditions: data.ticketProperties.enableTermsConditions || EnableTermsConditions.YES
    });
    schedulerData.announcement.form.patchValue({
      color: data?.announcement?.color || announcementStyles.color,
      backColor: data?.announcement?.backColor || announcementStyles.backColor,
      showAnnouncement: data?.announcement?.showAnnouncement || announcementStyles.showAnnouncement,
      text: data?.announcement?.text && typeof (data?.announcement?.text) === 'string' ? { en: data?.announcement?.text } : data?.announcement?.text || announcementStyles.text
    });
    schedulerData.footerProperties.form.patchValue({
      color: data?.footerProperties?.color || footerStyles.color,
      backColor: data?.footerProperties?.backColor || footerStyles.backColor,
      text: data?.footerProperties?.text && typeof (data?.footerProperties?.text) === 'string' ? { en: data?.footerProperties?.text } : data?.footerProperties?.text || footerStyles.text
    });
    if (data.designerPanel.imageFileURL) {
      schedulerData.designerPanel.imageFileURL =
        data.designerPanel.imageFileURL;
    }
    this.ChangeSchedulerSteps(data.designerPanel.schedulerType);
    this.IsEditModeSubject.next(true);
    this.OpenedSubject.next(false);
    this.SchedulerControlsDataSubject.next(schedulerData);
  }

  UpdateControlProperties(control: Control, obj: Object) {
    for (const formControl in obj) {
      if (control[formControl] != undefined) {
        control[formControl] = obj[formControl];
      }
    }
  }

  private SetFirstWorkFlowIdAsDefaultSelectedWorkflowValue(
    list: IWorkFlowDropDown[]
  ) {
    if (list.length > 0) {
      this.SelectedWorkFlowValue = list[0].workFlowId;
    }
  }

  //#endregion

  //#region Executable Functions
  Save() {
    const schedulerData = this.GetModifiedSchedulerData();
    if (this.IsValidateData(schedulerData)) {
      const fileUploadAPIs = this.GetFileUploadUrlApis(schedulerData);
      if (fileUploadAPIs.length > 0) {
        this.formService.CombineAPICall(fileUploadAPIs).subscribe((x) => {
          this.MakeSaveAPICall(schedulerData);
        });
      } else {
        this.MakeSaveAPICall(schedulerData);
      }
    }
  }

  IsValidateData(schedulerData: ISchedulerData) {
    let isValid = true;
    const regexp = new RegExp(Validations.UrlRegX);

    if (!schedulerData.designerPanel.name) {
      this.AppNotificationService.NotifyError(
        AppointmentSchedulerMessages.AppointmentSchedulerNameNotEntered
      );
      isValid = false;
    }
    else if (schedulerData.ticketProperties.termsAndConditionsUrl && !regexp.test(schedulerData.ticketProperties.termsAndConditionsUrl)) {
      isValid = false;
    }

    return isValid;
  }

  private MakeSaveAPICall(schedulerData: ISchedulerData) {
    this.appointmentSchedulerAPIService
      .Save(this.authService.CompanyId, schedulerData)
      .subscribe((result) => {
        this.browserStorageService.SetSchedulerId(schedulerData.schedulerId);
        this.AppNotificationService.Notify(
          AppointmentSchedulerMessages.AppointmentSchedulerSaved
        );
        this.routeHandlerService.RedirectToAppointmentSchedulerPageListPage();
      });
  }

  SaveAsDraft() {
    const schedulerData = this.GetModifiedSchedulerData();
    if (this.IsValidateData(schedulerData)) {
      const fileUploadAPIs = this.GetFileUploadUrlApis(schedulerData);
      if (fileUploadAPIs.length > 0) {
        this.formService.CombineAPICall(fileUploadAPIs).subscribe((x) => {
          this.MakeSaveAsDraftAPICall(schedulerData);
        });
      } else {
        this.MakeSaveAsDraftAPICall(schedulerData);
      }
    }
  }

  private MakeSaveAsDraftAPICall(schedulerData: ISchedulerData) {
    this.appointmentSchedulerAPIService
      .SaveAsDraft(this.authService.CompanyId, schedulerData)
      .subscribe((result) => {
        this.browserStorageService.SetSchedulerId(schedulerData.schedulerId);
        this.AppNotificationService.Notify(
          AppointmentSchedulerMessages.AppointmentSchedulerDrafted
        );
        this.routeHandlerService.RedirectToAppointmentSchedulerPageListPage();
      });
  }

  private GetFileUploadUrlApis(postData: ISchedulerData) {
    const fileUploadAPIs = [];
    if (this.SchedulerControlsDataSubject.value.designerPanel.imageFile) {
      fileUploadAPIs.push(
        this.UploadHeaderBackGroundImageAndSetBackGroundURLInPostData(postData)
      );
    }
    return fileUploadAPIs;
  }

  private UploadHeaderBackGroundImageAndSetBackGroundURLInPostData(
    postData: ISchedulerData
  ) {
    return this.formService
      .GetImageUrl(
        this.SchedulerControlsDataSubject.value.designerPanel.imageFile
      )
      .pipe(
        tap((url) => {
          postData.designerPanel.imageFileURL = url;
        })
      );
  }

  GetModifiedSchedulerData() {
    const data: ISchedulerData = {
      companyId: this.authService.CompanyId,
      schedulerId: this.browserStorageService.SchedulerId
        ? this.browserStorageService.SchedulerId
        : this.uuid,
      designerPanel: {
        name: this.SchedulerControlsDataSubject.value.designerPanel.name,
        workflowId: this.SelectedWorkFlowValue,
        enableMultiVerification:
          this.SchedulerControlsDataSubject.value.designerPanel
            .enableMultiVerification,
        headerBackgroundColor:
          this.SchedulerControlsDataSubject.value.designerPanel
            .headerBackgroundColor,
        headerColor:
          this.SchedulerControlsDataSubject.value.designerPanel.headerColor,
        imageFileURL:
          this.SchedulerControlsDataSubject.value.designerPanel.imageFileURL,
        schedulerType:
          this.SchedulerControlsDataSubject.value.designerPanel.schedulerType,
        showLaviIconInFooter:
          this.SchedulerControlsDataSubject.value.designerPanel
            .showLaviIconInFooter,
        activeBackColor:
          this.SchedulerControlsDataSubject.value.designerPanel.activeBackColor,
        activeTextColor:
          this.SchedulerControlsDataSubject.value.designerPanel.activeTextColor,
        inActiveBackColor:
          this.SchedulerControlsDataSubject.value.designerPanel
            .inActiveBackColor,
        inActiveTextColor:
          this.SchedulerControlsDataSubject.value.designerPanel
            .inActiveTextColor,
        formBackColor:
          this.SchedulerControlsDataSubject.value.designerPanel.formBackColor,
        formTextColor:
          this.SchedulerControlsDataSubject.value.designerPanel.formTextColor,
        primaryButtonBackColor:
          this.SchedulerControlsDataSubject.value.designerPanel
            .primaryButtonBackColor,
        primaryButtonTextColor:
          this.SchedulerControlsDataSubject.value.designerPanel
            .primaryButtonTextColor,
        primaryButtonText:
          this.SchedulerControlsDataSubject.value.designerPanel
            .primaryButtonText,
        secondaryButtonBackColor:
          this.SchedulerControlsDataSubject.value.designerPanel
            .secondaryButtonBackColor,
        secondaryButtonTextColor:
          this.SchedulerControlsDataSubject.value.designerPanel
            .secondaryButtonTextColor,
        secondaryButtonText:
          this.SchedulerControlsDataSubject.value.designerPanel
            .secondaryButtonText,
        showServiceIconsOnly:
          this.SchedulerControlsDataSubject.value.designerPanel
            .showServiceIconsOnly,
        serviceTabText:
          this.SchedulerControlsDataSubject.value.designerPanel
            .serviceTabText,
        informationTabText:
          this.SchedulerControlsDataSubject.value.designerPanel
            .informationTabText,
        locationTabText:
          this.SchedulerControlsDataSubject.value.designerPanel
            .locationTabText,
        appointmentTabText:
          this.SchedulerControlsDataSubject.value.designerPanel
            .appointmentTabText,
        reviewTabText:
          this.SchedulerControlsDataSubject.value.designerPanel
            .reviewTabText,
            serviceHeadingText:
            this.SchedulerControlsDataSubject.value.designerPanel
              .serviceHeadingText,
          informationHeadingText:
            this.SchedulerControlsDataSubject.value.designerPanel
              .informationHeadingText,
          locationHeadingText:
            this.SchedulerControlsDataSubject.value.designerPanel
              .locationHeadingText,
          appointmentHeadingText:
            this.SchedulerControlsDataSubject.value.designerPanel
              .appointmentHeadingText,
          reviewHeadingText:
            this.SchedulerControlsDataSubject.value.designerPanel
              .reviewHeadingText,
      },
      ticketProperties: {
        notifyViaEmail:
          this.SchedulerControlsDataSubject.value.ticketProperties
            .notifyViaEmail,
        notifyViaSMS:
          this.SchedulerControlsDataSubject.value.ticketProperties.notifyViaSMS,
        termsAndConditionsUrl:
          this.SchedulerControlsDataSubject.value.ticketProperties.termsAndConditionsUrl,
        enableTermsConditions:
          this.SchedulerControlsDataSubject.value.ticketProperties.enableTermsConditions
      },
      announcement: {
        color: this.SchedulerControlsDataSubject.value.announcement.color,
        backColor: this.SchedulerControlsDataSubject.value.announcement.backColor,
        showAnnouncement: this.SchedulerControlsDataSubject.value.announcement.showAnnouncement,
        text: this.SchedulerControlsDataSubject.value.announcement.text
      },
      footerProperties: {
        color: this.SchedulerControlsDataSubject.value.footerProperties.color,
        backColor: this.SchedulerControlsDataSubject.value.footerProperties.backColor,
        text: this.SchedulerControlsDataSubject.value.footerProperties.text
      }
    };

    return data;
  }

  ChangeWorkFlow() {
    this.OpenedSubject.next(true);
  }

  ChangePage(value: string) {
    this.SelectedPageSubject.next(value);
  }

  UpdateDesignerData(data: DesignerPanel) {
    this.SchedulerControlsDataSubject.value.designerPanel = Object.create(data);
    this.UpdateSchedulerControlsDataSubject();
  }

  UpdateTicketPropertyData(data: TicketProperty) {
    this.SchedulerControlsDataSubject.value.ticketProperties =
      Object.create(data);
    this.UpdateSchedulerControlsDataSubject();
  }

  UpdateAnnouncementData(data: Announcement) {
    this.SchedulerControlsDataSubject.value.announcement =
      Object.create(data);
    this.UpdateSchedulerControlsDataSubject();
  }

  UpdateFooterData(data: FooterProperties) {
    this.SchedulerControlsDataSubject.value.footerProperties =
      Object.create(data);
    this.UpdateSchedulerControlsDataSubject();
  }

  SendWorkFlowToLayoutComponent() {
    this.SchedulerControlsDataSubject.value.designerPanel.workflowName =
      this.WorkFlowListSubject.value.find(
        (x) => x.workFlowId == this.SelectedWorkFlowValue
      ).name;
    this.OpenedSubject.next(false);
    this.SchedulerControlsDataSubject.next(
      this.SchedulerControlsDataSubject.value
    );
  }

  ChangeSelectedWorkFlowId(workFlowId: string) {
    this.SelectedWorkFlowValue = workFlowId;
  }

  CloseModel() {
    if (this.IsEditModeSubject.value) {
      this.OpenedSubject.next(false);
    } else {
      this.routeHandlerService.RedirectToAppointmentSchedulerPageListPage();
    }
  }

  ChangeSchedulerSteps(value: string) {
    let label = null;
    const stepsData = this.GetDefaultSteps();
    if (value === 'Location First') {
      label = 'NearestBranchSelectionPage';
      this.ChangePage(
        AppointmentSchedulerPageName.PreviouslyVisitedBranchSelectionPage
      );
    } else if (value === 'Service First') {
      label = 'AvailableServiceSelectionPage';
      this.ChangePage(
        AppointmentSchedulerPageName.AvailableServiceSelectionPage
      );
    } else if (value === 'Questions First') {
      label = 'InformationGatheringPage';
      this.ChangePage(
        AppointmentSchedulerPageName.AvailableServiceSelectionPage
      );
      const stepElementIndex = stepsData.steps.findIndex((x) => x.id == label);
      const stepElement = stepsData.steps.find((x) => x.id == label);
      stepsData.steps.splice(stepElementIndex, 1);
      const serviceElementIndex = stepsData.steps.findIndex((x) => x.id == 'AvailableServiceSelectionPage');
      const serviceElement = stepsData.steps.find((x) => x.id == 'AvailableServiceSelectionPage');
      stepsData.steps.splice(serviceElementIndex, 1);
      stepsData.steps.unshift(serviceElement, stepElement);
      this.StepDetailsSubject.next(Object.create(stepsData));
    }
    if (value !== 'Questions First') {
      const stepElementIndex = stepsData.steps.findIndex((x) => x.id == label);
      const stepElement = stepsData.steps.find((x) => x.id == label);
      stepsData.steps.splice(stepElementIndex, 1);
      stepsData.steps.unshift(stepElement);
      this.StepDetailsSubject.next(Object.create(stepsData));
    }
  }

  OnDestroy() {
    this.browserStorageService.RemoveSchedulerId();
  }
  //#endregion

  //#region Common functions

  private UpdateSchedulerControlsDataSubject() {
    this.SchedulerControlsDataSubject.next(
      this.SchedulerControlsDataSubject.value
    );
  }

  //#endregion

  //#region Default Data Get Functions
  GetDefaultNotificationPreferencesData(): IAppointmentNotificationPreferences {
    return {
      emailAddress: null,
      isEmailAddressChecked: false,
      isPhonNumberChecked: false,
      isTermsAndConditionChecked: false,
      phoneNumber: null,
    };
  }

  private GetDefaultSteps(): IStepDetails {
    const schedulerData = this.SchedulerControlsDataSubject?.value.designerPanel;
    const selectedLanguage = this.SelectedLanguageSubject?.value.selectedLanguage || this.SelectedLanguageSubject?.value.defaultLanguage
    return {
      isLinear: false,
      steps: [
        {
          id: AppointmentSchedulerPageName.NearestBranchSelectionPage,
          label: schedulerData?.locationTabText[selectedLanguage] || 'Location',
          pageName: [
            'NearestBranchSelectionPage',
            'PreviouslyVisitedBranchSelectionPage',
          ],
          isValid: true,
          stepDescription:
            'Location 5674 -576 Spring Street, Los Angeles, CA 90014',
          isVisited: false,
          isDefaultSelected: false
        },
        {
          label: schedulerData?.serviceTabText[selectedLanguage] || 'Service',
          id: AppointmentSchedulerPageName.AvailableServiceSelectionPage,
          pageName: ['AvailableServiceSelectionPage'],
          isValid: true,
          stepDescription: 'Open a New Account',
          isVisited: false,
          isDefaultSelected: false

        },
        {
          label: schedulerData?.appointmentTabText[selectedLanguage] || 'Appointment',
          id: AppointmentSchedulerPageName.AppointmentSchedulePage,
          pageName: ['AppointmentSchedulePage'],
          isValid: true,
          stepDescription: 'Thursday, January 4th, 2021 at 11:30 am',
          isVisited: false,
          isDefaultSelected: false

        },
        {
          id: AppointmentSchedulerPageName.InformationGatheringPage,
          label: schedulerData?.informationTabText[selectedLanguage] || 'Information',
          pageName: ['InformationGatheringPage'],
          isValid: true,
          stepDescription: 'Information',
          isVisited: false,
          isDefaultSelected: false

        },
        {
          id: AppointmentSchedulerPageName.AppointmentNotificationPreferencePage,
          label: schedulerData?.reviewTabText[selectedLanguage] || 'Review',
          pageName: ['AppointmentNotificationPreferencePage'],
          isValid: true,
          stepDescription: 'Review',
          isVisited: false,
          isDefaultSelected: false

        },
      ],
    };
  }

  private GetSchedulerDefaultServices(): ISchedularService[] {
    const Services: ISchedularService[] = [];
    Services.push({
      itemId: '001',
      isSelected: false,
      name: 'Pickup Debit Card',
      url: '/../../assets/img/services.jpg',
    });
    Services.push({
      itemId: '002',
      isSelected: false,
      name: 'Open New Account',
      url: '/../../assets/img/services.jpg',
    });
    Services.push({
      itemId: '003',
      isSelected: false,
      name: 'Make a Deposit',
      url: '/../../assets/img/services.jpg',
    });
    return Services;
  }

  private GetDefaultSchedularControlData(
    workflowId: string,
    color: string,
    backgroundColor: string,
    logoURL: string,
    schedulerType: string,
    showLaviIconInFooter: string,
    enableMultiVerification: string,
    activeBackColor: string,
    activeTextColor: string,
    inActiveBackColor: string,
    inActiveTextColor: string,
    formBackColor: string,
    formTextColor: string,
    primaryButtonBackColor: string,
    primaryButtonTextColor: string,
    primaryButtonText: object,
    secondaryButtonBackColor: string,
    secondaryButtonTextColor: string,
    secondaryButtonText: object,
    notifyViaSMS: string,
    notifyViaEmail: string,
    termsAndConditionsUrl: string,
    announcementText: any,
    announcementColor: string,
    announcementBackColor: string,
    showAnnouncement: boolean,
    name: string,
    showServiceIconsOnly: boolean,
    enableTermsConditions: string,
    footerText: object,
    footerColor: string,
    footerBackColor: string,
    serviceTabText: object,
    informationTabText: object,
    locationTabText: object,
    appointmentTabText: object,
    reviewTabText: object,
    serviceHeadingText: object,
    informationHeadingText: object,
    locationHeadingText: object,
    appointmentHeadingText: object,
    reviewHeadingText: object,
  ): ISchedulerControlData {
    return {
      designerPanel: this.GetDesignerPanelControl(
        workflowId,
        color,
        backgroundColor,
        logoURL,
        schedulerType,
        showLaviIconInFooter,
        enableMultiVerification,
        activeBackColor,
        activeTextColor,
        inActiveBackColor,
        inActiveTextColor,
        formBackColor,
        formTextColor,
        primaryButtonBackColor,
        primaryButtonTextColor,
        primaryButtonText,
        secondaryButtonBackColor,
        secondaryButtonTextColor,
        secondaryButtonText,
        name,
        showServiceIconsOnly,
        serviceTabText,
        informationTabText,
        locationTabText,
        appointmentTabText,
        reviewTabText,
        serviceHeadingText,
        informationHeadingText,
        locationHeadingText,
        appointmentHeadingText,
        reviewHeadingText,
      ),
      ticketProperties: this.GetTicketPropertyControl(
        notifyViaSMS,
        notifyViaEmail,
        termsAndConditionsUrl,
        enableTermsConditions
      ),
      announcement: this.GetAnnouncementControl(announcementColor, announcementBackColor, announcementText, showAnnouncement),
      footerProperties: this.GetFooterControl(footerText, footerColor, footerBackColor)
    };
  }

  private GetAnnouncementControl(announcementColor: string, announcementBackColor: string,
    announcementText: any, showAnnouncement: boolean): Announcement {
    return new Announcement(this.formBuilder, announcementColor, announcementBackColor, announcementText, showAnnouncement);
  }

  private GetFooterControl(footerText: any, footerColor: string,
    footerBackColor: string): FooterProperties {
    return new FooterProperties(this.formBuilder, footerColor, footerBackColor, footerText);
  }
  private GetTicketPropertyControl(
    notifyViaSMS: string,
    notifyViaEmail: string,
    termsAndConditionsUrl: string,
    enableTermsConditions: string
  ): TicketProperty {
    return new TicketProperty(this.formBuilder, notifyViaSMS, notifyViaEmail, termsAndConditionsUrl, enableTermsConditions);
  }

  private GetDesignerPanelControl(
    workflowId: string,
    color: string,
    backgroundColor: string,
    logoURL: string,
    schedulerType: string,
    showLaviIconInFooter: string,
    enableMultiVerification: string,
    activeBackColor: string,
    activeTextColor: string,
    inActiveBackColor: string,
    inActiveTextColor: string,
    formBackColor: string,
    formTextColor: string,
    primaryButtonBackColor: string,
    primaryButtonTextColor: string,
    primaryButtonText: object,
    secondaryButtonBackColor: string,
    secondaryButtonTextColor: string,
    secondaryButtonText: object,
    name: string,
    showServiceIconsOnly: boolean,
    serviceTabText: object,
    informationTabText: object,
    locationTabText: object,
    appointmentTabText: object,
    reviewTabText: object,
    serviceHeadingText: object,
    informationHeadingText: object,
    locationHeadingText: object,
    appointmentHeadingText: object,
    reviewHeadingText: object
  ): DesignerPanel {
    return new DesignerPanel(
      this.formBuilder,
      workflowId,
      color,
      backgroundColor,
      logoURL,
      schedulerType,
      showLaviIconInFooter,
      enableMultiVerification,
      activeBackColor,
      activeTextColor,
      inActiveBackColor,
      inActiveTextColor,
      formBackColor,
      formTextColor,
      primaryButtonBackColor,
      primaryButtonTextColor,
      primaryButtonText,
      secondaryButtonBackColor,
      secondaryButtonTextColor,
      secondaryButtonText,
      name,
      showServiceIconsOnly,
      serviceTabText,
      informationTabText,
      locationTabText,
      appointmentTabText,
      reviewTabText,
      serviceHeadingText,
      informationHeadingText,
      locationHeadingText,
      appointmentHeadingText,
      reviewHeadingText,
    );
  }

  ConvertLanguageArrayToObject(langArray) {
    return this.schedulersService.ConvertTranslatedLanguageArrayToObject(langArray);
  }

  SendNextLanguageSubject(value: ICurrentLanguage) {
    this.SelectedLanguageSubject.next(value);
  }

  public updateStepLabel(text: any, type: string) {
    this.StepDetailsSubject.value?.steps.forEach((step) => {
      if (step.id == type) {
        step.label = text[this.SelectedLanguageSubject.value?.selectedLanguage || this.SelectedLanguageSubject.value?.selectedLanguage]
      }
    });
    this.StepDetailsSubject.next(Object.create(this.StepDetailsSubject.value));
  }

  getDefaultAppointmentTexts(): AppointmentTextInterface {
    return {
      [AppointmentTextTypeEnum.appointmentLocationPlaceHolderType]: AppointmentTextEnum.appointmentLocationPlaceHolderText,
      [AppointmentTextTypeEnum.appointmentFirstAvailableButtonType]: AppointmentTextEnum.appointmentFirstAvailableButtonText,
      [AppointmentTextTypeEnum.appointmentSelectDifferentDateButtonType]: AppointmentTextEnum.appointmentSelectDifferentDateButtonText,
      [AppointmentTextTypeEnum.appointmentNotAvailableTextType]: AppointmentTextEnum.appointmentNotAvailableText,
      [AppointmentTextTypeEnum.appointmentSupplementalQuestionHeaderType]: AppointmentTextEnum.appointmentSupplementalQuestionHeaderText,
      [AppointmentTextTypeEnum.appointmentReviewPageHeaderType]: AppointmentTextEnum.appointmentReviewPageHEaderText,
      [AppointmentTextTypeEnum.appointmentReviewPageDataMessageType]: AppointmentTextEnum.appointmentReviewPageDataMessageText,
      [AppointmentTextTypeEnum.appointmentReviewPageEmailFieldType]: AppointmentTextEnum.appointmentReviewPageEmailFieldText,
      [AppointmentTextTypeEnum.appointmentReviewPageSubmitButtonType]: AppointmentTextEnum.appointmentReviewPageSubmitButtonText,
      [AppointmentTextTypeEnum.appointmentSuccessPageThankYouMessageType]: AppointmentTextEnum.appointmentSuccessPageThankYouMessageText,
      [AppointmentTextTypeEnum.appointmentSuccessPageBookedMessageType]: AppointmentTextEnum.appointmentSuccessPageBookedMessageText,
      [AppointmentTextTypeEnum.appointmentSuccessPageConfirmedMessageType]: AppointmentTextEnum.appointmentSuccessPageConfirmedMessageText,
      [AppointmentTextTypeEnum.appointmentSuccessPageReSchedulerMessageType]: AppointmentTextEnum.appointmentSuccessPageReSchedulerMessageText,
      [AppointmentTextTypeEnum.appointmentSuccessPageCancelledMessageType]: AppointmentTextEnum.appointmentSuccessPageCancelledMessageText,
      [AppointmentTextTypeEnum.appointmentSuccessPageDetailHeaderType]: AppointmentTextEnum.appointmentSuccessPageDetailHeaderText,
      [AppointmentTextTypeEnum.appointmentSuccessPageNotificationHeaderType]: AppointmentTextEnum.appointmentSuccessPageNotificationHeaderText,
      [AppointmentTextTypeEnum.appointmentPhoneNumberFieldType]: AppointmentTextEnum.appointmentPhoneNumberFieldText,
      [AppointmentTextTypeEnum.appointmentSuccessPageExitButtonType]: AppointmentTextEnum.appointmentSuccessPageExitButtonText,
      [AppointmentTextTypeEnum.appointmentSuccessPageCancelButtonType]: AppointmentTextEnum.appointmentSuccessPageCancelButtonText,
      [AppointmentTextTypeEnum.appointmentSuccessPageModifyButtonType]: AppointmentTextEnum.appointmentSuccessPageModifyButtonText,
      [AppointmentTextTypeEnum.appointmentModifyModelHeaderType]: AppointmentTextEnum.appointmentModifyModelHeaderText,
      [AppointmentTextTypeEnum.appointmentModifyModelSendCodeTitleType]: AppointmentTextEnum.appointmentModifyModelSendCodeTitleText,
      [AppointmentTextTypeEnum.appointmentCancelButtonType]: AppointmentTextEnum.appointmentCancelButtonText,
      [AppointmentTextTypeEnum.appointmentVerifyCodeButtonType]: AppointmentTextEnum.appointmentVerifyCodeButtonText,
      [AppointmentTextTypeEnum.appointmentResendVerifyCodeType]: AppointmentTextEnum.appointmentResendVerifyCodeText,
      [AppointmentTextTypeEnum.appointmentEnterCodeFieldPlaceHolderType]: AppointmentTextEnum.appointmentEnterCodeFieldPlaceHolderText,
      [AppointmentTextTypeEnum.appointmentConfirmationHeaderType]: AppointmentTextEnum.appointmentConfirmationHeaderText,
      [AppointmentTextTypeEnum.appointmentServiceNotSelectedErrorMessageType]: AppointmentTextEnum.appointmentServiceNotSelectedErrorMessageText,
      [AppointmentTextTypeEnum.appointmentLocationNotSelectedErrorMessageType]: AppointmentTextEnum.appointmentLocationNotSelectedErrorMessageText,
      [AppointmentTextTypeEnum.appointmentSlotNotSelectedErrorMessageType]: AppointmentTextEnum.appointmentSlotNotSelectedErrorMessageText,
      [AppointmentTextTypeEnum.appointmentRequiredFieldErrorMessageType]: AppointmentTextEnum.appointmentRequiredFieldErrorMessageText,
      [AppointmentTextTypeEnum.appointmentCancelledMessageType]: AppointmentTextEnum.appointmentCancelledMessageText,
      [AppointmentTextTypeEnum.appointmentConfirmDeleteMessageType]: AppointmentTextEnum.appointmentConfirmDeleteMessageText,
      [AppointmentTextTypeEnum.appointmentHOOHeaderType]: AppointmentTextEnum.appointmentHOOHeaderText,
      [AppointmentTextTypeEnum.appointmentServiceOfferTitleType]: AppointmentTextEnum.appointmentServiceOfferTitleText,
      [AppointmentTextTypeEnum.appointmentSelectLocationButtonType]: AppointmentTextEnum.appointmentSelectLocationButtonText,
      [AppointmentTextTypeEnum.appointmentRadiusHeaderType]: AppointmentTextEnum.appointmentRadiusHeaderText,
      [AppointmentTextTypeEnum.appointmentOTPAuthenticationMessageType]: AppointmentTextEnum.appointmentOTPAuthenticationMessageText,
      [AppointmentTextTypeEnum.appointmentOTPRequiredMessageType]: AppointmentTextEnum.appointmentOTPRequiredMessageText,
      [AppointmentTextTypeEnum.appointmentInvalidOTPMessageType]: AppointmentTextEnum.appointmentInvalidOTPMessageText,
      [AppointmentTextTypeEnum.appointmentModifyMessageType]: AppointmentTextEnum.appointmentModifyMessageText,
      [AppointmentTextTypeEnum.appointmentRequiredSpecificFieldErrorMessageType]: AppointmentTextEnum.appointmentRequiredSpecificFieldErrorMessageText,
      [AppointmentTextTypeEnum.appointmentInvalidFieldMessageType]: AppointmentTextEnum.appointmentInvalidFieldMessageText,
      [AppointmentTextTypeEnum.appointmentAgreeMessageType]: AppointmentTextEnum.appointmentAgreeMessageText,
      [AppointmentTextTypeEnum.appointmentTermConditionMessageType]: AppointmentTextEnum.appointmentTermConditionMessageText,
      [AppointmentTextTypeEnum.appointmentMilesType]: AppointmentTextEnum.appointmentMilesText,
    };
  }
  //#endregion
}
