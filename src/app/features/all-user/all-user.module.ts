import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AllUserRoutes } from 'src/app/routes/all-user.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllUserComponent } from './all-user.component';
import { AddUserComponent } from './components/Add User/add-user.component';
import { UserAdvanceSettingsComponent } from './components/advance-settings/advance-settings.component';

@NgModule({
  declarations: [AllUserComponent,AddUserComponent,UserAdvanceSettingsComponent],
  imports: [
    RouterModule.forChild(AllUserRoutes),
    SharedModule
  ]
})
export class AllUserModule { }
