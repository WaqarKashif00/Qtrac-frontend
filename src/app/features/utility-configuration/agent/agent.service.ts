import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { TokenService } from 'src/app/core/services/token.service';
import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { InitialUserDetails } from 'src/app/models/common/initial-user-details.interface';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { MenuTag } from 'src/app/models/enums/menu-tag.enum';
import { TabName } from 'src/app/models/enums/tab-name.enum';
import { UserAPIService } from 'src/app/shared/api-services/user-api.service';
import { Confirmable } from 'src/app/shared/decorators/confirmable.decorator';
import { AgentAPIService } from '../../../shared/api-services/agent-api.service';
import { BranchAPIService } from '../../../shared/api-services/branch-api.service';
import { ClassicAgentService } from './classic-agent-template/classic-agent.service';
import {
  IBranchDropdown,
  IBranchDropdownWithTag,
  IGroupDetails,
  IPostGroup,
  IQueueDetails,
  IStationDetails,
} from './models/agent-models';
import {
  CalendarTab,
  ITab,
  QueueTab,
  TicketsTab,
} from './models/utilities-models/agent-tab.model';
import { IAgentConfiguration } from './utility-services/models/agent-configurations-models.ts/agent-configurations.interface';
import { AgentStationDataService } from './utility-services/services/agent-station-data-service/agent-station-data.service';
import { AgentGridFilterService } from './utility-services/services/agent-grid-filter-service/agent-grid-filter.service';
import { CompanyAPIService } from 'src/app/shared/api-services/company-api.service';
@Injectable()
export class AgentService extends AbstractComponentService {
  private SubjectBranchDropdown: BehaviorSubject<IBranchDropdown[]>;
  Branches$: Observable<IBranchDropdown[]>;

  private SubjectDeskDropdown: BehaviorSubject<IDropdown[]>;
  Desks$: Observable<IDropdown[]>;

  private SubjectTemplateDropdown: BehaviorSubject<IAgentDropdown[]>;
  Templates$: Observable<IAgentDropdown[]>;

  private SubjectOpenSelectStationDataDialog: BehaviorSubject<boolean>;
  OpenSelectStationDataDialog$: Observable<boolean>;

  private SubjectOpenAddVisitorDialog: BehaviorSubject<boolean>;
  OpenAddVisitorDialog$: Observable<boolean>;

  public queues$: Observable<IQueueDetails[]>;
  public groups$: Observable<IGroupDetails[]>;

  private SubjectIsAgentAvailable: BehaviorSubject<boolean>;
  IsAgentAvailable$: Observable<boolean>;

  private SubjectAgentConfigurations: BehaviorSubject<IAgentConfiguration>;
  AgentConfigurations$: Observable<IAgentConfiguration>;

  private ActiveTabSubject: BehaviorSubject<ITab>;
  ActiveTab$: Observable<ITab>;

  private AgentAllHeaderTabsSubject: BehaviorSubject<ITab[]>;
  AgentAllHeaderTabs$: Observable<ITab[]>;

  private SubjectIsSmallQueue: BehaviorSubject<boolean>;
  IsSmallQueue$: Observable<boolean>;
  Tags$: Observable<string[]>;
  AllowEditingCustomerInformation$: Observable<boolean>;

  private OpenQueueInNewTabSubject: BehaviorSubject<boolean>;
  OpenQueueInNewTab$: Observable<boolean>;

  InitialUserDetails: InitialUserDetails;

  changeFrom$: Observable<boolean>;
  private changeFromSubject: BehaviorSubject<boolean>;
  OpenConnectionMonitorDialog: Observable<boolean>;
  OpenConnectionMonitorDialogSubject: BehaviorSubject<boolean>;

