import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { ITime } from 'src/app/features/scheduler/hours-of-operations/hours-of-operation.interface';
import { IAppointmentNotificationPreferences } from '../../models/appointment-notification-preferences.interface';
import { IFirstAvailable } from '../../models/first-available.interface';
import { NearestBranchDisplayData } from '../../models/nearest-branch-display-data.interface';
import {
  Announcement,
  FooterProperties,
  IDesignerPanel,
  ITicketProperty
} from '../../models/schedular-data.interface';
import { ISchedulerExecutionalData } from '../../models/scheduler-execution-data.interface';
import { ISchedularService } from '../../models/sechduler-services.interface';
import { IMiles } from '../../models/selection-item.interface';
import { IStepDetails } from '../../models/step-details.interface';
import { ILocation } from '../../models/text-search.interface';
import { IValidationMessage } from '../../models/validation-message.interface';
import { AppointmentSchedulerExecutionsService } from '../scheduler-execution.service';
import { ICurrentLanguage } from '../../models/current-language.interface';
import { AppointmentTextInterface } from '../../models/appointment-text.interface';

@Injectable()
export class LayoutContainerExecutionService extends AbstractComponentService {

  DesignerPanel$: Observable<IDesignerPanel>;
  private DesignerPanelSubject: BehaviorSubject<IDesignerPanel>;

  TicketPropertyPanel$: Observable<ITicketProperty>;
  private TicketPropertyPanelSubject: BehaviorSubject<ITicketProperty>;

  Announcement$: Observable<Announcement>;
  private AnnouncementSubject: BehaviorSubject<Announcement>;

  FooterProperties$: Observable<FooterProperties>;
  private FooterPropertiesSubject: BehaviorSubject<FooterProperties>;

  StepDetails$: Observable<IStepDetails>;
  SelectedPage$: Observable<string>;
  NearestBranchList$: Observable<NearestBranchDisplayData[]>;
  Miles$: Observable<IMiles[]>;
  SchedulerServices$: Observable<ISchedularService[]>;
  ShowCancelButton$: Observable<boolean>;
  ShowSubmitButton$: Observable<boolean>;
  ShowContinueButton$: Observable<boolean>;
  SchedulerExecutionalData$: Observable<ISchedulerExecutionalData>;
  FirstAvailableTimeSlot$: Observable<IFirstAvailable[]>;
  SelectedDatesTimeSlot$: Observable<IFirstAvailable>;
  ValidationMessage$: Observable<IValidationMessage>;
  AppointmentNotificationPreferences$: Observable<IAppointmentNotificationPreferences>;
  CurrentMapLocation$: Observable<ILocation>;
  ValidateOTP$: Observable<boolean>;
  IsModifiedAppointmentMode$: Observable<boolean>;
  MinAvailableDate$: Observable<Date>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  AppointmentTexts$: Observable<AppointmentTextInterface>;
  TranslatedDays$: Observable<Object>;
  isAppointmentExists$: Observable<boolean>;
  customerAppointmentId:any;
  companyId:string;

  constructor(private service: AppointmentSchedulerExecutionsService) {
    super();
    this.InitializeObservables();
    this.InitializeSubjects();
    this.SubscribeObservable();
  }
  private InitializeSubjects() {
    this.DesignerPanelSubject = new BehaviorSubject<IDesignerPanel>(null);
    this.DesignerPanel$ = this.DesignerPanelSubject.asObservable();
    this.TicketPropertyPanelSubject = new BehaviorSubject<ITicketProperty>(
      null
    );
    this.TicketPropertyPanel$ = this.TicketPropertyPanelSubject.asObservable();
    this.AnnouncementSubject = new BehaviorSubject<Announcement>(null);
    this.Announcement$ = this.AnnouncementSubject.asObservable();
    this.FooterPropertiesSubject = new BehaviorSubject<FooterProperties>(null)
    this.FooterProperties$ = this.FooterPropertiesSubject.asObservable();

    this.service.CallLanguageListAPI()

  }

