import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeInterfaceRoutes } from '../../../routes/utility-configuration.routes';
import { AddEditHomeInterfaceModule } from './add-edit-home-interface/add-edit-home-interface.module';
import { HomeInterfaceComponent } from './home-interface.component';
import { HomeInterfaceService } from './home-interface.service';

@NgModule({
  declarations: [HomeInterfaceComponent],
  imports: [
    SharedModule,
    AddEditHomeInterfaceModule,
    RouterModule.forChild(HomeInterfaceRoutes),
  ],
  providers: [HomeInterfaceService]
})
export class HomeInterfaceModule {}
