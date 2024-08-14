import { AfterViewInit, Directive, ElementRef, Injector, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { HasRoleAccessService } from './has-role-access.service';

@Directive({
  selector: '[lavi-disable-if-not-has-role-access]'
})
export class LaviDisableControlsIfNotHasRoleAccessDirective implements AfterViewInit
{

  constructor(
    private injector: Injector,
    private service: HasRoleAccessService,
    private ref: ElementRef
  ) {
  }


  @Input('lavi-disable-if-not-has-role-access') IsDisableControlsIfNotHasRoleAccess: boolean;
 @Input() ViewName: string;
 @Input() ActionName: string;

  ngAfterViewInit(): void {
    if (this.IsDisableControlsIfNotHasRoleAccess) {
  this.RemoveOrDisableControlBasedOnRoleAccess();
    }
  }

  RemoveOrDisableControlBasedOnRoleAccess() {
    if (!this.service.IsControlBasedOnRoleAccess(this.ViewName, this.ActionName)) {
        this.DisableControl();
    }
  }

  private DisableControl() {
    let ngControl: NgControl;
    try {
      ngControl = this.injector.get(NgControl);
    } catch (error) { }
    if (ngControl) {
      if (ngControl.control)
      {
        ngControl.control.disable();
      } else {
        this.ref.nativeElement.disabled = true;
       }
   }

    }

}