  currentLanguage$: Observable<string>;
  currentLanguageSubject: BehaviorSubject<string>;
  homeText$: Observable<string>;
  homeTextSubject: BehaviorSubject<string>;
  queueText$: Observable<string>;
  queueTextSubject: BehaviorSubject<string>;
  visitorTagText$: Observable<string>;
  visitorTagTextSubject: BehaviorSubject<string>;
  removeVisitorTagText$: Observable<string>;
  removeVisitorTagTextSubject: BehaviorSubject<string>;
  viewText$: Observable<string>;
  viewTextSubject: BehaviorSubject<string>;
  teamNotesText$: Observable<string>;
  teamNotesTextSubject: BehaviorSubject<string>;
  awayText$: Observable<string>;
  awayTextSubject: BehaviorSubject<string>;
  appointmentsText$: Observable<string>;
  appointmentsTextSubject: BehaviorSubject<string>;
  messageText$: Observable<string>;
  messageTextSubject: BehaviorSubject<string>;
  noShowText$: Observable<string>;
  noShowTextSubject: BehaviorSubject<string>;
  servedText$: Observable<string>;
  servedTextSubject: BehaviorSubject<string>;
  clearText$: Observable<string>;
  clearTextSubject: BehaviorSubject<string>;
  callingText$: Observable<string>;
  callingTextSubject: BehaviorSubject<string>;
  searchByTagText$: Observable<string>;
  searchBYTagTextSubject: BehaviorSubject<string>;
  searchLocationText$: Observable<string>;
  searchLocationTextSubject: BehaviorSubject<string>;
  searchTemplateText$: Observable<string>;
  searchTemplateTextSubject: BehaviorSubject<string>;
  deskText$: Observable<string>;
  deskTextSubject: BehaviorSubject<string>;
  selectDeskText$: Observable<string>;
  selectDeskTextSubject: BehaviorSubject<string>;
  submitText$: Observable<string>;
  submitTextSubject: BehaviorSubject<string>;
  servingText$: Observable<string>;
  servingTextSubject: BehaviorSubject<string>;
  byQueueText$: Observable<string>;
  byQueueTextSubject: BehaviorSubject<string>;
  byVisitorTagText$: Observable<string>;
  byVisitorTagTextSubject: BehaviorSubject<string>;
  createVisitorTagText$: Observable<string>;
  createVisitorTagTextSubject: BehaviorSubject<string>;
  visitorTagNameText$: Observable<string>;
  visitorTagNameTextSubject: BehaviorSubject<string>;
  selectVisitorTagColorText$: Observable<string>;
  selectVisitorTagColorTextSubject: BehaviorSubject<string>;
  visitorTagColorTextSubject: BehaviorSubject<string>;
  visitorTagColorText$: Observable<string>;
  addVisitorTagText$: Observable<string>;
  addVisitorTagTextSubject: BehaviorSubject<string>;

  constructor(
    private tokenService: TokenService,
    private classicService: ClassicAgentService,
    private userAPIService: UserAPIService,
    private agentStationDataService: AgentStationDataService,
    private readonly companyAPIService: CompanyAPIService,
    private readonly branchAPIService: BranchAPIService,
    private readonly agentAPIService: AgentAPIService,
    private AgentGridFilterService: AgentGridFilterService
  ) {
    super();
    this.SetObservables();
    this.InitializeDefaultValues();
    this.TraceMenuClick();
    this.InitLanguage();

    this.AllowEditingCustomerInformation$ =
      this.agentStationDataService.StationDetails$.pipe(
        map((StationDetails) => {
          if (StationDetails && StationDetails.AgentConfiguration) {
            return StationDetails.AgentConfiguration
              .allowEditingCustomerInformation
              ? true
              : false;
          }
        })
      );
  }

