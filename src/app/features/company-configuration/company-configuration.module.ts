import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyGeneralConfigurationComponent } from './components/company-general-configuration/company-general-configuration.component';
import { CompanyCommunicationConfigurationComponent } from './components/company-communication-configuration/company-communication-configuration.component';
import { CompanyAdvanceConfigurationComponent } from './components/company-advance-configuration/company-advance-configuration.component';
import { CompanySuperAdminConfigurationComponent } from './components/company-super-admin-configuration/company-super-admin-configuration.component';
import { CompanyContactPersonComponent } from './components/company-contact-person/company-contact-person.component';
import { CompanyConfigurationComponent } from './company-configuration.component';
import { CompanyConfigurationRoutes } from 'src/app/routes/company-configuration.routes';
import { CompanySmsNumberConfigurationComponent } from './components/company-sms-number-configuration/company-sms-number-configuration.component';
import { AssignSmsNumberDialogComponent } from './components/company-assign-sms-number-dialog/company-assign-sms-number-dialog.component';
import { AssignSmsNumberGridRowComponent } from './components/company-assign-sms-number-row/company-assign-sms-number-grid-row.component';
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(CompanyConfigurationRoutes),
  ],
  declarations: [
    CompanyConfigurationComponent,
    CompanyGeneralConfigurationComponent,
    CompanyCommunicationConfigurationComponent,
    CompanyAdvanceConfigurationComponent,
    CompanySuperAdminConfigurationComponent,
    CompanyContactPersonComponent,
    CompanySmsNumberConfigurationComponent,
    AssignSmsNumberDialogComponent,
    AssignSmsNumberGridRowComponent
  ],
})
export class CompanyConfigurationModule { }
