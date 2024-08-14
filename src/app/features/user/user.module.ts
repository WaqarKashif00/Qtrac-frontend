import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserRoutes } from 'src/app/routes/user.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserAdvanceSettingsComponent } from './components/advance-settings/advance-settings.component';
import { AddUserComponent } from './components/Add User/add-user.component';
import { UserComponent } from './user.component';
@NgModule({
  imports: [
    RouterModule.forChild(UserRoutes),
    SharedModule
  ],
  exports: [
    UserComponent
  ],
  declarations: [
    AddUserComponent, UserComponent, UserAdvanceSettingsComponent
  ],
  providers: []
})
export class UserModule { }