  private SetObservables() {
    this.subs.sink = this.mediatorService.InitialUserDetails$.subscribe(
      (data) => {
        this.InitialUserDetails = data;
      }
    );
    this.OpenQueueInNewTabSubject = new BehaviorSubject<boolean>(false);
    this.OpenQueueInNewTab$ = this.OpenQueueInNewTabSubject.asObservable();
    this.OpenQueueInNewTabSubject.next(
      this.appConfigService.config.IsOpenQueueInNewTab
    );
    this.OpenConnectionMonitorDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenConnectionMonitorDialog = this.OpenConnectionMonitorDialogSubject.asObservable();

    this.changeFromSubject = new BehaviorSubject<boolean>(false);
    this.changeFrom$ = this.changeFromSubject.asObservable();

    this.SubjectBranchDropdown = new BehaviorSubject<IBranchDropdown[]>([]);
    this.Branches$ = this.SubjectBranchDropdown.asObservable();

    this.SubjectTemplateDropdown = new BehaviorSubject<IAgentDropdown[]>([]);
    this.Templates$ = this.SubjectTemplateDropdown.asObservable();

    this.SubjectDeskDropdown = new BehaviorSubject<IDropdown[]>([]);
    this.Desks$ = this.SubjectDeskDropdown.asObservable();

    this.SubjectIsAgentAvailable = new BehaviorSubject<boolean>(true);
    this.IsAgentAvailable$ = this.SubjectIsAgentAvailable.asObservable();

    this.SubjectAgentConfigurations = new BehaviorSubject<IAgentConfiguration>(
      null
    );
    this.AgentConfigurations$ = this.SubjectAgentConfigurations.asObservable();

    this.SubjectOpenSelectStationDataDialog = new BehaviorSubject<boolean>(
      !this.agentStationDataService.IsStationDetailsAvailable()
    );
    this.OpenSelectStationDataDialog$ =
      this.SubjectOpenSelectStationDataDialog.asObservable();
    this.SubjectIsSmallQueue = new BehaviorSubject<boolean>(false);
    this.IsSmallQueue$ = this.SubjectIsSmallQueue.asObservable();

    this.SubjectOpenAddVisitorDialog = new BehaviorSubject<boolean>(false);
    this.OpenAddVisitorDialog$ =
      this.SubjectOpenAddVisitorDialog.asObservable();

    this.ActiveTabSubject = new BehaviorSubject<ITab>(null);
    this.ActiveTab$ = this.ActiveTabSubject.asObservable();

    this.AgentAllHeaderTabsSubject = new BehaviorSubject<ITab[]>([]);
    this.AgentAllHeaderTabs$ = this.AgentAllHeaderTabsSubject.asObservable();

    this.queues$ = this.classicService.Queues$;
    this.groups$ = this.classicService.Groups$;
    this.subs.sink = this.agentStationDataService
      .Get()
      .subscribe((stationDetails) => {
        this.OnStationDataChange(stationDetails);
        this.InitializeTabs();
      });

    this.Tags$ = this.Branches$.pipe(
      map((branches) => {
        const tags = branches.reduce((p, c) => {
          return p.concat(c.tags);
        }, []);
        const uniqueTags = [...new Set(tags)];
        return uniqueTags;
      })
    );
    this.currentLanguageSubject = new BehaviorSubject<string>('en');
    this.currentLanguage$ = this.currentLanguageSubject.asObservable();
    this.homeTextSubject = new BehaviorSubject<string>('Home');
    this.homeText$ = this.homeTextSubject.asObservable();
    this.queueTextSubject = new BehaviorSubject<string>('Queue');
    this.queueText$ = this.queueTextSubject.asObservable();
    this.visitorTagTextSubject = new BehaviorSubject<string>('Visitor Tags');
    this.visitorTagText$ = this.visitorTagTextSubject.asObservable();
    this.viewTextSubject = new BehaviorSubject<string>('View');
    this.viewText$ = this.viewTextSubject.asObservable();
    this.teamNotesTextSubject = new BehaviorSubject<string>('Team Notes');
    this.teamNotesText$ = this.teamNotesTextSubject.asObservable();
    this.awayTextSubject = new BehaviorSubject<string>('Away');
    this.awayText$ = this.awayTextSubject.asObservable();
    this.appointmentsTextSubject = new BehaviorSubject<string>('Appointments');
    this.appointmentsText$ = this.appointmentsTextSubject.asObservable();
    this.messageTextSubject = new BehaviorSubject<string>('Message');
    this.messageText$ = this.messageTextSubject.asObservable();
    this.noShowTextSubject = new BehaviorSubject<string>('No Show');
    this.noShowText$ = this.noShowTextSubject.asObservable();
    this.servedTextSubject = new BehaviorSubject<string>('Served');
    this.servedText$ = this.servedTextSubject.asObservable();
    this.clearTextSubject = new BehaviorSubject<string>('Clear');
    this.clearText$ = this.clearTextSubject.asObservable();
    this.callingTextSubject = new BehaviorSubject<string>('Calling');
    this.callingText$ = this.callingTextSubject.asObservable();
    this.searchBYTagTextSubject = new BehaviorSubject<string>('Search Location By Tags');
    this.searchByTagText$ = this.searchBYTagTextSubject.asObservable();
    this.searchLocationTextSubject = new BehaviorSubject<string>('Select Location');
    this.searchLocationText$ = this.searchLocationTextSubject.asObservable();
    this.searchTemplateTextSubject = new BehaviorSubject<string>('Select Template');
    this.searchTemplateText$ = this.searchTemplateTextSubject.asObservable();
    this.deskTextSubject = new BehaviorSubject<string>('Desk');
    this.deskText$ = this.deskTextSubject.asObservable();
    this.selectDeskTextSubject = new BehaviorSubject<string>('Select Desk');
    this.selectDeskText$ = this.selectDeskTextSubject.asObservable();
    this.submitTextSubject = new BehaviorSubject<string>('Submit');
    this.submitText$ = this.submitTextSubject.asObservable();
    this.servingTextSubject = new BehaviorSubject<string>('Serving');
    this.servingText$ = this.servingTextSubject.asObservable();
    this.byQueueTextSubject = new BehaviorSubject<string>('BY QUEUE');
    this.byQueueText$ = this.byQueueTextSubject.asObservable();
    this.byVisitorTagTextSubject = new BehaviorSubject<string>('BY VISITOR TAG');
    this.byVisitorTagText$ = this.byVisitorTagTextSubject.asObservable();
    this.removeVisitorTagTextSubject = new BehaviorSubject<string>('Visitor Tag');
    this.removeVisitorTagText$ = this.removeVisitorTagTextSubject.asObservable();
    this.createVisitorTagTextSubject = new BehaviorSubject<string>('Create New Visitor Tag');
    this.createVisitorTagText$ = this.createVisitorTagTextSubject.asObservable();
    this.visitorTagNameTextSubject = new BehaviorSubject<string>('Visitor Tag name');
    this.visitorTagNameText$ = this.visitorTagNameTextSubject.asObservable();
    this.selectVisitorTagColorTextSubject = new BehaviorSubject<string>('Select Visitor Tag Color');
    this.selectVisitorTagColorText$ = this.selectVisitorTagColorTextSubject.asObservable();
    this.visitorTagColorTextSubject = new BehaviorSubject<string>('Visitor Tag Color');
    this.visitorTagColorText$ = this.visitorTagColorTextSubject.asObservable();
    this.addVisitorTagTextSubject = new BehaviorSubject<string>('Add Visitor Tag');
    this.addVisitorTagText$ = this.addVisitorTagTextSubject.asObservable();
  }

