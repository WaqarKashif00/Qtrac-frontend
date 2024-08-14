import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { StepperPreviewDetails } from 'src/app/features/appointment-scheduler/models/controls/stepper-preview-details';
import { IStepDetails } from 'src/app/features/appointment-scheduler/models/step-details.interface';
import { ITime } from 'src/app/features/scheduler/hours-of-operations/hours-of-operation.interface';
import { AppointmentSchedulerPageName, EnableTermsConditions } from 'src/app/models/enums/appointment-scheduler.enum';
import { IAppointmentNotificationPreferences } from '../../../models/appointment-notification-preferences.interface';
import { IFirstAvailable } from '../../../models/first-available.interface';
import { NearestBranchDisplayData } from '../../../models/nearest-branch-display-data.interface';
import {
  Announcement,
  IDesignerPanel,
  ITicketProperty
} from '../../../models/schedular-data.interface';
import { ISchedulerExecutionalData } from '../../../models/scheduler-execution-data.interface';
import { ISchedularService } from '../../../models/sechduler-services.interface';
import { IMiles } from '../../../models/selection-item.interface';
import { ILocation } from '../../../models/text-search.interface';
import { IValidationMessage } from '../../../models/validation-message.interface';
import { ICurrentLanguage } from '../../../models/current-language.interface';
import { LayoutContainerExecutionService } from '../execution-layout-container.service';
import { AppointmentTextInterface } from '../../../models/appointment-text.interface';
import { TranslateService } from 'src/app/core/services/translate.service';
@Component({
  selector: 'lavi-execution-layout-template',
  templateUrl: './execution-layout-template.component.html',
  styleUrls: ['./../../scheduler-execution.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExecutionLayoutTemplateComponent
  extends AbstractComponent
  implements OnChanges {
  PageName = AppointmentSchedulerPageName;
  CurrentStep = 0;
  StepperDescription: StepperPreviewDetails = {
    header: '',
    descriptionList: [],
    isReviewPage: false,
  };
  IsServiceQuestionShow = true;
  IsGlobalQuestionShow = true;
  EnableTermsConditionsOption = EnableTermsConditions;
  DisableSubmitButton = false;

  @Input() NearestBranchList: NearestBranchDisplayData[];
  @Input() SelectedPageName: string;
  @Input() BranchName: string;
  @Input() DesignerPanel: IDesignerPanel;
  @Input() TicketPropertyPanel: ITicketProperty;
  @Input() StepsDetails: IStepDetails;
  @Input() Miles: IMiles[];
  @Input() Services: ISchedularService[];
  @Input() ShowContinueButton: boolean;
  @Input() ShowSubmitButton: boolean;
  @Input() ShowCancelButton: boolean;
  @Input() SchedulerExecutionData: ISchedulerExecutionalData;
  @Input() FirstAvailableTimeSlots: IFirstAvailable[];
  @Input() SelectedDatesAvailableTimeSlots: IFirstAvailable;
  @Input() ValidationMessage: IValidationMessage;
  @Input() AppointmentNotificationPreferences: IAppointmentNotificationPreferences;
  @Input() CurrentMapLocation: ILocation;
  @Input() Announcement: Announcement;
  @Input() IsAuthenticatedUser: boolean;
  @Input() ValidOTP: boolean;
  @Input() IsModifiedAppointmentMode: boolean;
  @Input() MinAvailableDate: Date;
  @Input() isAppointmentExists: boolean;

  @Output() OnStepChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() OnMilesChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() OnBranchSelectionsChange: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() OnServiceSelectionChange: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() OnNextClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() OnBackClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() OnSubmitClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() OnSelectingTimeSlot: EventEmitter<ITime> =
    new EventEmitter<ITime>();
  @Output() OnSelectingSelectedDateTimeSlot: EventEmitter<ITime> =
    new EventEmitter<ITime>();
  @Output() OnDifferentDateSelectionButtonClick: EventEmitter<void> =
    new EventEmitter<void>();

  @Output() SearchBranchesByAddress: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() OnSelectedAppointmentDateChange: EventEmitter<Date> =
    new EventEmitter<Date>();
  @Output() OnFirstAvailableSelectionButtonClick: EventEmitter<void> =
    new EventEmitter<void>();

  @Output() OnPhoneNumberCheckBoxChecked = new EventEmitter<void>();
  @Output() OnEmailCheckBoxChecked = new EventEmitter<void>();
  @Output() OnIAgreeTermsCheck = new EventEmitter<void>();
  @Output() OnVerifyOTPClick = new EventEmitter<string>();
  @Output() OnSendOTPClick = new EventEmitter<string>();
  @Output() OnDeleteButton = new EventEmitter<void>();
  @Output() OnConfirmationPageCloseButtonClick = new EventEmitter<void>();
  @Output() ControlDataChange: EventEmitter<string> = new EventEmitter();

  SelectedLanguage$: Observable<ICurrentLanguage>;
  AppointmentTexts$: Observable<AppointmentTextInterface>;
  isAppointmentExists$: Observable<boolean>;
  TranslatedDays$: Observable<Object>;
  customerAppointmentId: any;

  get branchCountryCode(): string {
    return this.NearestBranchList.find((branch) => branch.branchId === this.SchedulerExecutionData.branchId)?.countryCode;
  }

  constructor(private service: LayoutContainerExecutionService, private readonly translateApiService: TranslateService,) {
    super();
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.AppointmentTexts$ = this.service.AppointmentTexts$;
    this.isAppointmentExists$ = this.service.isAppointmentExists$;
    this.customerAppointmentId = this.service.customerAppointmentId;
    this.TranslatedDays$ = this.service.TranslatedDays$;
  }

  ngOnChanges(change: SimpleChanges) {


    if (
      (change.SelectedPageName != null &&
        change.SelectedPageName.currentValue !=
        change.SelectedPageName.previousValue) ||
      change.StepsDetails?.currentValue.steps.find((x) => x.isDefaultSelected || !x.isDefaultSelected)
    ) {
      this.CurrentStep = this.StepsDetails.steps.findIndex((x) =>
        x.pageName.includes(this.SelectedPageName)
      );
      this.StepperDescription.descriptionList.length = 0;
      this.StepsDetails.steps.map((x) => {
        x.isVisited = false;
      });
      let Counter = 0;
      if (this.CurrentStep == -1) {
        Counter = 4;
      } else {
        Counter = this.CurrentStep;
      }
      for (let i = 0; i <= Counter - 1; i++) {
        this.StepperDescription.descriptionList.push({
          stepId: this.StepsDetails.steps[i].id,
          description: this.StepsDetails.steps[i].stepDescription,
          label: this.StepsDetails.steps[i].label,
          isDefaultSelected: this.StepsDetails.steps[i].isDefaultSelected,
        });
        this.StepsDetails.steps[i].isVisited = true;
        this.StepperDescription.isReviewPage = false;
        if (this.CurrentStep == 4) {
          this.AppointmentTexts$.subscribe((appointmentText) => {
            this.StepperDescription.header = appointmentText.appointmentReviewPageHeader
          });
          this.StepperDescription.isReviewPage = true;
        } else if (this.CurrentStep == -1) {
          this.AppointmentTexts$.subscribe((appointmentText) => {
            this.StepperDescription.header = appointmentText.appointmentSuccessPageDetailHeader;
          });

        } else {
          this.StepperDescription.header = '';
        }
      }
    }
  }

  private GetStepperPreviewLabel(i: number): string {
    let label;
    if (this.StepsDetails.steps[i].label == 'Appointment') {
      label = 'Date / Time';
    } else if (this.StepsDetails.steps[i].label == 'Information') {
      label = 'Questionnaire';
    } else {
      label = this.StepsDetails.steps[i].label;
    }
    return label;
  }

  SelectService(serviceId) {
    this.OnServiceSelectionChange.emit(serviceId);
  }


  onDisableSubmitButton(event) {
    this.DisableSubmitButton = event
  }
  OnNextButtonClick() {
    this.OnNextClick.emit();
    this.PositionToTop();
  }
  OnBackButtonClick() {
    this.OnBackClick.emit();
    this.PositionToTop();
  }

  PositionToTop() {
    let divContent: HTMLElement = document.getElementById('divContentContainer');
    divContent.scrollTop = 0;
  }

  OnSubmitButtonClick() {
    this.OnSubmitClick.emit();
  }
  OnSearchEnter(address) {
    this.SearchBranchesByAddress.emit(address);
  }
  ChangeMiles(miles) {
    this.OnMilesChange.emit(miles);
  }
  ChangeBranches(branchId) {
    this.OnBranchSelectionsChange.emit(branchId);
  }
  StepperStepChange(page) {
    this.OnStepChange.emit(page);
  }
  OnTimeSlotChange(time) {
    this.OnSelectingTimeSlot.emit(time);
  }
  OnSelectedDateTimeSlotChange(time) {
    this.OnSelectingSelectedDateTimeSlot.emit(time);
  }
  OnSelectDifferentDateButtonClick() {
    this.OnDifferentDateSelectionButtonClick.emit();
  }
  OnFirstAvailableButtonClick() {
    this.OnFirstAvailableSelectionButtonClick.emit();
  }
  OnAppointmentDateChange(date) {
    this.OnSelectedAppointmentDateChange.emit(date);
  }
  OnClickCloseButton() {
    this.OnConfirmationPageCloseButtonClick.emit();
  }
  OnClickDeleteButton() {
    this.OnDeleteButton.emit();
  }
  OnPhoneCheckBoxChecked() {
    this.OnPhoneNumberCheckBoxChecked.emit();
  }
  OnEmailAddressCheckBoxChecked() {
    this.OnEmailCheckBoxChecked.emit();
  }
  OnIAgreeTermsChecked() {
    this.OnIAgreeTermsCheck.emit();
  }
  CloseAnnouncement() {
    this.Announcement.showAnnouncement = false;
  }
  OnClickVerifyOTPButton(otp) {
    this.OnVerifyOTPClick.emit(otp);
  }
  OnClickSendOTPButton() {
    this.OnSendOTPClick.emit();
  }

  ControlChange(id: string) {
    this.ControlDataChange.emit(id);
  }
}
