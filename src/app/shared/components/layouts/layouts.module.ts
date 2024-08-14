import { NgModule } from '@angular/core';
import { FormPanelComponent } from './form-panel/form-panel.component';
import { FormInnerPanelComponent } from './form-content-panel/form-content-panel.component';
import { AuthContainerComponent } from './auth-container/auth-container.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TransparentFooterComponent } from './transparent-footer/transparent-footer.component';
import { ListScreenHeaderComponent } from './list-screen-header/list-screen-header.component';
import { RouterModule } from '@angular/router';
import { LaviHasRoleAccessModule } from '../../directives/has-role-access/has-role-access.module';

@NgModule({
  imports: [LayoutModule,RouterModule,
    LaviHasRoleAccessModule
  ],
  exports: [
    AuthContainerComponent,
    FormPanelComponent,
    FormInnerPanelComponent,
    TransparentFooterComponent,
    ListScreenHeaderComponent,
    LayoutModule
  ],
  declarations: [
    AuthContainerComponent,
    FormPanelComponent,
    FormInnerPanelComponent,
    TransparentFooterComponent,
    ListScreenHeaderComponent
  ],
})
export class CustomLayoutsModule {}
