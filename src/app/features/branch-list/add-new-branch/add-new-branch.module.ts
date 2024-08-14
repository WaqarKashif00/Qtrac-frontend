import { NgModule } from '@angular/core';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddNewBranchComponent } from './add-new-branch.component';
import { AdditionalSettingsComponent } from './components/additional-settings/additional-settings.component';
import { AdvanceSettingsComponent } from './components/advance-settings/advance-settings.component';
import { DesksComponent } from './components/desks/desks.component';
import { GeneralConfigurationComponent } from './components/general-configuration/general-configuration.component';
import { KiosksComponent } from './components/kiosks/kiosks.component';
import { MobileInterfaceComponent } from './components/mobile-interface/mobile-interface.component';
import { MonitorsComponent } from './components/monitors/monitors.component';
import { WorkflowUsedInBranchComponent } from './components/workflow-used-in-branch/workflow-used-in-branch.component';

@NgModule({
  imports: [SharedModule,NgxQRCodeModule],
  exports: [],
  declarations: [AddNewBranchComponent, GeneralConfigurationComponent,
     WorkflowUsedInBranchComponent, AdvanceSettingsComponent,
     KiosksComponent, MonitorsComponent, DesksComponent, MobileInterfaceComponent, AdditionalSettingsComponent ],
})
export class AddEditBranchModule {}
