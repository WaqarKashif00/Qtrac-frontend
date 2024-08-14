import {
  AfterViewInit,
  Directive,
  ElementRef,
  Injector,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { IUserAction } from 'src/app/models/common/user-role/add-user-role';
import { RoleActionTypeEnum } from 'src/app/models/enums/role-actions.enum';
import { HasRoleAccessService } from './has-role-access.service';

@Directive({
  selector: '[laviHasRoleAccess]',
})
export class HasRoleDirective  implements AfterViewInit {
  isVisible = false;
  @Input()
  set laviHasRoleAccess(value: string) {
    this._role_action_view_name = value;
  }

  private _actionName: string;
  @Input()
  set laviHasRoleAccessActionName(value: string) {
    this._actionName = value;
  }

  private _disabled: string;
  @Input()
  set laviHasRoleAccessDisabled(value: string) {
    this._disabled = value;
  }

  private _role_action_view_name: string;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private hasRoleAccessService: HasRoleAccessService,
  ) {
  }

  ngAfterViewInit(): void {
      this.removeOrDisableControlBasedOnRoleAccess();
  }

  removeOrDisableControlBasedOnRoleAccess() {
    if (this.hasRoleAccessService.IsControlBasedOnRoleAccess(this._role_action_view_name, this._actionName)) {
        this.ShowControl();
    } else {
       this.HideControl();
    }
  }

  private ShowControl() {
    this.isVisible = true;
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  private HideControl() {
    this.isVisible = false;
    this.viewContainerRef.clear();
    }

}
