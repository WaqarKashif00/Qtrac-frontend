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
import { IAppointmentNotificationPreferences } from 'src/app/features/appointment-scheduler/models/appointment-notification-preferences.interface';
import { AppointmentTextInterface } from 'src/app/features/appointment-scheduler/models/appointment-text.interface';
import { DesignerPanel } from 'src/app/features/appointment-scheduler/models/controls/designer-panel.control';

import { StepperPreviewDetails } from 'src/app/features/appointment-scheduler/models/controls/stepper-preview-details';
import { TicketProperty } from 'src/app/features/appointment-scheduler/models/controls/ticket-property.control';
import { IFirstAvailable } from 'src/app/features/appointment-scheduler/models/first-available.interface';
import { NearestBranchDisplayData } from 'src/app/features/appointment-scheduler/models/nearest-branch-display-data.interface';
import {
  IAppointmentDetails,
  IQuestionItem
} from 'src/app/features/appointment-scheduler/models/scheduler-execution-data.interface';
import { ISchedularService } from 'src/app/features/appointment-scheduler/models/sechduler-services.interface';
import { IMiles } from 'src/app/features/appointment-scheduler/models/selection-item.interface';
import { IStepDetails } from 'src/app/features/appointment-scheduler/models/step-details.interface';
import { AppointmentSchedulerPageName } from 'src/app/models/enums/appointment-scheduler.enum';
import { Announcement } from '../../../../models/controls/announcement.control';
import { ICurrentLanguage } from '../../../../models/current-language.interface';
import { LayoutContainerService } from '../layout-container.service'

@Component({
  selector: 'lavi-layout-content',
  templateUrl: './layout-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./layout-content.component.scss'],
})
export class LayoutContentComponent
  extends AbstractComponent
  implements OnChanges {
  PageName = AppointmentSchedulerPageName;
  CurrentStep = 0;
  AppointmentDetails: IAppointmentDetails = {
    firstAvailable: true,
    maxAppointmentBookingDate: null,
    selectDifferentDate: false,
    selectedDate: null,
  };
  StepperDescription: StepperPreviewDetails = {
    header: '',
    descriptionList: [],
    isReviewPage: false,
  };

  SelectedLanguage$: Observable<ICurrentLanguage>;
  AppointmentTexts$: Observable<AppointmentTextInterface>;

  @Input() SelectedPageName: string;
  @Input() DesignerPanel: DesignerPanel;
  @Input() TicketPropertyPanel: TicketProperty;
  @Input() StepsDetails: IStepDetails;
  @Input() SchedulerServices: ISchedularService[];
  @Input() GlobalQuestions: IQuestionItem[];
  @Input() ShowContinueButton: boolean;
  @Input() ShowSubmitButton: boolean;
  @Input() ShowCancelButton: boolean;
  @Input() FirstAvailableTimeSlots: IFirstAvailable[];
  @Input() SelectedDatesAvailableTimeSlots: IFirstAvailable;
  @Input() NearestBranchList: NearestBranchDisplayData[];
  @Input() Miles: IMiles[];
  @Input()
  AppointmentNotificationPreferences: IAppointmentNotificationPreferences;
  @Input() Announcement: Announcement;


  // @Input() FooterProperties: FooterProperties;

  @Output() OnStepChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private layoutContainerService: LayoutContainerService) {
    super();
    this.SelectedLanguage$ = this.layoutContainerService.SelectedLanguage$
    this.AppointmentTexts$ = this.layoutContainerService.AppointmentTexts$
  }

  ngOnChanges(change: SimpleChanges) {
    if (
      change.SelectedPageName != null &&
      change.SelectedPageName.currentValue !=
      change.SelectedPageName.previousValue
    ) {
      this.CurrentStep = this.StepsDetails.steps.findIndex((x) =>
        x.pageName.includes(this.SelectedPageName)
      );
      this.StepperDescription.descriptionList.length = 0;
      this.StepsDetails.steps.map((x) => {
        x.isVisited = false;
      });
      if (this.CurrentStep > 0) {
        for (let i = 0; i <= this.CurrentStep - 1; i++) {
          this.StepperDescription.descriptionList.push({
            description: this.StepsDetails.steps[i].stepDescription,
            stepId: this.StepsDetails.steps[i].id,
            label: this.StepsDetails.steps[i].label,
            isDefaultSelected: this.StepsDetails.steps[i].isDefaultSelected
          });
          this.StepsDetails.steps[i].isVisited = true;
          if (this.CurrentStep == 4) {
            this.StepperDescription.header = 'Review appointment information';
          } else {
            this.StepperDescription.header = '';
          }
        }
      }
    }
  }

  StepperStepChange(page) {
    this.OnStepChange.emit(page);
  }

  SelectService(serviceId) {
    this.SchedulerServices.map((x) => (x.isSelected = false));
    this.SchedulerServices.find((x) => x.itemId == serviceId).isSelected = true;
  }

  OnTimeSlotChange(time) {
    this.FirstAvailableTimeSlots.map((x) =>
      x.availableSpots.map((m) => (m.isSelected = false))
    );
    this.FirstAvailableTimeSlots.forEach((t) => {
      if (t.availableSpots.find((c) => c.value == time)) {
        t.availableSpots.find((c) => c.value == time).isSelected = true;
      }
    });
  }

  OnSelectedDateTimeSlotChange(time) {
    this.SelectedDatesAvailableTimeSlots.availableSpots.map(
      (c) => (c.isSelected = false)
    );
    this.SelectedDatesAvailableTimeSlots.availableSpots.map(
      (c) => (c.isSelected = false)
    );
    this.SelectedDatesAvailableTimeSlots.availableSpots.find(
      (x) => x.value == time
    ).isSelected = true;
  }

  ChangeMiles(value) {
    this.Miles.map((x) => (x.isSelected = false));
    this.Miles.find((x) => x.value == value).isSelected = true;
  }

  ChangeBranches(value) {
    this.NearestBranchList.map((x) => (x.isBranchSelected = false));
    this.NearestBranchList.find((x) => x.branchId == value).isBranchSelected =
      true;
  }

  CloseAnnouncement() {
    this.Announcement.showAnnouncement = false;
  }
}
