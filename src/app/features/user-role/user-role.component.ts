import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import { UserRoleService } from 'src/app/features/user-role/user-role.service';
import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import { LaviListComponent } from '../../base/lavi-list-component';
import { AuthStateService } from '../../core/services/auth-state.service';
import { GetDeleteSuccessfulMessage } from '../../core/utilities/core-utilities';
import { IHomeInterfaceDropdownList } from '../../models/common/home-interface/home-interface.interface';
import {
  IAddUserRole,
  IAgentQueueDropdownList,
  IUserRoleFormWrapper
} from '../../models/common/user-role/add-user-role';
import { CommonMessages } from '../../models/constants/message-constant';
import { MenuOperationEnum } from '../../models/enums/menu-operation.enum';
import { Menus, ShowMenuItem } from '../../shared/utility-functions/menu-utility-functions';
import { UserRoleValidator } from './user-role-validator';

@Component({
  selector: 'lavi-user-role',
  templateUrl: './user-role.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    UserRoleService,
  ],
})
export class UserRoleComponent extends LaviListComponent {
  AddUserRoleForm: FormGroup;
  UserRole: IAddUserRole;
  AgentTemplateDropdownList$: Observable<Array<IAgentDropdown>>;
  AgentQueueDropdownList$: Observable<Array<IAgentQueueDropdownList>>;
  AddRoleId: string = null;
  OpenUserRoleDialog$: Observable<boolean>;
  UserRole$: Observable<IAddUserRole>;
  SubmitButtonTitle: string;
  FormTitle: string;
  AllRolesList$: Observable<IAddUserRole[]>;
  HomeInterfaceDropdownList$: Observable<IHomeInterfaceDropdownList[]>;
  EditedTemplateId$: Observable<string>;
  IsRoleNameChangeDetected = '';
  items: any[] = Menus({hideDuplicate: true});

  get RoleNameControl() {
    return this.AddUserRoleForm.get('roleName');
  }

  constructor(
    private userRoleService: UserRoleService,
    private formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private authStateService: AuthStateService
  ) {
    super();
    this.InitializeObservablesAndDefaultValues();
  }

  private InitializeObservablesAndDefaultValues() {
    this.OpenUserRoleDialog$ = this.userRoleService.OpenUserRoleDialog$;
    this.UserRole$ = this.userRoleService.UserRole$;
    this.AgentQueueDropdownList$ = this.userRoleService.AgentQueueDropdownList$;
    this.AgentTemplateDropdownList$ = this.userRoleService.AgentTemplateDropdownList$;
    this.AllRolesList$ = this.userRoleService.AllRolesList$;
    this.HomeInterfaceDropdownList$ = this.userRoleService.HomeInterfaceDropdownList$;
    this.EditedTemplateId$ = this.userRoleService.EditedTemplateId$;
    this.userRoleService.SetAgentTemplateList();
    this.userRoleService.GetHomeInterfaceList();
    this.InitializeFormGroup();
    this.userRoleService.GetRolesList();
  }

  Init() {
    // Inherited from AbstractComponent to initialize component life cycle
    this.subs.sink = this.UserRole$.subscribe((x) => {
      this.UserRole = x;
      this.SetFormGroup(this.UserRole);
    });
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }

  InitializeFormGroup(): void {
    this.AddUserRoleForm = this.formBuilder.group({
      roleName: [
        '',
        [Validators.required], UserRoleValidator.RoleExistsValidator(this.userRoleService)
      ],
      homeInterfaces: [null]
    });

    this.subs.sink = this.AddUserRoleForm.controls.roleName.statusChanges.subscribe(role => {
      this.IsRoleNameChangeDetected = role;
      this.changeDetectorRef.detectChanges();
    });
  }

  OnSelect({ item }, dataItem: IAddUserRole) {
    if (item.text === MenuOperationEnum.Edit) {
      this.OpenUpdateUserDialog(dataItem.roleId, false);
    }

    if (item.text === MenuOperationEnum.Delete) {
      this.DeleteUserRole(dataItem);
    }
  }

  ShowMenuItem(item): boolean {
    return ShowMenuItem(item, this.authStateService.AuthorizationDetails, this.roleActions.UserRoles);
  }

  ChangeTemplate(templateId: string) {
    this.userRoleService.SetAgentServiceList(templateId);
  }

  AddAgentTemplate(agentTemplate: FormGroup): void {
    this.userRoleService.AddAgentTemplate(agentTemplate);
  }

  DeleteTemplate(agentTemplateCode: string): void {
    this.userRoleService.DeleteTemplate(agentTemplateCode);
  }

  UpdateTemplate(agentTemplateCode: string): void {
    this.userRoleService.UpdateTemplate(agentTemplateCode);
  }

  SetFormGroup(userRole: IAddUserRole) {
    if (!this.AddUserRoleForm.get('roleName').value) {
      this.AddUserRoleForm.patchValue({
        roleName: userRole.roleName,
        homeInterfaces: this.userRoleService.GetHomeInterfaceById(userRole.homeInterfaceId)
      });
    }
  }

  public OpenAddUserDialog() {
    this.userRoleService.InitializeDefaultValues();
    this.userRoleService.browserStorageService.RemoveUserRoleId();
    this.FormTitle = 'Add Role';
    this.SubmitButtonTitle = 'Save';
    this.userRoleService.OpenUserRoleDialog();
    this.userRoleService.browserStorageService.RemoveUserRoleId();
  }

  public OpenUpdateUserDialog(roleId, isAddMode: boolean) {
    this.FormTitle = isAddMode ? 'Add Role' : 'Update Role';
    this.SubmitButtonTitle = isAddMode ? 'Save' : 'Update';
    if (!isAddMode) {
      this.userRoleService.browserStorageService.SetUserRoleId(roleId);
    }
    this.userRoleService.GetUserRolesDetails(roleId);
    this.userRoleService.OpenUserRoleDialog();
  }

  public OnSave(req: IUserRoleFormWrapper): void {
    this.userRoleService.AddUserRole(req);
  }

  public ClosePopup(status: boolean) {
    this.AddUserRoleForm.reset();
    this.userRoleService.CloseUserRoleDialog();
  }

  DeleteUserRole(role: IAddUserRole) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.subs.sink = this.userRoleService
        .DeleteUserRole(role)
        .subscribe((x) => {
          this.userRoleService.AppNotificationService.Notify(GetDeleteSuccessfulMessage('User Role'));
          this.userRoleService.GetRolesList();
        });
    }
  }


}
