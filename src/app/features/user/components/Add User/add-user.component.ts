import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ChipRemoveEvent } from '@progress/kendo-angular-buttons';
import { GroupResult } from '@progress/kendo-data-query';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IDropdownList } from 'src/app/models/common/dropdown-list.interface';
import { DefaultUserDropdownValues } from 'src/app/models/constants/user.constant';
import { PageMode } from 'src/app/models/enums/page-mode.enum';
import { UserMessages } from 'src/app/models/validation-message/user';
import { IAgentView } from '../../models/agent-view.interface';
import { IRole } from '../../models/role.interface';
import { IUserDropdown } from '../../models/user-dropdown.interface';

@Component({
  selector: 'lavi-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['../../user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserComponent extends AbstractComponent {
  @Input() OpenDialog: boolean;
  @Input() EmailExists: boolean;
  @Input() PasswordNotAllow: boolean;
  @Input() Mode: string;
  @Input() UserDropdownData: IUserDropdown;
  @Input() Queues: IDropdownList[];
  @Input() BranchSearchList: GroupResult[];
  @Input() TemplateList: IAgentView[];
  @Input() UserForm: FormGroup;
  @Input() TagList: string[];
  @Input() PanelExpand: boolean;
  @Input() ShowOverrideCheckbox: boolean;
  @Input() IsInternalAuthentication: boolean;

  @Output() OnCloseModal: EventEmitter<void> = new EventEmitter();
  @Output() OnSaveData: EventEmitter<FormGroup> = new EventEmitter();
  @Output() OnUpdateData: EventEmitter<FormGroup> = new EventEmitter();
  @Output() OnChangeAgentTemplate: EventEmitter<string> = new EventEmitter();
  @Output() OnSearchBranchOrTags: EventEmitter<string> = new EventEmitter();
  @Output() OnChangeUserRole: EventEmitter<string> = new EventEmitter();
  @Output() isAllBranchesStatus = new EventEmitter();
  @Output() OnEnterTag = new EventEmitter();
  @Output() OnTagRemove = new EventEmitter();
  @Output() OnEnterInput = new EventEmitter();
  @Output() SearchBranchNameOrTag = new EventEmitter();
  @Output() UncheckIsOverride = new EventEmitter();

  get isAllBranchesControl() {
    return this.UserForm.get('isAllBranches');
  }

  get EmailFormControl() {
    return this.UserForm.get('email');
  }

  get AlertEmailFormControl() {
    return this.UserForm.get('alertEmail');
  }

  get AlertPhoneNumberFormControl() {
    return    this.UserForm.get('alertPhoneNumber');
  }


  UserMessages = UserMessages;
  DefaultData = DefaultUserDropdownValues;
  UserTags: string[] = [];

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  Init() {
    this.subs.sink = this.EmailFormControl.statusChanges.subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });
  }

  PhoneNumberChanged(phoneNumber: string) {
    this.AlertPhoneNumberFormControl.setValue(phoneNumber);
    this.AlertPhoneNumberFormControl.setValidators(null);
  }

  InvalidPhoneNumberChanged(phoneNumber: string) {
    this.AlertPhoneNumberFormControl.setValue(phoneNumber);
    if(phoneNumber){
      this.AlertPhoneNumberFormControl.setErrors({isInValidPhoneNumber: true});
    }
  }


  public OnCancel() {
    this.OnCloseModal.emit();
  }

  public BindQueues(id: string) {
    this.OnChangeAgentTemplate.emit(id);
  }

  public SearchBranchesOrTags(event) {
    this.OnSearchBranchOrTags.emit(event);
  }

  public BindAgentViewByRole(event: IRole) {
    this.OnChangeUserRole.emit(event.roleId);
  }

  public OnSave() {
    if (!this.EmailExists) {
      if (this.Mode === PageMode.add) {
        this.OnSaveData.emit(this.UserForm);
      } else {
        this.OnUpdateData.emit(this.UserForm);
      }
    }
  }

  public OnTagsEnterClick() {
    this.OnEnterTag.emit();
  }

  public RemoveTag(e: ChipRemoveEvent) {
    this.OnTagRemove.emit(e);
  }

  public OnSeparateTag(tag: string) {
    this.OnEnterInput.emit(tag);
  }

  public FilterBranchNameOrTag(searchedText: string) {
    this.SearchBranchNameOrTag.emit(searchedText);
  }

  public UnCheckIsOverrideBindAgentView() {
    if (this.UserForm.controls.role.value) {
      this.UncheckIsOverride.emit(this.UserForm.controls.role.value.roleId);
    }
  }
}
