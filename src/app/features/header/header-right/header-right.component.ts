import {
  ChangeDetectionStrategy, Component, Inject, Input, ViewChild
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ICompanyDropDown } from 'src/app/models/common/company-dropdown-interface';
import { InitialUserDetails } from 'src/app/models/common/initial-user-details.interface';
import { RoleActionsPageNameEnum } from 'src/app/models/enums/role-actions.enum';
import { TabName } from 'src/app/models/enums/tab-name.enum';
import { LOCATION } from '../../../core/tokens/location.token';
import { CommonMessages } from '../../../models/constants/message-constant';
import { HeaderService } from '../header.service';
import { ConnectionMonitoringService } from 'src/app/core/services/connection-monitoring.service';
import { AgentService } from '../../utility-configuration/agent/agent.service';
import { ClassicAgentService } from '../../utility-configuration/agent/classic-agent-template/classic-agent.service';
import { AgentStationDataService } from '../../utility-configuration/agent/utility-services/services/agent-station-data-service/agent-station-data.service';

@Component({
  selector: 'lavi-header-right',
  templateUrl: './header-right.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./../header.component.scss'],
  // providers: [AgentService],
})
export class HeaderRightComponent extends AbstractComponent {
  @Input() IsSmallQueue: boolean;
  @Input() changeLocationText: string;
  @Input() currentLanguage: string;
  @Input() profileSettingText: string;
  @Input() changePasswordText: string;
  @Input() signOutText: string;
  @Input() viewSmallQueueText: string;

  Companies$: Observable<ICompanyDropDown[]>;
  UserDetails$: Observable<InitialUserDetails>;
  IsAgentRoute$: Observable<boolean>;
  IsMenuVisible = false;
  ShowHelpBtn = true;
  history$:Observable<any>;
  hubs$:Observable<any>;
  historySubject:BehaviorSubject<any>;
  hubsSubject:BehaviorSubject<any>;
  isMonitorDiagnostics:boolean = false;
  OpenConnectionMonitorDialog= false;


  isTailoredBrandUser=false;
  @ViewChild('activeHubsModal') activeHubsModal: any;

  get CompanyDropdownFormControl() {
    return this.headerService.CompanyDropdownFormControl;
  }

  get IsLaviUser() {
    return this.headerService.IsLaviUser();
  }

  constructor(
    private headerService: HeaderService,
    private readonly authenticationService: AuthenticationService,
    private connectionMonitoringService: ConnectionMonitoringService,
    private agentService: AgentService,
    @Inject(LOCATION) private readonly location: Location) {
    super();
  }

  Init(): void {
    this.historySubject = new BehaviorSubject<any[]>([]);
    this.hubsSubject = new BehaviorSubject<any[]>([]);
    this.history$ = this.historySubject.asObservable();
    this.hubs$ = this.hubsSubject.asObservable();


    this.IsAgentRoute$ = this.headerService.SelectedTabName$.pipe(map(x => x === TabName.Queue));
    this.Companies$ = this.headerService.Companies$;
    this.UserDetails$ = this.headerService.UserDetails$;
    this.subs.sink = this.headerService.UserRoleActions$.subscribe(x => {
       const helpAction = x.roleActions.find(x => x.actionName === RoleActionsPageNameEnum.Help);
       let MonitorDignostic = x.roleActions.find(x => x.actionName === "Monitor Diagnostics");
      this.ShowHelpBtn = helpAction ? helpAction.view : true
      if(MonitorDignostic.view == true) {
        this.isMonitorDiagnostics = true;
      }
    });

    this.subs.sink = this.connectionMonitoringService.hubs$.subscribe((data)=> {      
      this.hubsSubject.next(data);
    })

    this.subs.sink = this.connectionMonitoringService.history$.subscribe((data)=> {
      this.historySubject.next(data);
    })

    if (window.location.origin == 'https://tailoredbrands.qtrac.com') {
      this.isTailoredBrandUser = true;
    }
  }

  ToggleSmallQueue() {
    this.IsMenuVisible = false;
    this.headerService.ToggleSmallQueue();
  }


  openConnectionMonitor() {
    // this.headerService.OpenConnectionMonitor(true);
    this.agentService.openConnectionMonitor()
    this.OpenConnectionMonitorDialog = true
    this.activeHubsModal = true
  }

  ChangeBranchDeskTemplate(): void {
    this.IsMenuVisible = false;
    this.headerService.ChangeBranchDeskTemplate();
  }

  OnCompanyChange(company: ICompanyDropDown) {
    this.headerService.OnCompanyChange(company.companyId);
  }

  MakeMenuVisible() {
    this.IsMenuVisible = !this.IsMenuVisible;
  }

  FeatureIsComingSoonNotification() {
    this.headerService.AppNotificationService.NotifyInfo(
      CommonMessages.FeatureComingSoonMessage
    );
  }

  Logout() {
    this.headerService.Logout();
  }

  async ChangePassword() {
    this.location.href =
      await this.authenticationService.getPasswordChangeUrl();
  }


 closeModal() {
  this.OpenConnectionMonitorDialog= false;

 }


 copyDataToClipboard(data: string, filename: string) {
  // Copy data to clipboard
  const textarea = document.createElement('textarea');
  textarea.value = data;
  textarea.style.position = 'fixed';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  // Save data to file with specified name
  const blob = new Blob([data], { type: 'text/plain' });
  const anchor = document.createElement('a');
  anchor.download = filename;
  anchor.href = window.URL.createObjectURL(blob);
  anchor.target = '_blank';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}





CopyData() {

  this.history$.subscribe((data)=> {
    const filename = 'History.txt';
    this.copyDataToClipboard(data, filename);
  })
}

}
