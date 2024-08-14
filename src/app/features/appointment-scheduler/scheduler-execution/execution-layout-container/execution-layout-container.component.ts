import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ShowIconInFooter } from 'src/app/models/enums/appointment-scheduler.enum';
import { IAppointmentNotificationPreferences } from '../../models/appointment-notification-preferences.interface';
import { IFirstAvailable } from '../../models/first-available.interface';
import { NearestBranchDisplayData } from '../../models/nearest-branch-display-data.interface';
import {
  Announcement,
  IDesignerPanel,
  ITicketProperty,
  FooterProperties
} from '../../models/schedular-data.interface';
import { ISchedulerExecutionalData } from '../../models/scheduler-execution-data.interface';
import { ISchedularService } from '../../models/sechduler-services.interface';
import { IMiles } from '../../models/selection-item.interface';
import { IStepDetails } from '../../models/step-details.interface';
import { ILocation } from '../../models/text-search.interface';
import { IValidationMessage } from '../../models/validation-message.interface';
import { LayoutContainerExecutionService } from './execution-layout-container.service';
import { ICurrentLanguage } from '../../models/current-language.interface';
import { AppointmentTextInterface } from '../../models/appointment-text.interface';

@Component({
  selector: 'lavi-execution-layout-container',
  templateUrl: './execution-layout-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./../scheduler-execution.component.scss'],
  providers: [LayoutContainerExecutionService],
})
export class ExecutionLayoutContainerComponent extends AbstractComponent {
  SelectedPage$: Observable<string>;
  DesignerPanel$: Observable<IDesignerPanel>;
  TicketPropertyPanel$: Observable<ITicketProperty>;
  StepDetails$: Observable<IStepDetails>;
  NearestBranchList$: Observable<NearestBranchDisplayData[]>;
  Miles$: Observable<IMiles[]>;
  SchedulerServices$: Observable<ISchedularService[]>;
  ShowCancelButton$: Observable<boolean>;
  ShowContinueButton$: Observable<boolean>;
  ShowSubmitButton$: Observable<boolean>;
  ShowIconInFooter = ShowIconInFooter;
  SchedulerExecutionsData$: Observable<ISchedulerExecutionalData>;
  AvailableTimeSlot$: Observable<IFirstAvailable[]>;
  SelectedDatesTimeSlot$: Observable<IFirstAvailable>;
  ValidationMessage$: Observable<IValidationMessage>;
  AppointmentNotificationPreferences$: Observable<IAppointmentNotificationPreferences>;
  CurrentMapLocation$: Observable<ILocation>;
  Announcement$: Observable<Announcement>;
  ValidateOTP$: Observable<boolean>;
  IsModifiedAppointmentMode$: Observable<boolean>;
  MinAvailableDate$: Observable<Date>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  FooterProperties$: Observable<FooterProperties>;
  AppointmentTexts$: Observable<AppointmentTextInterface>;
  isAppointmentExists$: Observable<any>;

  get IsAuthenticatedUser() {
    return this.service.IsTokenExpired();
  }
  constructor(private service: LayoutContainerExecutionService) {
    super();
    this.SelectedPage$ = this.service.SelectedPage$;
    this.DesignerPanel$ = this.service.DesignerPanel$;
    this.TicketPropertyPanel$ = this.service.TicketPropertyPanel$;
    this.StepDetails$ = this.service.StepDetails$;
    this.NearestBranchList$ = this.service.NearestBranchList$;
    this.Miles$ = this.service.Miles$;
    this.SchedulerServices$ = this.service.SchedulerServices$;
    this.ShowCancelButton$ = this.service.ShowCancelButton$;
    this.ShowContinueButton$ = this.service.ShowContinueButton$;
    this.SchedulerExecutionsData$ = this.service.SchedulerExecutionalData$;
    this.AvailableTimeSlot$ = this.service.FirstAvailableTimeSlot$;
    this.SelectedDatesTimeSlot$ = this.service.SelectedDatesTimeSlot$;
    this.ShowSubmitButton$ = this.service.ShowSubmitButton$;
    this.ValidationMessage$ = this.service.ValidationMessage$;
    this.AppointmentNotificationPreferences$ = this.service.AppointmentNotificationPreferences$;
    this.CurrentMapLocation$ = this.service.CurrentMapLocation$;
    this.Announcement$ = this.service.Announcement$;
    this.ValidateOTP$ = this.service.ValidateOTP$;
    this.IsModifiedAppointmentMode$ = this.service.IsModifiedAppointmentMode$;
    this.MinAvailableDate$ = this.service.MinAvailableDate$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.FooterProperties$ = this.service.FooterProperties$;
    this.AppointmentTexts$ = this.service.AppointmentTexts$;
    this.isAppointmentExists$ = this.service.isAppointmentExists$;

  }

  ChangePage(pageName) {
    this.service.ChangePage(pageName);
  }
  ChangeMiles(miles) {
    this.service.ChangeMiles(miles);
  }
  ChangeService(serviceId) {
    this.service.ChangeService(serviceId);
  }
  ChangeBranchSelection(branchId: string) {
    this.service.ChangeBranchSelection(branchId);
  }
  OnNextButtonClick() {
    this.service.NextButtonClick();
  }
  OnSubmitButtonClick() {
    this.service.SubmitButtonClick();
  }
  OnBackButtonClick() {
    this.service.BackButtonClick();
  }
  OnClickDeleteButton() {
    this.service.OnClickDeleteButton();
  }

  OnSearchEnter(address) {
    this.service.SearchBranchListByAddress(address);
  }

  OnSelectingAvailableSlots(time) {
    this.service.SelectAvailableSlots(time);
  }
  OnSelectedDatesTimeSlotChange(time) {
    this.service.SelectedDatesTimeSlotChange(time);
  }
  OnDifferentDateSelectionButtonClick() {
    this.service.DifferentDateSelectionButtonClick();
  }
  OnFirstAvailableSelectionButtonClick() {
    this.service.OnFirstAvailableSelectionButtonClick();
  }
  OnAppointmentDateChange(date) {
    this.service.AppointmentDateChange(date);
  }
  OnPhoneCheckBoxChecked() {
    this.service.OnPhoneCheckBoxChecked();
  }
  OnEmailAddressCheckBoxChecked() {
    this.service.OnEmailAddressCheckBoxChecked();
  }
  OnIAgreeTermsCheck() {
    this.service.OnIAgreeTermsCheck();
  }
  OnVerifyOTPClick(otp) {
    this.service.VerifyOTP(otp);
  }
  OnSendOTPClick() {
    this.service.SendOTP();
  }
  OnConfirmationPageCloseButtonClick() {
    this.service.ConfirmationPageCloseButtonClick();
  }
  OnControlChange(id: string) {
    this.service.ControlDataChange(id);
  }
}
