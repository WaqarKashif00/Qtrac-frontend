import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment.prod';
import { AppointmentSchedulerExecutionsService } from '../scheduler-execution/scheduler-execution.service';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AppointmentFormComponent } from './layout-content/appointment-form/appointment-form.component';
import { AppointmentNotificationPreferencesComponent } from './layout-content/appointment-notification-preferences/appointment-notification-preferences.component';
import { BranchMapComponent } from './layout-content/branch-map/branch-map.component';
import { ConfirmationPageComponent } from './layout-content/confirmation-page/confirmation-page.component';
import { FindBranchComponent } from './layout-content/find-branch/find-branch.component';
import { ListItemComponent } from './layout-content/list-Item/list-item.component';
import { ReviewAppointmentInformationComponent } from './layout-content/review-appointment-information/review-appointment-information.component';
import { FirstAvailableComponent } from './layout-content/schedule-appointment/first-available/first-available.component';
import { ScheduleAppointmentComponent } from './layout-content/schedule-appointment/schedule-appointment.component';
import { SelectDifferentDateComponent } from './layout-content/schedule-appointment/select-different-date/select-different-date.component';
import { ServicesComponent } from './layout-content/services-available/services.component';
import { SuccessPageComponent } from './layout-content/success-page/success-page.component';
import { VisitedBranchesComponent } from './layout-content/visited-branches/visited-branches.component';
import { LayoutFooterComponent } from './layout-footer/layout-footer.component';
import { LayoutHeaderComponent } from './layout-header/layout-header.component';
import { PreviewInputControlsComponent } from './preview-input-controls/preview-input-controls.component';
import { SchedularButtonPanelComponent } from './schedular-button-panel/schedular-button-panel.component';
import { StepperComponent } from './stepper/stepper.component';

@NgModule({
  imports: [SharedModule, GoogleMapsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
    providers: [{
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.production ? '6LfSbCshAAAAAC_FGitXlgD6zXpDTdvdrBDNJD4N' : '6LfSbCshAAAAAC_FGitXlgD6zXpDTdvdrBDNJD4N',
      } as RecaptchaSettings,
    }],
  declarations: [
    SchedularButtonPanelComponent,
    LayoutHeaderComponent,
    LayoutFooterComponent,
    FindBranchComponent,
    VisitedBranchesComponent,
    ServicesComponent,
    ScheduleAppointmentComponent,
    FirstAvailableComponent,
    SelectDifferentDateComponent,
    AppointmentFormComponent,
    AppointmentNotificationPreferencesComponent,
    ReviewAppointmentInformationComponent,
    BranchMapComponent,
    ListItemComponent,
    StepperComponent,
    PreviewInputControlsComponent,
    ConfirmationPageComponent,
    SuccessPageComponent,
    AnnouncementComponent,
  ],
  exports: [
    LayoutHeaderComponent,
    LayoutFooterComponent,
    FindBranchComponent,
    VisitedBranchesComponent,
    ServicesComponent,
    ScheduleAppointmentComponent,
    FirstAvailableComponent,
    SelectDifferentDateComponent,
    AppointmentFormComponent,
    AppointmentNotificationPreferencesComponent,
    ReviewAppointmentInformationComponent,
    BranchMapComponent,
    SchedularButtonPanelComponent,
    StepperComponent,
    PreviewInputControlsComponent,
    ConfirmationPageComponent,
    SuccessPageComponent,
    AnnouncementComponent,
  ],
})
export class SchedularSharedModule {}
