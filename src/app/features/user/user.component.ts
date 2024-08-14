import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GroupResult } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable } from 'rxjs';
import { LaviListComponent } from 'src/app/base/lavi-list-component';
import { PageMode } from 'src/app/models/enums/page-mode.enum';
import { AuthStateService } from '../../core/services/auth-state.service';
import { GetDeleteSuccessfulMessage } from '../../core/utilities/core-utilities';
import { CommonMessages } from '../../models/constants/message-constant';
import { MenuOperationEnum } from '../../models/enums/menu-operation.enum';
import {
  Menus,
  ShowMenuItem,
} from '../../shared/utility-functions/menu-utility-functions';
import { IAgentQueue } from './models/agent-queue.interface';
import { IAgentView } from './models/agent-view.interface';
import { IUserDropdown } from './models/user-dropdown.interface';
import { IUserInfo } from './models/user.interface';
import { UserService } from './user.service';

@Component({
  selector: 'lavi-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserService],
})
export class UserComponent extends LaviListComponent implements OnInit {
  public IsDialogOpened$: Observable<boolean>;
  public EmailExists$: Observable<boolean>;
  public PasswordNotAllow$: Observable<boolean>;
  public UserDropdownData$: Observable<IUserDropdown>;
  public Queues$: Observable<IAgentQueue[]>;
  public BranchSearchList$: Observable<GroupResult[]>;
  public BranchSearchListSubject: BehaviorSubject<any>;
  public TemplateList$: Observable<IAgentView[]>;
  public Mode: string;
  public TagList$: Observable<string[]>;
  public PanelExpand$: Observable<boolean>;
  public ShowOverrideCheckbox$: Observable<boolean>;
  public IsInternalAuthentication$: Observable<boolean>;
  public Users$: Observable<IUserInfo[]>;
  public UserDropdownDataSubject: BehaviorSubject<any>;
  public UsersSubject: BehaviorSubject<any>;
  items: any[] = Menus({ hideDuplicate: true });
  Roles: any;

  get UserForm() {
    return this.service.UserForm;
  }

  constructor(
    private service: UserService,
    private authStateService: AuthStateService
  ) {
    super();
    this.SetObservables();
    this.service.CallMultipleApis();
    this.UsersSubject = new BehaviorSubject<any>([]);
    this.Users$ = this.UsersSubject.asObservable();
    this.UserDropdownDataSubject = new BehaviorSubject<any>([]);
    this.UserDropdownData$ = this.UserDropdownDataSubject.asObservable();
    this.BranchSearchListSubject = new BehaviorSubject<any>([]);
    this.BranchSearchList$ = this.BranchSearchListSubject.asObservable();
    this.SetBehaviourSubject();
  }

  ngOnInit() {
    this.service.Users$.subscribe((data) => {
      this.UsersSubject.next(data);
    });
    this.service.GetRolesAndUsersAndSetRoleAndUsersSubject();
    this.service.UserDropdownData$.subscribe((data) => {
      this.UserDropdownDataSubject.next(data);
    });
    this.service.BranchList$.subscribe((data)=> {
      this.BranchSearchListSubject.next(data)      
    })
    this.setRoleNameAndBranchName();
  }

  Destroy() {
    this.service.OnDestroy();
  }
  setRoleNameAndBranchName() {
    this.Users$.subscribe((data) => {
      if (data && data.length > 0) {
        data.forEach((user) => {
          if (this.UserDropdownDataSubject.value) {
            this.UserDropdownDataSubject.value.roleList.forEach((list) => {
              if (list.roleId == user.roleId) {
                user.roleName = list.roleName;
                this.UsersSubject.next(user);
              }
              user.branchName = [];
              if((user.branches && user.branches.length > 0) || user.isAllBranches == false) {
                user.branches.forEach((branch,index)=> {
                  user.branchName[index] = branch["name"]
                  this.UsersSubject.next(user);
                })
              } 
              
              else if(user.isAllBranches == true) {
                this.BranchSearchList$.subscribe((branchData)=> {
                  if(branchData && branchData.length > 0) {
                    branchData[0]?.items?.forEach((branch,index)=> {
                      user.branchName[index] = branch["name"]
                    })
                  }
                })
                this.UsersSubject.next(user);
              }
            });
          }
        });
      }
    });
  }


  public SetObservables() {
    this.UserDropdownData$ = this.service.UserDropdownData$;
    this.Queues$ = this.service.Queues$;
    this.TemplateList$ = this.service.TemplateList$;
    this.IsDialogOpened$ = this.service.OpenNewUserDialog$;
    this.EmailExists$ = this.service.EmailExists$;
    this.PasswordNotAllow$ = this.service.PasswordNotAllow$;
    this.TagList$ = this.service.UserTagList$;
    this.PanelExpand$ = this.service.PanelExpand$;
    this.ShowOverrideCheckbox$ = this.service.ShowOverrideCheckbox$;
    this.IsInternalAuthentication$ = this.service.IsInternalAuthentication$;
  }

  public SetBehaviourSubject() {

  }

  public OpenModelInAddMode() {
    this.Mode = PageMode.add;
    this.service.OpenModel();
    this.service.RemoveUserId();
  }

  public OpenModelInEditMode(userId) {
    this.Mode = PageMode.edit;
    this.service.OpenModel();
    this.service.GetUserDetailsFromId(userId);
    this.service.ClearPasswordValidator();
  }

  OnSelect({ item }, dataItem: IUserInfo) {
    if (item.text === MenuOperationEnum.Edit) {
      this.OpenModelInEditMode(dataItem.id);
    }

    if (item.text === MenuOperationEnum.Delete) {
      this.DeleteUser(dataItem);
    }
  }

  ShowMenuItem(item): boolean {
    return ShowMenuItem(
      item,
      this.authStateService.AuthorizationDetails,
      this.roleActions.Users
    );
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

  public OnChangeUserRoleBindAgentViewTemplate(roleId: string) {
    this.service.BindAgentTemplateByRoleId(roleId);
  }

  public OnChangeAgentTemplateBindServices(id) {
    this.service.BindServicesByTemplateId(id);
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

  public FilterBranchNameOrTag(searchText: string) {
    this.service.FilterBranchNameOrTag(searchText);
  }

  public BindAgentViewOnUnCheckIsOverride(roleId: string) {
    this.service.BindAgentTemplateByRoleId(roleId);
  }

  private DeleteUser(user: IUserInfo) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.subs.sink = this.service.DeleteUser(user).subscribe((x) => {
        this.service.AppNotificationService.Notify(
          GetDeleteSuccessfulMessage('User')
        );
        this.service.GetRolesAndUsersAndSetRoleAndUsersSubject();
      });
    }
  }
}
