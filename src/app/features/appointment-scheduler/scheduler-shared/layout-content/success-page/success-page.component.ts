import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AbstractComponent } from 'src/app/base/abstract-component';
import {
  AllowNotifyEmail,
  AllowNotifySms
} from 'src/app/models/enums/appointment-scheduler.enum';
import { SchedulerValidationMessages } from 'src/app/models/validation-message/appointment-scheduler.messages';
import { IAppointmentNotificationPreferences } from '../../../models/appointment-notification-preferences.interface';
import { AppointmentTextInterface } from '../../../models/appointment-text.interface';
import { StepperPreviewDetails } from '../../../models/controls/stepper-preview-details';

@Component({
  selector: 'lavi-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessPageComponent extends AbstractComponent {
  @Input() StepperPreview: StepperPreviewDetails;
  @Input() BranchName: string;
  @Input() UniqueIdentifier: string;
  @Input() ShowUniqueIdentifierOnConfirmationPage: boolean;
  @Input()
  AppointmentNotificationPreferences: IAppointmentNotificationPreferences;
  @Input() ShowSMS: string;
  @Input() ShowEmail: string;
  @Input() InActiveTextColor: string;
  @Input() ActiveTextColor: string;
  @Input() ActiveBackColor: string;
  @Input() SecondaryButtonColor: string;
  @Input() SecondaryButtonBackColor: string;
  @Input() ValidOTP: boolean;
  @Input() IsModifiedAppointmentMode:boolean;
  @Input() IsDeleteAppointment:boolean;
  @Input() AppointmentTexts: AppointmentTextInterface;
  @Input() isAppointmentExists: boolean;
  @Input() appointmentStatus: string;



  @Output() OnCloseButton = new EventEmitter<void>();
  @Output() OnDeleteButton = new EventEmitter<void>();
  @Output() OnVerifyOTPClick = new EventEmitter<string>();
  @Output() OnSendOTPClick = new EventEmitter<void>();

  AllowEMail = AllowNotifyEmail;
  AllowSms = AllowNotifySms;
  IsModelOpen = false;
  SaveClick = false;
  appointmentExists = false;
  IsModifiedURL:any;
  allowModification = true;

  OTPForm: FormGroup;
  ValidationMessages = SchedulerValidationMessages;
  IfOTPSent = false;
  constructor(private builder: FormBuilder,private router: ActivatedRoute,) {
    super();
    this.OTPForm = this.builder.group({
      OTP: ['', Validators.required],
    });
    this.IsModifiedURL = this.router.snapshot.queryParams['modify'];
  }

  OnCloseButtonClick() {
    this.OnCloseButton.emit();
  }
  OnModifyButtonClick() {
    this.IsModelOpen = true;
  }

  OnDeleteButtonClick() {
    this.OnDeleteButton.emit();
  }

  ModalClose() {
    this.IfOTPSent = false;
    this.IsModelOpen = false;
    this.SaveClick = false;
  }
  SendOTP() {
    this.IfOTPSent = true;
    this.OnSendOTPClick.emit();
  }
  VerifyOTP() {
    if (this.OTPForm.valid) {
      this.OnVerifyOTPClick.emit(this.OTPForm.controls.OTP.value);
    } else {
      this.SaveClick = true;
    }
  }

  ngOnInit(): void {
    if(this.appointmentStatus == 'CHECKED_IN' || this.appointmentStatus == 'SERVED')
    {
      this.allowModification = false;
    }
    else
    {
      this.allowModification  = true;
    }
    if (this.IsModifiedURL && this.IsModifiedURL == 'true') {
      this.appointmentExists = true;
    }
  }
}
