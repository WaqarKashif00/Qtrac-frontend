import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import {
  IAddUserRole,
  IUserRoleFormWrapper,
  IUserAction,
  IAgentQueueDropdownList,
} from '../../../models/common/user-role/add-user-role';
import { UserRoleMesseges } from 'src/app/models/validation-message/user-role.messeges';
import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import { IHomeInterfaceDropdownList } from '../../../models/common/home-interface/home-interface.interface';
import { DefaultUserRoleDropdownValues } from '../../../models/constants/user-role.constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'lavi-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddRoleComponent extends AbstractComponent {
  @Input() OpenUserRoleDialog: boolean;
  @Input() EditedTemplateId$: Observable<string>;
  @Output() Submit: EventEmitter<IUserRoleFormWrapper>;
  @Output() ClosePopup: EventEmitter<boolean>;
  @Output() OnAddAgentTemplate: EventEmitter<FormGroup>;
  @Output() OnDeleteTemplate: EventEmitter<string>;
  @Output() OnUpdateTemplate: EventEmitter<string>;
  @Input() addUserRoleForm: FormGroup;
  @Input() userRole: IAddUserRole;
  @Input() formTitle: string;
  @Input() submitButtonTitle: string;
  @Input() DetectChange: boolean;
  @Input() AgentTemplateDropdownList: Array<IAgentDropdown>;
  @Input() AgentQueueDropdownList: Array<IAgentQueueDropdownList>;
  @Input() HomeInterfaceDropdownList: Array<IHomeInterfaceDropdownList>;
  @Output() OnTemplateChange: EventEmitter<string> = new EventEmitter();

  UserRoleMessages = UserRoleMesseges;
  UserRoleDefaultValues = DefaultUserRoleDropdownValues;
  
  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    super();
    this.Submit = new EventEmitter<IUserRoleFormWrapper>();
    this.ClosePopup = new EventEmitter<boolean>();
    this.OnAddAgentTemplate = new EventEmitter<FormGroup>();
    this.OnDeleteTemplate = new EventEmitter<string>();
    this.OnUpdateTemplate = new EventEmitter<string>();
  }
  AddTemplate(template: FormGroup): void {
    this.OnAddAgentTemplate.emit(template);
  }
  ChangeTemplate(templateId: string) {
    this.OnTemplateChange.emit(templateId);
  }
  DeleteTemplate(templateCode: string): void {
    this.OnDeleteTemplate.emit(templateCode);
  }
  UpdateTemplate(templateCode: string): void {
    this.OnUpdateTemplate.emit(templateCode);
  }
  get roleNameFormControl() {
    return this.addUserRoleForm?.controls?.roleName;
  }

  AddUserRole() {
    this.Submit.emit({
      form: this.addUserRoleForm,
      userRole: this.userRole,
    });
  }
  SelectAllActions(TypeId: string) {
    this.userRole.roleAction.forEach((x) => {
      if (x.actionTypeName === TypeId) {
        x.action.forEach((y) => this.ChangeActionValue(y, true));
      }
    });
  }
  SelectNoneActions(TypeId: string) {
    this.userRole.roleAction.forEach((x) => {
      if (x.actionTypeName === TypeId) {
        x.action.forEach((y) => this.ChangeActionValue(y, false));
      }
    });
  }
  private ChangeActionValue(action: IUserAction, newValue: boolean): void {
    action.addEdit =
      action.addEdit !== null && action.addEdit !== undefined
        ? newValue
        : action.addEdit;
    action.view =
      action.view !== null && action.view !== undefined
        ? newValue
        : action.view;
    action.delete =
      action.delete !== null && action.delete !== undefined
        ? newValue
        : action.delete;
    action.run =
      action.run !== null && action.run !== undefined ? newValue : action.run;
  }
  ModalClose() {
    this.ClosePopup.emit(false);
    // this.OpenUserRoleDialog = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.DetectChange &&
      changes.DetectChange.currentValue &&
      changes.DetectChange.currentValue != 'PENDING'
    ) {
      this.changeDetectorRef.detectChanges();
    }
  }

  ViewClicked(actionTypeIndex: number, actionIndex: number) {
    const action =
      this.userRole.roleAction[actionTypeIndex].action[actionIndex];

    if (action.view) {
      if (action.addEdit === true || action.addEdit === false) {
        this.userRole.roleAction[actionTypeIndex].action[actionIndex].addEdit =
          false;
      }

      if (action.delete === true || action.delete === false) {
        this.userRole.roleAction[actionTypeIndex].action[actionIndex].delete =
          false;
      }
    }
  }

  AddEditClicked(actionTypeIndex: number, actionIndex: number) {
    const action =
      this.userRole.roleAction[actionTypeIndex].action[actionIndex];

    if (!action.addEdit) {
      this.userRole.roleAction[actionTypeIndex].action[actionIndex].view = true;
    }
  }

  DeleteClicked(actionTypeIndex: number, actionIndex: number) {
    const action =
      this.userRole.roleAction[actionTypeIndex].action[actionIndex];

    if (!action.delete) {
      this.userRole.roleAction[actionTypeIndex].action[actionIndex].view = true;
    }
  }
}
