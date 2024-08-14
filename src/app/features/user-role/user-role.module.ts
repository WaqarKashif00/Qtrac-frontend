import { NgModule } from '@angular/core';
import { UserRoleComponent } from './user-role.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { UserRoleRoutes } from 'src/app/routes/user-role.routes';
import { AddRoleComponent } from './add-role/add-role.component';
import { AgentViewComponent } from './add-role/agent-view/agent-view.component';



@NgModule({
  imports: [SharedModule, RouterModule.forChild(UserRoleRoutes)],
  declarations: [UserRoleComponent, AddRoleComponent, AgentViewComponent],
})
export class UserRoleModule { }
