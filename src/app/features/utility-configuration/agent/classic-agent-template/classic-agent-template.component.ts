import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IAgentCustomersListItem } from '../models/agent-models';
import { TabType } from '../models/utilities-models/agent-tab-type.enum';
import { ITab } from '../models/utilities-models/agent-tab.model';
import { ClassicAgentService } from './classic-agent.service';

@Component({
  selector: 'lavi-classic-agent-template',
  templateUrl: './classic-agent-template.component.html',
  styleUrls: ['./classic-agent-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassicAgentTemplateComponent extends AbstractComponent {

  /**
   *
   */
  @Input() IsAgentAvailable: boolean;
  @Input() IsSmallQueue: boolean;
  @Input() ActiveTab: ITab;
  @Input() AllowEditingCustomerInformation$:Observable<boolean>;
  @Input() IsFiltersShow: boolean;
  @Input() IsGroupsSidebarShow: boolean;
  @Input() currentLanguage: string;
  @Input() visitorTagText: string;
  @Input() queueText: string;
  @Input() viewText: string;
  @Input() teamNotesText: string;
  @Input() messageText: string;
  @Input() noShowText: string;
  @Input() callingText: string;
  @Input() servingText: string;

  IsAnySelected$: Observable<boolean>;
  IsStationSectionVisible$: Observable<boolean>;
  IsStationSectionExpanded$: Observable<boolean>;

  CustomerForDialog$: Observable<IAgentCustomersListItem>;
  TransferServiceForDialog$: Observable<IAgentCustomersListItem>;
  IsCustomerInformationDialogOpen$: Observable<boolean>;
  IsTransferServiceDialogOpen$: Observable<boolean>;
  IsEditMode:boolean=false;

  get IsQueue(): boolean {
    if (this.ActiveTab && this.ActiveTab.type == TabType.QUEUE) {
      return true;
    }
    return false;
  }

  get IsCalender(): boolean {
    if (this.ActiveTab && this.ActiveTab.type == TabType.CALENDAR) {
      return true;
    }
    return false;
  }

  constructor(private service: ClassicAgentService) {
    super();
    this.Initialize();
  }
  Initialize() {
    this.IsAgentAvailable = true;
    this.IsAnySelected$ = this.service.IsAnySelected$;
    this.CustomerForDialog$ = this.service.CustomerForDialog$;
    this.TransferServiceForDialog$ = this.service.TransferServiceForDialog$;
    this.IsCustomerInformationDialogOpen$ = this.service.IsCustomerInformationDialogOpen$;
    this.IsTransferServiceDialogOpen$ = this.service.IsTransferServiceDialogOpen$;
    this.IsStationSectionExpanded$ = this.service.IsStationSectionExpand$;
    this.IsStationSectionVisible$ = this.service.IsStationSectionVisible$;
  }

  CloseCustomerInformationDialog(IsEditMode:boolean): void {
    this.IsEditMode=IsEditMode;
    this.service.CloseCustomerInformationDialog(IsEditMode);
  }
 
  CloseTransferServiceDialog(){
    this.IsEditMode=false;
    this.service.CloseCustomerInformationDialog(this.IsEditMode);
    this.service.CloseTransferServiceDialog();
  }

}
