import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GroupResult } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { LaviListComponent } from 'src/app/base/lavi-list-component';
import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import { PageMode } from 'src/app/models/enums/page-mode.enum';
import { GetDeleteSuccessfulMessage } from '../../core/utilities/core-utilities';
import { CommonMessages } from '../../models/constants/message-constant';
import { AllUserService } from './all-user.service';
import { IAgentQueue } from './models/agent-queue.interface';
import { IAgentView } from './models/agent-view.interface';
import { IRole } from './models/role.interface';
import { IUserDropdown } from './models/user-dropdown.interface';
import { IUserInfo } from './models/user.interface';



@Component({
  selector: 'lavi-all-user',
  templateUrl: './all-user.component.html',
  styleUrls: ['./all-user.component.scss'],
  providers: [
    AllUserService,
  ]
})
export class AllUserComponent extends LaviListComponent {
  public IsDialogOpened$: Observable<boolean>;
  public UserDropdownData$: Observable<IUserDropdown>;
  public Queues$: Observable<IAgentQueue[]>;
  public BranchSearchList$: Observable<GroupResult[]>;
  public TemplateList$: Observable<IAgentView[]>;
  public Roles$: Observable<IRole[]>;
  public Mode: string;
  public TagList$: Observable<string[]>;
  public IsCustomerUserType$: Observable<boolean>;
  public HideIsOverrideCheckbox$: Observable<boolean>;
  public IsInternalAuthentication$: Observable<boolean>;
  public Users$: Observable<IUserInfo[]>;
  public PasswordNotAllow$: Observable<boolean>;

  agentDropDown$: Observable<IAgentDropdown[]>;

  get UserForm() {
    return this.service.UserForm;
  }

  constructor(private service: AllUserService) {
    super();
    this.SetObservables();
    this.service.CallMultipleApis();
  }

  Init() {
    this.Users$ = this.service.Users$;
    this.service.GetUsersAndSetUsersSubject();
  }

  public SetObservables() {
    this.UserDropdownData$ = this.service.UserDropdownData$;
    this.agentDropDown$ = this.service.agentDropDown$;
    this.Roles$ = this.service.Roles$;
    this.Queues$ = this.service.Queues$;
    this.TemplateList$ = this.service.TemplateList$;
    this.IsDialogOpened$ = this.service.OpenNewUserDialog$;
    this.BranchSearchList$ = this.service.BranchList$;
    this.TagList$ = this.service.UserTagList$;
    this.IsCustomerUserType$ = this.service.IsCustomerUserType$;
    this.HideIsOverrideCheckbox$ = this.service.HideIsOverride$;
    this.IsInternalAuthentication$ = this.service.IsInternalAuthentication$;
    this.PasswordNotAllow$ = this.service.PasswordNotAllow$;
    this.subs.sink = this.Roles$.subscribe(role => {
      const userDetail = this.service.UserDetails;
      if (userDetail){
        this.UserForm.get('role').setValue(role.find(x => x.roleId === userDetail.roleId));
      }
    });
  }


  public OpenModelInAddMode() {
    this.Mode = PageMode.add;
    this.service.OpenModel();
    this.service.SetPasswordValidator();
    this.service.RemoveUserIdAndCompanyId();
  }

  public OpenModelInEditMode(Id: string, companyId: string) {
    this.Mode = PageMode.edit;
    this.service.OpenModel();
    this.service.browserStorageService.SetAllUserId(Id);
    this.service.GetUserDetailsFromId(Id, companyId);
    this.service.ClearPasswordValidator();
  }

  public onItemMenuSelect(e: any) {
    switch (e.event.item.action) {
      case 'EDIT':
        this.OpenModelInEditMode(e.dataItem.id, e.dataItem.companyId);
        break;
      case 'DELETE':
        this.DeleteUser(e.dataItem);
        break;
    }

  }

  public showMenuItem(menuItem: any, dataItem: any) {
    let ret = false;

    switch (menuItem.action) {
      case '':
        ret = true;
        break;
      case 'EDIT':
        ret = true;
        break;
      case 'DELETE':
        ret = true;
        break;
    }

    return ret;
  }


  public CloseModal() {
    this.service.CloseModel();
  }

  public OnSave(formGroup: FormGroup) {
    this.service.SaveUser(formGroup);
  }

  public OnUpdate(formGroup: FormGroup) {
    this.service.UpdateUser(formGroup);
  }

  public OnChangeCompanyBindRoles(companyId: string) {
    this.service.GetWorkFlows(companyId, false);
    this.service.BindRolesByCompanyId(companyId);
  }

  public OnChangeUserRoleBindAgentViewTemplate(roleId: string) {
    this.service.BindAgentTemplateByRoleId(roleId);
  }

  public OnChangeAgentTemplateBindQueues(id) {
    this.service.BindQueuesByTemplateId(id);
  }

  public OnChangeType() {
    this.service.ResetControlsOnChangeType();
  }

  public DisableBranchesDropdown() {
    this.service.DisableBranches();
  }

  public OnEnterOfTag() {
    this.service.OnEnterTag();
  }

  public OnTagRemoval(event) {
    this.service.RemoveTags(event);
  }

  public OnInputEnter(tag: string) {
    this.service.OnSeparatorAddTag(tag);
  }

  public SearchBranchNamesAndTags(searchedText: string){
    this.service.FilterBranch(searchedText);
  }

  public BindAgentViewOnUnCheckIsOverride(roleId: string){
    this.service.BindAgentTemplateByRoleId(roleId);
  }

  private DeleteUser(user: IUserInfo) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.subs.sink = this.service
        .DeleteUser(user)
        .subscribe((x) => {
          this.service.AppNotificationService.Notify(GetDeleteSuccessfulMessage('User'));
          this.service.GetUsersAndSetUsersSubject();
        });
    }
  }

}
