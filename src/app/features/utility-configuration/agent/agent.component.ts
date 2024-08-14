import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { AgentCalendarService } from './agent-calendar/agent-calendar.service';
import { AgentService } from './agent.service';
import { IBranchDropdown, ICustomerURL, IGroupDetails, IQueueDetails, IStationDetails } from './models/agent-models';
import { ITab } from './models/utilities-models/agent-tab.model';
import { IAgentConfiguration } from './utility-services/models/agent-configurations-models.ts/agent-configurations.interface';

@Component({
  selector: 'lavi-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AgentService],
})
export class AgentComponent extends AbstractComponent {

  OpenSelectStationDataDialog$: Observable<boolean>;
  OpenAddVisitorDialog$: Observable<boolean>;
  OpenClassicView$: Observable<boolean>;
  IsAgentAvailable$: Observable<boolean>;
  IsFiltersShow: boolean;
  IsGroupsSidebarShow: boolean;

  Branches$: Observable<IBranchDropdown[]>;
  Templates$: Observable<IAgentDropdown[]>;
  Desks$: Observable<IDropdown[]>;
  Tags$: Observable<string[]>;

  CustomerURL$: Observable<ICustomerURL>;

  public queues$: Observable<IQueueDetails[]>;
  public groups$: Observable<IGroupDetails[]>;

  AgentConfigurations$: Observable<IAgentConfiguration>;
  AllowEditingCustomerInformation$: Observable<boolean>;
  changeFrom$: Observable<boolean>;
  IsAllowGrouping$: Observable<boolean>;
  IsAllowCreateGroup$: Observable<boolean>;
  IsAllowTicketFiltering$: Observable<boolean>;
  CanAddVisitor$: Observable<boolean>;
  ActiveTab$: Observable<ITab>;
  AgentAllHeaderTabs$: Observable<ITab[]>;
  IsSmallQueue$: Observable<boolean>;
  OpenQueueInNewTab$: Observable<boolean>;
  EnableEndOfDayButton$: Observable<boolean>;
  OpenConnectionMonitorDialog$:Observable<boolean>;
  currentLanguage$: Observable<string>;
  homeText$: Observable<string>;
  queueText$: Observable<string>;
  visitorTagText$: Observable<string>;
  viewText$: Observable<string>;
  teamNotesText$: Observable<string>;
  awayText$: Observable<string>;
  messageText$: Observable<string>;
  noShowText$: Observable<string>;
  clearText$: Observable<string>;
  callingText$: Observable<string>;
  searchByTagText$: Observable<string>;
  searchLocationText$: Observable<string>;
  searchTemplateText$: Observable<string>;
  deskText$: Observable<string>;
  selectDeskText$: Observable<string>;
  submitText$: Observable<string>;
  servingText$: Observable<string>;
  byQueueText$: Observable<string>;
  byVisitorTagText$: Observable<string>;
  removeVisitorTagText$: Observable<string>;
  createVisitorTagText$: Observable<string>;
  visitorTagNameText$: Observable<string>;
  selectVisitorTagColorText$: Observable<string>;
  visitorTagColorText$: Observable<string>;
  addVisitorTagText$: Observable<string>;

