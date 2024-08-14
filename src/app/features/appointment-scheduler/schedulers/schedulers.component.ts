import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs'; import { LaviListComponent } from 'src/app/base/lavi-list-component';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AppNotificationService } from 'src/app/core/services/notification.service';
import { IBranchDropdownDetails } from 'src/app/models/common/branch-dropdown-interface';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { IServiceDropdown } from 'src/app/models/common/service.dropdown.interface';
import { MenuOperationEnum } from 'src/app/models/enums/menu-operation.enum';
import { CommonMessages } from '../../../models/constants/message-constant';
import { ISchedulerData } from '../models/schedular-data.interface';
import { SchedulersService } from './schedulers.service';
import { Menus, ShowMenuItem } from 'src/app/shared/utility-functions/menu-utility-functions';
import { GetDeleteSuccessfulMessage } from '../../../core/utilities/core-utilities';

@Component({
  selector: 'lavi-schedulers',
  templateUrl: './schedulers.component.html',
  styleUrls: ['./schedulers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulersComponent extends LaviListComponent {
  AppointmentSchedulers$: Observable<ISchedulerData[]>;
  IsShareLinkModelOpened$: Observable<boolean>;
  BranchDropdownList$: Observable<IBranchDropdownDetails[]>;
  Services$: Observable<IServiceDropdown[]>;
  SharableLinkTypeList$: Observable<IDropdown[]>;
  AppointmentSchedulersPublished: any[] = [];

  items: any[] = Menus({hideDuplicate: true});

  SelectedSchedulerIdForShareLink: string;
  SelectedCompanyId: string;

  constructor(private schedulersService: SchedulersService,
              private authStateService: AuthStateService,
              private appNotificationService: AppNotificationService,
    ) {
    super();
  }

  Init(){
    this.schedulersService.SetObservables();
    this.schedulersService.InitializeAppointmentSchedulerList();
    this.AppointmentSchedulers$ = this.schedulersService.AppointmentSchedulers$;
    this.IsShareLinkModelOpened$ = this.schedulersService.OpenShareLinkModel$;
    this.SharableLinkTypeList$ = this.schedulersService.SharableLinkTypeList$;
    this.BranchDropdownList$ = this.schedulersService.BranchDropdownList$;
    this.Services$ = this.schedulersService.Services$;
    this.SelectedCompanyId = this.schedulersService.authService.CompanyId;
    return;
    // TODO: will need it later to hide sharable link if scheduler is not published
    this.subs.sink = this.AppointmentSchedulers$?.subscribe(x => {
      x.forEach(template => {
        this.subs.sink = this.schedulersService.ShowSharableLink(template.companyId, template.schedulerId).subscribe((x: any) => {
          if (!x?.isDeleted){
            this.AppointmentSchedulersPublished.push({ schedulerId : template.schedulerId , isPublished : (x != null || x != undefined) });
          }
        });
      });
    });
  }

  OpenShareLinkModel(workflowId: string, schedulerId: string) {
    this.SelectedSchedulerIdForShareLink = schedulerId;
    this.schedulersService.OpenShareLinkModel(workflowId);
  }

  CloseShareLinkModel() {
    this.schedulersService.CloseShareLinkModel();
  }

  ShowMessageCopied() {
    this.schedulersService.ShowMessageCopied();
  }

  SetWorkFlowServices() {
    this.schedulersService.SetWorkFlowServices();
  }

  SetBranchServices(BranchId:string) {
    this.schedulersService.SetBranchServices(BranchId);
  }
  
  RedirectToEditAppointmentScheduler(templateId: string) {
    this.schedulersService.RedirectToEditAppointmentScheduler(templateId);
  }

  RedirectToAddNewAppointmentSchedulerTemplate() {
    this.schedulersService.RedirectToAddNewAppointmentSchedulerPage();
  }

  OnSelect({ item }, dataItem: ISchedulerData) {
    if (item.text == MenuOperationEnum.Edit) {
      this.NavigateToEditPage(dataItem.schedulerId);
    }

    if (item.text == MenuOperationEnum.Delete) {
      this.DeleteSchedulerTemplate(dataItem);
    }
  }

  ShowMenuItem(item): boolean {
    return ShowMenuItem(item, this.authStateService.AuthorizationDetails, this.roleActions.SchedulerTemplates);
  }

  DeleteSchedulerTemplate(scheduler: ISchedulerData) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.subs.sink = this.schedulersService
        .DeleteSchedulerTemplate(scheduler)
        .subscribe((x) => {
          this.appNotificationService.Notify(GetDeleteSuccessfulMessage('Scheduler template'));
          this.schedulersService.InitializeAppointmentSchedulerList();
        });
    }
  }

  NavigateToEditPage(Id: string) {
    this.RedirectToEditAppointmentScheduler(Id);
  }

  ngOnChanges(data){
    this.AppointmentSchedulersPublished = [];

  }

  ShowSharableLink(SchedulerId: string){
    return true;
    // TODO: will need it later to hide sharable link if scheduler is not published
    const data = this.AppointmentSchedulersPublished?.some(x => x.isPublished && x.SchedulerId == SchedulerId);
    return data;
  }
}
