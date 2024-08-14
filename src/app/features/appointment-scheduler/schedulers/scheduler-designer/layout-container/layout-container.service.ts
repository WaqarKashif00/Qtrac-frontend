import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IAppointmentNotificationPreferences } from '../../../models/appointment-notification-preferences.interface';
import { Announcement } from '../../../models/controls/announcement.control';
import { DesignerPanel } from '../../../models/controls/designer-panel.control';
import { TicketProperty } from '../../../models/controls/ticket-property.control';
import { IFirstAvailable } from '../../../models/first-available.interface';
import { NearestBranchDisplayData } from '../../../models/nearest-branch-display-data.interface';
import { IQuestionItem } from '../../../models/scheduler-execution-data.interface';
import { ISchedularService } from '../../../models/sechduler-services.interface';
import { IMiles } from '../../../models/selection-item.interface';
import { IStepDetails } from '../../../models/step-details.interface';
import { AppointmentSchedulerService } from '../scheduler-designer.service';
import { ICurrentLanguage } from '../../../models/current-language.interface';
import { FooterProperties } from '../../../models/controls/footer.control';
import { AppointmentTextInterface } from '../../../models/appointment-text.interface';

@Injectable()
export class LayoutContainerService extends AbstractComponentService {
  DesignerPanel$: Observable<DesignerPanel>;
  private DesignerPanelSubject: BehaviorSubject<DesignerPanel>;

  TicketPropertyPanel$: Observable<TicketProperty>;
  private TicketPropertyPanelSubject: BehaviorSubject<TicketProperty>;

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
  ShowContinueButton$: Observable<boolean>;
  FirstAvailableTimeSlot$: Observable<IFirstAvailable[]>;
  SelectedDatesTimeSlot$: Observable<IFirstAvailable>;
  ShowSubmitButton$: Observable<boolean>;
  AppointmentNotificationPreferences$: Observable<IAppointmentNotificationPreferences>;
  GlobalQuestions$: Observable<IQuestionItem[]>;

  SelectedLanguage$: Observable<ICurrentLanguage>;
  AppointmentTexts$: Observable<AppointmentTextInterface>
  constructor(private service: AppointmentSchedulerService) {
    super();
    this.InitializeObservables();
    this.InitializeSubjects();
    this.SubscribeObservable();
  }
  private InitializeSubjects() {
    this.DesignerPanelSubject = new BehaviorSubject<DesignerPanel>(null);
    this.DesignerPanel$ = this.DesignerPanelSubject.asObservable();
    this.TicketPropertyPanelSubject = new BehaviorSubject<TicketProperty>(null);
    this.TicketPropertyPanel$ = this.TicketPropertyPanelSubject.asObservable();
    this.AnnouncementSubject = new BehaviorSubject<Announcement>(null);
    this.Announcement$ = this.AnnouncementSubject.asObservable();
    this.FooterPropertiesSubject = new BehaviorSubject<FooterProperties>(null);
    this.FooterProperties$ = this.FooterPropertiesSubject.asObservable()
  }

  private InitializeObservables() {
    this.SelectedPage$ = this.service.SelectedPage$;
    this.StepDetails$ = this.service.StepDetails$;
    this.SchedulerServices$ = this.service.SchedulerServices$;
    this.ShowCancelButton$ = this.service.ShowCancelButton$;
    this.ShowContinueButton$ = this.service.ShowContinueButton$;
    this.FirstAvailableTimeSlot$ =
      this.service.SchedulerFirstAvailableTimeSlot$;
    this.SelectedDatesTimeSlot$ = this.service.SchedulerSelectedDatesTimeSlot$;
    this.ShowSubmitButton$ = this.service.ShowSubmitButton$;
    this.AppointmentNotificationPreferences$ =
      this.service.AppointmentNotificationPreferences$;
    this.NearestBranchList$ = this.service.NearestBranchDisplayData$;
    this.Miles$ = this.service.Miles$;
    this.GlobalQuestions$ = this.service.GlobalQuestions$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.AppointmentTexts$ = this.service.AppointmentTexts$
  }

  private SubscribeObservable() {
    this.subs.sink = this.service.SchedulerControlsData$.subscribe((data) => {
      this.DesignerPanelSubject.next(data.designerPanel);
      this.TicketPropertyPanelSubject.next(data.ticketProperties);
      this.AnnouncementSubject.next(data.announcement);
      this.FooterPropertiesSubject.next(data.footerProperties)
    });
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
}