  InitializeDefaultValues(): void {
    this.InitializeTabs();
    this.InitializeAvailability();
    this.InitializeBranchesDropdown();
  }
  openConnectionMonitor() {
    this.OpenConnectionMonitorDialogSubject.next(true);
  }

  private InitializeAvailability() {
    this.SubjectIsAgentAvailable.next(true);
  }

  private InitializeTabs() {
    const isDataAvailable =
      this.agentStationDataService.IsStationDetailsAvailable();
    if (!isDataAvailable) {
      return;
    }
    const Tabs: ITab[] = [];
    Tabs.push(new QueueTab(this.queueTextSubject?.getValue() ?? 'Queue'));

    if (
      this.agentStationDataService.Value.AgentConfiguration.displayAppointments
    ) {
      Tabs.push(new CalendarTab(this.appointmentsTextSubject?.getValue() ?? 'Appointments'));
    }

    if (
      this.agentStationDataService.Value.AgentConfiguration.displayTodaysTickets
    ) {
      Tabs.push(new TicketsTab(this.servedTextSubject?.getValue() ?? 'Served'));
    }

    this.AgentAllHeaderTabsSubject.next(Tabs);
    this.ActiveTabSubject.next(
      this.agentStationDataService.AgentActiveTab || Tabs[0]
    );
  }

