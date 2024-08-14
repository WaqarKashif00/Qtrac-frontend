import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ShowIconInFooter } from 'src/app/models/enums/appointment-scheduler.enum';
import { IAppointmentNotificationPreferences } from '../../../models/appointment-notification-preferences.interface';
import { Announcement } from '../../../models/controls/announcement.control';
import { DesignerPanel } from '../../../models/controls/designer-panel.control';
import { FooterProperties } from '../../../models/controls/footer.control';
import { TicketProperty } from '../../../models/controls/ticket-property.control';
import { IFirstAvailable } from '../../../models/first-available.interface';
import { NearestBranchDisplayData } from '../../../models/nearest-branch-display-data.interface';
import { IQuestionItem } from '../../../models/scheduler-execution-data.interface';
import { ISchedularService } from '../../../models/sechduler-services.interface';
import { IMiles } from '../../../models/selection-item.interface';
import { IStepDetails } from '../../../models/step-details.interface';
import { LayoutContainerService } from './layout-container.service';
import { ICurrentLanguage } from '../../../models/current-language.interface';

@Component({
  selector: 'lavi-layout-container',
  templateUrl: './layout-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LayoutContainerService],
})
export class LayoutContainerComponent extends AbstractComponent {
  SelectedPage$: Observable<string>;
  DesignerPanel$: Observable<DesignerPanel>;
  TicketPropertyPanel$: Observable<TicketProperty>;
  StepDetails$: Observable<IStepDetails>;
  ShowIconInFooter = ShowIconInFooter;
  SchedulerServices$: Observable<ISchedularService[]>;
  ShowCancelButton$: Observable<boolean>;
  ShowContinueButton$: Observable<boolean>;
  AvailableTimeSlot$: Observable<IFirstAvailable[]>;
  SelectedDatesTimeSlot$: Observable<IFirstAvailable>;
  ShowSubmitButton$: Observable<boolean>;
  AppointmentNotificationPreferences$: Observable<IAppointmentNotificationPreferences>;
  NearestBranchList$: Observable<NearestBranchDisplayData[]>;
  Miles$: Observable<IMiles[]>;
  GlobalQuestions$: Observable<IQuestionItem[]>;
  Announcement$: Observable<Announcement>;
  FooterProperties$: Observable<FooterProperties>;
  SelectedLanguage$: Observable<ICurrentLanguage>;

  constructor(private service: LayoutContainerService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.SelectedPage$ = this.service.SelectedPage$;
    this.DesignerPanel$ = this.service.DesignerPanel$;
    this.TicketPropertyPanel$ = this.service.TicketPropertyPanel$;
    this.StepDetails$ = this.service.StepDetails$;
    this.SchedulerServices$ = this.service.SchedulerServices$;
    this.ShowCancelButton$ = this.service.ShowCancelButton$;
    this.ShowContinueButton$ = this.service.ShowContinueButton$;
    this.AvailableTimeSlot$ = this.service.FirstAvailableTimeSlot$;
    this.SelectedDatesTimeSlot$ = this.service.SelectedDatesTimeSlot$;
    this.ShowSubmitButton$ = this.service.ShowSubmitButton$;
    this.AppointmentNotificationPreferences$ = this.service.AppointmentNotificationPreferences$;
    this.NearestBranchList$ = this.service.NearestBranchList$;
    this.Miles$ = this.service.Miles$;
    this.GlobalQuestions$ = this.service.GlobalQuestions$;
    this.Announcement$ = this.service.Announcement$;
    this.FooterProperties$ = this.service.FooterProperties$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
  }

  ChangePage(pageName) {
    this.service.ChangePage(pageName);
  }
  Save() {
    this.service.Save();
  }
  SaveAsDraft() {
    this.service.SaveAsDraft();
  }
  Cancel() {
    this.service.routeHandlerService.RedirectToAppointmentSchedulerPageListPage();
  }
}
