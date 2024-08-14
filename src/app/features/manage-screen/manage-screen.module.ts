import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManageRoutes } from 'src/app/routes/manage.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { LeftNavComponent } from './left-nav/left-nav.component';
import { ManageScreenComponent } from './manage-screen.component';
import { RightContentComponent } from './right-content/right-content.component';

@NgModule({
  declarations: [
    ManageScreenComponent,
    LeftNavComponent,
    RightContentComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(ManageRoutes)],
  exports: [ManageScreenComponent, LeftNavComponent],
})
export class ManageScreenModule {}