  async InitializeBranchesDropdown() {
    this.agentStationDataService.IsAgentAvailable = true;
    this.branchAPIService
      .GetBranchNamesWithTags<IBranchDropdownWithTag>(
        this.authService.CompanyId,
        true
      )
      .pipe(
        map((branches) => {
          return branches
            .map((branch) => {
              return {
                branchId: branch.branch.id,
                branchName: branch.branch.name,
                defaultLanguageId: '',
                tags: branch.tags?.map((tag) => tag.id),
                desks: branch.desks,
                workflows: branch.workflows,
              } as IBranchDropdown;
            })
            .reduce((prevArr, current) => {
              const found = prevArr.find((x) => x.branchId == current.branchId);
              if (found) {
                prevArr[prevArr.indexOf(found)].tags = []
                  .concat(prevArr[prevArr.indexOf(found)].tags)
                  .concat(current.tags);
              } else {
                prevArr.push(current);
              }
              return prevArr;
            }, []);
        })
      )
      .subscribe((response) => {
        if (
          this.InitialUserDetails &&
          this.InitialUserDetails.branches &&
          this.InitialUserDetails.branches.length > 0
        ) {
          this.SubjectBranchDropdown.next(response.filter((x) => this.InitialUserDetails.branches.find((y) => y.id == x.branchId || x.tags.includes(y.id))));
          if (this.SubjectBranchDropdown.value && this.SubjectBranchDropdown.value.length == 1) {
            this.BranchChanged(this.SubjectBranchDropdown.value[0].branchId, true);
          } else {
            const isDataAvailable =
              this.agentStationDataService.IsStationDetailsAvailable();
            this.SubjectOpenSelectStationDataDialog.next(!isDataAvailable);
          }
        } else {
          this.SubjectBranchDropdown.next(response);
          if (response.length === 1) {
            this.BranchChanged(response[0].branchId, true);
          } else {
            const isDataAvailable =
              this.agentStationDataService.IsStationDetailsAvailable();
            this.SubjectOpenSelectStationDataDialog.next(!isDataAvailable);
          }
        }
      });
  }

  async InitializeTemplateDropdown(branchId: string, oneBranchOnly?: boolean) {
    this.SubjectTemplateDropdown.next([]);
    if (branchId) {
      this.subs.sink = this.agentAPIService
        .GetDropdownList<IAgentDropdown>(this.authService.CompanyId)
        .subscribe(async (response) => {
          let branchWorkflows = this.SubjectBranchDropdown.value.find(
            (x) => x.branchId == branchId
          )?.workflows;
          branchWorkflows?.forEach(async (branchWf) => {
            const temp = response.filter(
              (x) =>
                this.InitialUserDetails.agentTemplate.find(
                  (y) => y.agentId == x.id
                ) && x.workflowId == branchWf.workFlowId
            );
            if (temp && temp[0]) {
              this.SubjectTemplateDropdown.next(
                this.SubjectTemplateDropdown.value.concat(temp)
              );
              if (temp.length === 1 && oneBranchOnly && temp[0].displayAgentLogin && !temp[0].displayDeskLogin) {
                let stationDetailsObject = await this.GetStationDetails(this.SubjectBranchDropdown.value[0], temp[0])
                this.SubmitStationDetails(stationDetailsObject, oneBranchOnly);
                this.SubjectOpenSelectStationDataDialog.next(false);
              } else {
                this.changeFromSubject.next(false);
                const isDataAvailable = this.agentStationDataService.IsStationDetailsAvailable();
                if (!isDataAvailable) {
                  this.SubjectOpenSelectStationDataDialog.next(true);
                }

              }
            }
          });
        });
    }
  }

  TraceMenuClick() {
    this.subs.sink = this.mediatorService.TraceMenuClick$.subscribe((data) => {
      if (data === MenuTag.Location) {
        this.ChangeBranchDeskTemplate();
      }
      if (data === MenuTag.View) {
        this.ToggleSmallQueue();
      }
      if (data === MenuTag.Logout) {
        this.Logout(false);
      }
    });
  }

  SubmitStationDetails(stationDetails: IStationDetails, oneBranch?: boolean) {
    this.agentStationDataService.Update(stationDetails);
    if (stationDetails) {
      this.subs.sink = this.userAPIService
        .SetAgentDeskSettings(
          this.authService.CompanyId,
          this.authService.UserId,
          {
            branchId: stationDetails.Branch.branchId,
            deskName: stationDetails.Desk?.value || null,
            templateId: stationDetails.Template.id,
            loginAs: stationDetails.LoginAs,
          }
        )
        .subscribe((response) => {
          if (oneBranch) {
            this.changeFromSubject.next(true);
          }
          // todo update localdata
        });
    }
  }

  OnStationDataChange(stationDetails: IStationDetails) {
    this.SubjectAgentConfigurations.next(
      this.agentStationDataService.AgentConfigurations
    );
    this.SubjectOpenSelectStationDataDialog.next(false);
  }

  async GetStationDetails(branch: IBranchDropdown, template: IAgentDropdown) {

    let stationDetails: IStationDetails = {
      Branch: branch,
      Template: template,
      Desk: null,
      LoginAs: 'agent',
      Workflow: null,
      AgentConfiguration: null,
      BranchDetails: null,
      BranchesWithWorkflows: null
    };
    return stationDetails;
  }

