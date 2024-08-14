import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FormService } from 'src/app/core/services/form.service';

export type LavilDelegate<T> = (...args: any[]) => T;

@Component({
  selector: 'lavi-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListMenuComponent extends AbstractComponent {
  @Input() menuItems;
  @Input() menuItemValidator: LavilDelegate<any> = null;
  @Input() dataItem = null;
  @Input() roleActionView: string;

  @Output() showMenuItem: EventEmitter<any> = new EventEmitter<any>();

  constructor(private authStateService: AuthStateService) {
    super();
  }

  onItemMenuSelect(e, dataItem) {
    this.showMenuItem.next({ event: e, dataItem });
  }

  onShownMenuItem(dataItem, menuItem): boolean {
    let ret = true;
    if (this.menuItemValidator !== null) {
      ret = this.menuItemValidator(menuItem, dataItem);
    }

    return ret && this.hasMenuAccess(menuItem);
  }

  // For roles access
  hasMenuAccess(menuItem: any): boolean {
    let ret = true;
    const roleAccessView =
      this.authStateService.AuthorizationDetails.roleActions.find(x => x.viewName ==
        this.roleActionView
      );
    if (!this.authStateService.AuthorizationDetails.isAllSystemAccessible && roleAccessView) {
      switch (menuItem.action) {
        case '':
          ret = this.showMenuItemIcon(roleAccessView.addEdit, roleAccessView.delete);
          break;
        case 'EDIT':
          ret = this.returnFalseIfNull(roleAccessView.addEdit);
          break;
        case 'DELETE':
          ret = this.returnFalseIfNull(roleAccessView.delete);
          break;
      }
    }
    return ret;
  }

  showMenuItemIcon(isAddEdit: boolean, isDelete: boolean): boolean {
     if (!isAddEdit){  // Need to add delete and other features later && !isDelete)
       return false;
     }
     return true;
  }

  returnFalseIfNull(value: boolean): boolean {
    return value == null ? false : value;
  }
}
