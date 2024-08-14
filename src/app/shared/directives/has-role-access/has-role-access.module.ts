import { NgModule } from '@angular/core';
import { LaviDisableControlsIfNotHasRoleAccessDirective } from './disabled-if not-has-role-access.directive';
import { HasRoleDirective } from './has-role-access.directive';
import { HasRoleAccessService } from './has-role-access.service';

@NgModule({
  exports: [
    HasRoleDirective, LaviDisableControlsIfNotHasRoleAccessDirective
  ],
  declarations: [HasRoleDirective, LaviDisableControlsIfNotHasRoleAccessDirective],
  providers: [HasRoleAccessService]
})
export class LaviHasRoleAccessModule {

}