  OnAgentAvailabilityChange(available: boolean) {
    this.agentStationDataService.IsAgentAvailable = available;
    this.SubjectIsAgentAvailable.next(available);

    this.userAPIService
      .SetOnlineAsAgent<any>(
        this.authService.CompanyId,
        this.authService.UserId,
        available
      )
      .subscribe((availableResponse) => {
        if (available != availableResponse.isOnlineAsAgent) {
          this.agentStationDataService.IsAgentAvailable =
            availableResponse.isOnlineAsAgent;
          this.SubjectIsAgentAvailable.next(availableResponse.isOnlineAsAgent);
        }
      });
  }

  OnSearchDataChanged(SearchData: string) {
    this.classicService.SearchDataSubject.next(SearchData);
  }

  BranchChanged(branchId: string, oneBranchOnly?: boolean) {
    this.InitializeTemplateDropdown(branchId, oneBranchOnly);
    this.InitializeDeskDropdown(branchId);
  }

  InitializeDeskDropdown(branchId: string) {
    if (branchId) {
      const deskDD: IDropdown[] = this.SubjectBranchDropdown.value
        .find((x) => x.branchId == branchId)
        .desks?.map((x) => {
          return {
            text: x.title,
            value: x.id,
          };
        });
      this.SubjectDeskDropdown.next(deskDD);
    } else {
      this.SubjectDeskDropdown.next([]);
    }
  }

  CreateNewGroup(group: IGroupDetails) {
    if (group) {
      const PostGroup: IPostGroup = {
        id: this.uuid,
        agentId: this.authService.UserId,
        color: group.color,
        groupName: group.groupName,
        group: null,
      };
      group.id = this.uuid;
      group.id = this.uuid;
      this.agentAPIService
        .CreateGroup(
          this.authService.CompanyId,
          this.authService.UserId,
          PostGroup
        )
        .subscribe((response) => {
          this.InitializeGroups();
        });
    }
  }

  @Confirmable(CommonMessages.ConfirmationGroupDeletion)
  RemoveGroup(groupId: string) {
    if (groupId) {
      this.agentAPIService
        .DeleteGroup(
          this.authService.CompanyId,
          this.authService.UserId,
          groupId
        )
        .subscribe((response) => {
          this.InitializeGroups();
        });
    }
  }

  InitializeGroups() {
    this.classicService.InitializeGroups();
  }

  OpenAddVisitorDialog() {
    this.SubjectOpenAddVisitorDialog.next(true);
  }

  CloseAddVisitorDialog(): void {
    this.SubjectOpenAddVisitorDialog.next(false);
  }

  CancelTemplateSelection(): void {
    this.SubjectOpenSelectStationDataDialog.next(false);
  }

  TabChange(tab: ITab): void {
    this.agentStationDataService.AgentActiveTab = tab;
    this.ActiveTabSubject.next(tab);
  }

  SetSelectedTabName() {
    this.mediatorService.SetSelectedTabName(TabName.Queue);
  }

  RemoveSelectedTabName() {
    this.mediatorService.RemoveSelectedTabName();
  }
  ToggleSmallQueue() {
    this.SubjectIsSmallQueue.next(!this.SubjectIsSmallQueue.value);
  }
  ChangeBranchDeskTemplate(): void {
    this.SubjectOpenSelectStationDataDialog.next(true);
    this.BranchChanged(this.agentStationDataService.BranchDetails.branchId);
  }

  Logout(logout: boolean) {
    this.OnAgentAvailabilityChange(false);
    this.tokenService.Logout(false);
  }

  CheckUpdateStaticDetails() {
    this.agentStationDataService.CheckUpdateStaticDetails();
  }

  ResetSelectedQueue() {
    this.AgentGridFilterService.SelectedQueues = [];
    this.AgentGridFilterService.SelectedGroups = [];
  }

  @Confirmable(CommonMessages.EndOfDayConfirmationMessage)
  onClickEndOfDay() {
    const endofday = {
      userId: this.authService.UserId
    }
    this.companyAPIService
      .EndOfDay(
        this.authService.CompanyId,
        this.agentStationDataService.BranchId,
        endofday
      )
      .subscribe((x) => { });
  }

