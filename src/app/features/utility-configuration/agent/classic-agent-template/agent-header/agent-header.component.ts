import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AppNotificationService } from '../../../../../core/services/notification.service';
import { CommonMessages } from '../../../../../models/constants/message-constant';
import { ICustomerURL } from '../../models/agent-models';
import { TabType } from '../../models/utilities-models/agent-tab-type.enum';
import { ITab } from '../../models/utilities-models/agent-tab.model';

@Component({
  selector: 'lavi-agent-header',
  templateUrl: './agent-header.component.html',
  styleUrls: ['./agent-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentHeaderComponent extends AbstractComponent {

  @Input() CustomURL: ICustomerURL;
  @Input() IsOpenClassicView: boolean;
  @Input() ActiveTab: ITab;
  @Input() AgentAllHeaderTabs: ITab[];
  @Input() OpenQueueInNewTab: boolean;
  @Input() Available: boolean;
  @Input() currentLanguage: string;
  @Input() awayText: string

  @Output() OnAvailableChange: EventEmitter<boolean>;
  @Output() OnTabChange: EventEmitter<ITab>;
  @Output() OnSearchDataChanged: EventEmitter<string>;


  Title: string;
  SearchTextData = '';

  get SearchText(){
    return this.SearchTextData;
  }

  set SearchText(value: string){
    this.SearchTextData = value;
    this.OnSearchDataChanged.emit(value);
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private readonly appNotificationService: AppNotificationService) {
    super();
    this.Initialize();
  }

  Initialize() {

    this.OnAvailableChange = new EventEmitter<boolean>();
    this.OnTabChange = new EventEmitter<ITab>();
    this.OnSearchDataChanged = new EventEmitter<string>();
    this.Title = '';

  }

  TabClick(tab: ITab) {
    if (tab.type == TabType.TICKETS) {
      this.FeatureIsComingSoonNotification();
      return;
    }

    this.ActiveTab = tab;
    this.changeDetectorRef.detectChanges();
    this.OnTabChange.emit(tab);

  }

  AgentStatusChanged(value) {
    this.OnAvailableChange.emit(value);
  }

  SearchCloseIconClick() {
    this.SearchText = '';
  }

  private FeatureIsComingSoonNotification() {
    this.appNotificationService.NotifyInfo(CommonMessages.FeatureComingSoonMessage);
  }

}