  private InitializeObservables() {
    this.SelectedPage$ = this.service.SelectedPage$;
    this.StepDetails$ = this.service.StepDetails$;
    this.NearestBranchList$ = this.service.NearestBranchDisplayData$;
    this.IsModifiedAppointmentMode$ = this.service.IsModifiedAppointmentMode$;
    this.Miles$ = this.service.Miles$;
    this.SchedulerServices$ = this.service.SchedulerServices$;
    this.ShowCancelButton$ = this.service.ShowCancelButton$;
    this.ShowContinueButton$ = this.service.ShowContinueButton$;
    this.SchedulerExecutionalData$ = this.service.SchedulerExecutionalData$;
    this.FirstAvailableTimeSlot$ =
      this.service.SchedulerFirstAvailableTimeSlot$;
    this.SelectedDatesTimeSlot$ = this.service.SchedulerSelectedDatesTimeSlot$;
    this.ShowSubmitButton$ = this.service.ShowSubmitButton$;
    this.ValidationMessage$ = this.service.ValidationMessage$;
    this.CurrentMapLocation$ = this.service.CurrentMapLocation$;
    this.AppointmentNotificationPreferences$ =
      this.service.AppointmentNotificationPreferences$;
    this.ValidateOTP$ = this.service.ValidateOTP$;
    this.MinAvailableDate$ = this.service.MinAvailableDate$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.AppointmentTexts$ = this.service.AppointmentTexts$;
    this.isAppointmentExists$ = this.service.appointmentExists$;
    this.customerAppointmentId = this.service.CustomerAppointmentId;
    this.TranslatedDays$ = this.service.TranslatedDays$
  }

  private SubscribeObservable() {
    this.subs.sink = this.service.SchedulersData$.subscribe((data) => {
      if (data) {
        this.DesignerPanelSubject.next(data.designerPanel);
        this.TicketPropertyPanelSubject.next(data.ticketProperties);
        this.AnnouncementSubject.next(data.announcement);
        this.FooterPropertiesSubject.next(data.footerProperties);
      }
    });
  }

  ChangePage(pageName) {
    this.service.ChangePage(pageName);
  }

  ChangeMiles(miles: number) {
    this.service.ChangeMiles(miles);
  }

  ChangeService(serviceId) {
    this.service.ChangeService(serviceId);
  }
  ChangeBranchSelection(branchId: string) {
    this.service.ChangeBranchSelection(branchId);
  }
  SubmitButtonClick() {
    this.service.SubmitButtonClick();
  }
  BackButtonClick() {
    this.service.BackButtonClick();
  }
  OnClickDeleteButton() {
    this.service.Delete();
  }
  NextButtonClick() {
    this.service.NextButtonClick();
  }
  SearchBranchListByAddress(address) {
    this.service.SearchBranchList(address);
  }
  SelectAvailableSlots(time: ITime) {
    this.service.SelectAvailableSlots(time);
  }
  SelectedDatesTimeSlotChange(time: ITime) {
    this.service.SelectSelectedDatesSlots(time);
  }
  DifferentDateSelectionButtonClick() {
    this.service.DifferentDateSelectionButtonClick();
  }
  OnFirstAvailableSelectionButtonClick() {
    this.service.OnFirstAvailableSelectionButtonClick();
  }
  AppointmentDateChange(date: Date) {
    this.service.AppointmentDateSelectionChange(date);
  }
  OnEmailAddressCheckBoxChecked() {
    this.service.OnEmailAddressCheckBoxChecked();
  }
  OnPhoneCheckBoxChecked() {
    this.service.OnPhoneCheckBoxChecked();
  }
  OnIAgreeTermsCheck() {
    this.service.OnIAgreeTermsCheck();
  }
  ConfirmationPageCloseButtonClick() {
   this.service.ConfirmationPageCloseButtonClick();
  }
  IsTokenExpired() {
    return this.service.IsAuthenTicatedUser();
  }
  SendOTP() {
    this.service.SendOTP();
  }
  VerifyOTP(otp: any) {
    this.service.VerifyOTP(otp);
  }
  ControlDataChange(id: string) {
    this.service.ControlDataChange(id);
  }
}
