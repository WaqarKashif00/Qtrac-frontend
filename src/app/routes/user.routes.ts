import { Routes } from '@angular/router';
import { UserComponent } from 'src/app/features/user/user.component';
import { UserRoleComponent } from '../features/user-role/user-role.component';

export const UserRoutes: Routes = [
  { path: '',  component: UserComponent },
  { path: 'user-role', component: UserRoleComponent}
];
