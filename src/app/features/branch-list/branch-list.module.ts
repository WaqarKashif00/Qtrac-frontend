import { NgModule } from '@angular/core';
import { BranchListComponent } from './branch-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BranchListRoutes } from 'src/app/routes/branch-list.routes';
import { AddNewBranchComponent } from './add-new-branch/add-new-branch.component';
import { AddEditBranchModule } from './add-new-branch/add-new-branch.module';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(BranchListRoutes), AddEditBranchModule],
  exports: [],
  declarations: [BranchListComponent],
})
export class BranchListModule {}
