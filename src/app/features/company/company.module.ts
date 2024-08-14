import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyRoutes } from 'src/app/routes/company.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyComponent } from './company.component';
import { AddOrEditCompanyComponent } from './components/add-company/add-or-edit-company.component';
import { CompanyAdvanceConfigurationComponent } from './components/add-company/components/company-advance-configuration/company-advance-configuration.component';
import { AssignSmsNumberDialogComponent } from './components/add-company/components/company-assign-sms-number-dialog/company-assign-sms-number-dialog.component';
import { AssignSmsNumberGridRowComponent } from './components/add-company/components/company-assign-sms-number-row/company-assign-sms-number-grid-row.component';
import { CompanyCommunicationConfigurationComponent } from './components/add-company/components/company-communication-configuration/company-communication-configuration.component';
import { CompanyContactPersonComponent } from './components/add-company/components/company-contact-person/company-contact-person.component';
import { CompanyGeneralConfigurationComponent } from './components/add-company/components/company-general-configuration/company-general-configuration.component';
import { CompanySmsNumberConfigurationComponent } from './components/add-company/components/company-sms-number-configuration/company-sms-number-configuration.component';
import { CompanySuperAdminConfigurationComponent } from './components/add-company/components/company-super-admin-configuration/company-super-admin-configuration.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(CompanyRoutes),
  ],
  declarations: [
    AddOrEditCompanyComponent,
    CompanyGeneralConfigurationComponent,
    CompanyCommunicationConfigurationComponent,
    CompanyAdvanceConfigurationComponent,
    CompanySuperAdminConfigurationComponent,
    CompanyContactPersonComponent,
    CompanyComponent,
    CompanySmsNumberConfigurationComponent,
    AssignSmsNumberDialogComponent,
    AssignSmsNumberGridRowComponent,

  ],
})
export class CompanyModule { }