  InitLanguage() {
    if (document.documentElement && document.documentElement.lang == 'es') {
      this.changeTextsToSpanish();
      this.currentLanguageSubject.next(document.documentElement.lang);
    } else {
      this.changeTextsToEnglish();
      this.currentLanguageSubject.next('en');
    }
    // Create a new MutationObserver instance
    const observer = new MutationObserver((mutations) => {
      // Check if the document.documentElement.lang property has changed
      if (document.documentElement && document.documentElement.lang) {
        const newLanguage = document.documentElement.lang;
        if (newLanguage !== this.currentLanguageSubject.getValue() || newLanguage === "es") {
          if (newLanguage == 'es') {
            this.changeTextsToSpanish();
          } else {
            this.changeTextsToEnglish();
          }
          this.currentLanguageSubject.next(newLanguage);
        }
        this.InitializeTabs();
      } else {
        this.currentLanguageSubject.next('en');
      }
    });

    // Configure the MutationObserver to observe changes in the document.documentElement.lang property
    observer.observe(document.documentElement, { attributes: true });
  }

  changeTextsToSpanish() {
    this.homeTextSubject.next('Inicio');
    this.queueTextSubject.next('Fila');
    this.visitorTagTextSubject.next('Etiquetas');
    this.viewTextSubject.next('Ver');
    this.teamNotesTextSubject.next('Notas');
    this.awayTextSubject.next('Inactivo');
    this.appointmentsTextSubject.next('Agenda de Citas');
    this.messageTextSubject.next('Mensajes');
    this.noShowTextSubject.next('Eliminar');
    this.servedTextSubject.next('Historial de Hoy');
    this.clearTextSubject.next('Vaciar las filas');
    this.callingTextSubject.next('Llamando');
    this.searchBYTagTextSubject.next('Buscar Sucursal por Etiqueta(s)');
    this.searchLocationTextSubject.next('Seleccionar Sucursal');
    this.searchTemplateTextSubject.next('Seleccionar vista');
    this.deskTextSubject.next('Estación');
    this.selectDeskTextSubject.next('Seleccionar estación');
    this.submitTextSubject.next('Enviar');
    this.servingTextSubject.next('Sirviendo');
    this.byQueueTextSubject.next('Por Fila');
    this.byVisitorTagTextSubject.next('Por Etiqueta');
    this.removeVisitorTagTextSubject.next('Eliminar Etiqueta');
    this.createVisitorTagTextSubject.next('Crear nueva Etiqueta');
    this.visitorTagNameTextSubject.next('Nombre de la etiqueta');
    this.selectVisitorTagColorTextSubject.next('Seleccionar Color de la Etiqueta');
    this.visitorTagColorTextSubject.next('Color de la Etiqueta');
    this.addVisitorTagTextSubject.next('Agregar Etiqueta');

  }

  changeTextsToEnglish() {
    this.homeTextSubject.next('Home');
    this.queueTextSubject.next('Queue');
    this.visitorTagTextSubject.next('Visitor Tags');
    this.viewTextSubject.next('View');
    this.teamNotesTextSubject.next('Team Notes');
    this.awayTextSubject.next('Away');
    this.appointmentsTextSubject.next('Appointments');
    this.messageTextSubject.next('Message');
    this.noShowTextSubject.next('No Show');
    this.servedTextSubject.next('Served');
    this.clearTextSubject.next('Clear');
    this.callingTextSubject.next('Calling');
    this.searchBYTagTextSubject.next('Search Location By Tags');
    this.searchLocationTextSubject.next('Select Location');
    this.searchTemplateTextSubject.next('Select Template');
    this.deskTextSubject.next('Desk');
    this.selectDeskTextSubject.next('Select Desk');
    this.submitTextSubject.next('Submit');
    this.servingTextSubject.next('Serving');
    this.byQueueTextSubject.next('BY QUEUE');
    this.byVisitorTagTextSubject.next('BY VISITOR TAG');
    this.removeVisitorTagTextSubject.next('Remove Visitor Tag');
    this.createVisitorTagTextSubject.next('Create New Visitor Tag');
    this.visitorTagNameTextSubject.next('Visitor Tag name');
    this.selectVisitorTagColorTextSubject.next('Select Visitor Tag Color');
    this.visitorTagColorTextSubject.next('Visitor Tag Color');
    this.addVisitorTagTextSubject.next('Add Visitor Tag');
  }
}