  constructor(
    private agentService: AgentService,
    private calendarService: AgentCalendarService
  ) {
    super();
    this.agentService.CheckUpdateStaticDetails();
    this.IsFiltersShow = false;
    this.IsSmallQueue$ = this.agentService.IsSmallQueue$;
    this.AllowEditingCustomerInformation$ = agentService.AllowEditingCustomerInformation$
    this.OpenSelectStationDataDialog$ = agentService.OpenSelectStationDataDialog$;
    this.OpenAddVisitorDialog$ = agentService.OpenAddVisitorDialog$;
    this.Branches$ = this.agentService.Branches$;
    this.Templates$ = this.agentService.Templates$;
    this.Desks$ = this.agentService.Desks$;
    this.queues$ = this.agentService.queues$;
    this.groups$ = this.agentService.groups$;
    this.ActiveTab$ = this.agentService.ActiveTab$;
    this.Tags$ = this.agentService.Tags$;
    this.AgentAllHeaderTabs$ = this.agentService.AgentAllHeaderTabs$;
    this.changeFrom$ = this.agentService.changeFrom$
    this.IsAgentAvailable$ = this.agentService.IsAgentAvailable$;
    this.OpenQueueInNewTab$ = this.agentService.OpenQueueInNewTab$;
    this.OpenConnectionMonitorDialog$ = this.agentService.OpenConnectionMonitorDialog

    this.AgentConfigurations$ = this.agentService.AgentConfigurations$;
    this.OpenClassicView$ = this.agentService.AgentConfigurations$
      .pipe(map(x => {
        const viewType = x?.viewTypeId;
        return viewType === 'CLASSIC';
      }));

    this.IsAllowGrouping$ = this.agentService.AgentConfigurations$
      .pipe(map(x => {
        const IsAllowGrouping: boolean = (x?.grouping?.allow === true) ? true : false;
        return IsAllowGrouping;
      }));

    this.IsAllowCreateGroup$ = this.agentService.AgentConfigurations$
      .pipe(map(x => {
        const IsAllowCreateGroup: boolean = (x?.grouping?.allowToCreateGroup === true) ? true : false;
        return IsAllowCreateGroup;
      }));

    this.EnableEndOfDayButton$ = this.agentService.AgentConfigurations$
      .pipe(map(x => {
        const EnableEndOfDayButton: boolean = (x?.enableEndOfDayButtonInQueue === true) ? true : false;
        return EnableEndOfDayButton;
      }));

    this.IsAllowTicketFiltering$ = this.agentService.AgentConfigurations$
      .pipe(map(x => {
        const allowTicketFiltering: boolean = (x?.allowTicketFiltering == true || x?.allowTicketFiltering == undefined) ? true : false;
        if (!x?.allowTicketFiltering) {
          this.agentService.ResetSelectedQueue();
        }
        return allowTicketFiltering;

      }));

    this.CanAddVisitor$ = this.agentService.AgentConfigurations$
      .pipe(map(x => {
        const CanAddVisitor: boolean = x?.displayKiosk;
        return CanAddVisitor;
      }));

    this.CustomerURL$ = this.agentService.AgentConfigurations$
      .pipe(map(x => {
        const url: ICustomerURL = {
          tabName: x?.tabName,
          url: x?.url
        };
        return url;
      }));

    // for translation languages 
    this.currentLanguage$ = this.agentService.currentLanguage$;
    this.homeText$ = this.agentService.homeText$;
    this.queueText$ = this.agentService.queueText$;
    this.visitorTagText$ = this.agentService.visitorTagText$;
    this.viewText$ = this.agentService.viewText$;
    this.teamNotesText$ = this.agentService.teamNotesText$;
    this.awayText$ = this.agentService.awayText$;
    this.messageText$ = this.agentService.messageText$;
    this.noShowText$ = this.agentService.noShowText$;
    this.clearText$ = this.agentService.clearText$
    this.callingText$ = this.agentService.callingText$;
    this.searchByTagText$ = this.agentService.searchByTagText$;
    this.searchLocationText$ = this.agentService.searchLocationText$;
    this.searchTemplateText$ = this.agentService.searchTemplateText$;
    this.deskText$ = this.agentService.deskText$;
    this.selectDeskText$ = this.agentService.selectDeskText$;
    this.submitText$ = this.agentService.submitText$;
    this.servingText$ = this.agentService.servingText$;
    this.byQueueText$ = this.agentService.byQueueText$;
    this.byVisitorTagText$ = this.agentService.byVisitorTagText$;
    this.removeVisitorTagText$ = this.agentService.removeVisitorTagText$;
    this.createVisitorTagText$ = this.agentService.createVisitorTagText$;
    this.visitorTagNameText$ = this.agentService.visitorTagNameText$;
    this.selectVisitorTagColorText$ = this.agentService.selectVisitorTagColorText$;
    this.visitorTagColorText$ = this.agentService.visitorTagColorText$;
    this.addVisitorTagText$ = this.agentService.addVisitorTagText$
  }

  Init() {
    this.agentService.SetSelectedTabName();
    this.agentService.OnAgentAvailabilityChange(true);
    this.agentService.InitLanguage()
  }

  Destroy() {
    this.agentService.RemoveSelectedTabName();
  }

  Submit(stationDetails: IStationDetails) {
    this.agentService.SubmitStationDetails(stationDetails);
    this.calendarService.FetchAppointmentsByBranchId(stationDetails.Branch.branchId);
  }

  BranchChanged(BranchId: string) {
    this.agentService.BranchChanged(BranchId);
  }

  AgentAvailableChanged(available: boolean) {
    this.agentService.OnAgentAvailabilityChange(available);
  }

  SearchDataChanged(searchData: string) {
    this.agentService.OnSearchDataChanged(searchData);
  }

  onClickEndOfDay() {
    this.agentService.onClickEndOfDay();
  }

  ToggleFilters() {
    this.IsGroupsSidebarShow = false;
    this.IsFiltersShow = !this.IsFiltersShow;
  }

  ToggleSmallQueue() {
    this.agentService.ToggleSmallQueue();
  }

  ToggleGroups() {
    this.IsFiltersShow = false;
    this.IsGroupsSidebarShow = !this.IsGroupsSidebarShow;
  }

  CreateGroup(group: IGroupDetails) {
    this.agentService.CreateNewGroup(group)
  }
  RemoveGroups(groups: string[]) {
    this.RemoveGroup(groups[0]);
    this.IsGroupsSidebarShow = !this.IsGroupsSidebarShow;
  }
  RemoveGroup(groupId: string) {
    this.agentService.RemoveGroup(groupId)
  }

  OpenAddVisitorDialog() {
    this.agentService.OpenAddVisitorDialog();
  }

  CloseAddVisitorDialog(): void {
    this.agentService.CloseAddVisitorDialog();
  }

  ChangeBranchDeskTemplate(): void {
    this.agentService.ChangeBranchDeskTemplate();
  }

  CancelTemplateSelection(): void {
    this.agentService.CancelTemplateSelection();
  }

  TabChange(tab: ITab) {
    this.agentService.TabChange(tab);
  }

  @HostListener('window:beforeunload')
  ClosingTab() {
    this.agentService.OnAgentAvailabilityChange(false);
  }
}
