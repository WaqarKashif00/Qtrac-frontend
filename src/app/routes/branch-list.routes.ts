import { Routes } from '@angular/router';
import { BranchListComponent } from 'src/app/features/branch-list/branch-list.component';
import { AddNewBranchComponent } from '../features/branch-list/add-new-branch/add-new-branch.component';

export const BranchListRoutes: Routes = [
  {
    path: '', 
    children: [
      {
        path: '',
        component: BranchListComponent,
      },
      {
        path: 'add-new-branch', 
        component: AddNewBranchComponent,
      },
      {
        path: 'edit-branch', 
        component: AddNewBranchComponent,
      },
    ],
  },
];
