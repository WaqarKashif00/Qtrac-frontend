import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AgentService } from '../../agent.service';
import { IGroupDetails } from '../../models/agent-models';

@Component({
  selector: 'lavi-agent-sidebar',
  templateUrl: './agent-sidebar.component.html',
  styleUrls: ['./agent-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentSidebarComponent extends AbstractComponent {
  @Input() IsAgentAvailable: boolean;
  @Input() Groups: IGroupDetails[];
  @Input() IsAllowGrouping: boolean;
  @Input() IsAllowCreateGroup: boolean;
  @Input() IsAllowTicketFiltering: boolean;
  @Input() CanAddVisitor: boolean;
  @Input() IsSmallQueue: boolean;
  @Input() OpenQueueInNewTab: boolean;
  @Input() EnableEndOfDayButton: boolean;
  @Input() currentLanguage: string;
  @Input() visitorTagText: string;
  @Input() clearText: string;

  @Output() OnFiltersToggle: EventEmitter<void>;
  @Output() OnToggleGroups: EventEmitter<void>;
  @Output() OnToggleAddVisitor: EventEmitter<void>;
  @Output() OnToggleSmallQueue: EventEmitter<void>;
  @Output() OnChangeBranchDeskTemplate: EventEmitter<void>;
  @Output() OnClickEndOfDay: EventEmitter<void>;

  IsSettingMenuShow: boolean;

  constructor(private readonly agentService: AgentService) {
    super();
    this.Initialize();
  }
  Initialize() {
    this.OnFiltersToggle = new EventEmitter<void>();
    this.OnToggleGroups = new EventEmitter<void>();
    this.OnToggleAddVisitor = new EventEmitter<void>();
    this.OnToggleSmallQueue = new EventEmitter<void>();
    this.OnChangeBranchDeskTemplate = new EventEmitter<void>();
    this.OnClickEndOfDay = new EventEmitter();
  }

  ToggleFilter() {
    this.OnFiltersToggle.emit();
  }

  ToggleGroups() {
    this.OnToggleGroups.emit();
  }

  ToggleAddVisitor() {
    this.OnToggleAddVisitor.emit();
  }

  Logout() {
    this.agentService.Logout(false);
  }

  ToggleSmallQueue() {
    this.IsSettingMenuShow = false;
    this.OnToggleSmallQueue.emit();
  }

  ChangeBranchDeskTemplate(): void {
    this.IsSettingMenuShow = false;
    this.OnChangeBranchDeskTemplate.emit();
  }

  onClickEndOfDay():void{
    this.OnClickEndOfDay.emit();
  }

}
