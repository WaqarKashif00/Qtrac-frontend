import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaletteSettings } from '@progress/kendo-angular-inputs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AgentGroupValidationMessages } from 'src/app/models/validation-message/agent-group-validation.messages';
import { IGroupDetails, IQueueDetails } from '../../models/agent-models';
import { AgentGroupsSidebarService } from './agent-groups-sidebar.service';

@Component({
  selector: 'lavi-agent-groups-sidebar',
  templateUrl: './agent-groups-sidebar.component.html',
  styleUrls: ['./agent-groups-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentGroupsSidebarComponent extends AbstractComponent {
  @Input() IsAgentAvailable: boolean;
  @Input() Queues: IQueueDetails[];
  @Input() Groups: IGroupDetails[];
  @Input() IsAllowGrouping: boolean;
  @Input() IsAllowCreateGroup: boolean;
  @Input() currentLanguage: string;
  @Input() visitorTagText: string;
  @Input() removeVisitorTagText: string;
  @Input() createVisitorTagText: string;
  @Input() visitorTagNameText: string;
  @Input() selectVisitorTagColorText: string;
  @Input() visitorTagColorText: string;
  @Input() addVisitorTagText: string

  @Output() OnCreateGroup: EventEmitter<IGroupDetails>;
  @Output() OnRemoveGroups: EventEmitter<string[]>;

  IsSettingMenuShow: boolean;
  AddGroupForm: FormGroup;
  SelectedGroup: string;
  AgentGroupValidationMessages = AgentGroupValidationMessages;
  SearchData: string='';

  public selected = '';
  public palette: Array<string> = [
    '#fe413b',
    '#4eaec5',
    '#ff5500',
    '#42b683',
    '#5039d4',
    '#4c194e',
    '#fbc736',
    '#b700ff',
    '#2A71C3',
    '#EB1515',
  ];

  public Settings: PaletteSettings = {
    palette: this.palette,
    tileSize: 30,
  };

  get AgentGroups(): IGroupDetails[] {
    if (this.Groups && this.Groups.length > 0) {
      return this.Groups
    }

    return [];
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private service: AgentGroupsSidebarService
  ) {
    super();
    this.Initialize();
    this.InitializeForm();
  }
  Initialize() {
    this.SelectedGroup = '';
    this.OnCreateGroup = new EventEmitter<IGroupDetails>();
    this.OnRemoveGroups = new EventEmitter<string[]>();
  }

  ToggleFilter() {}

  ToggleGroups() {}

  ToggleAddVisitor() {}

  async CreateGroup() {
    if (await this.service.ValidateForm(this.AddGroupForm)) {
      this.OnCreateGroup.emit(this.GetGroupModel());
      this.AddGroupForm.reset();
    }
  }

  GetGroupModel(): IGroupDetails {
    return {
      id: '',
      color: this.AddGroupForm.get('groupColor').value,
      groupName: this.AddGroupForm.get('groupName').value,
    };
  }

  Checked(id: string, state: boolean) {
    if (state) {
      this.SelectedGroup = id;
    } else {
      this.SelectedGroup = '';
    }
  }

  private InitializeForm() {
    this.AddGroupForm = this.formBuilder.group({
      groupName: [null, [Validators.required]],
      groupColor: [
        null,
        [
          Validators.required,
          Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'),
        ],
      ],
    });
    this.AddGroupForm.reset();
  }

  OnChange(color: string): void {
    this.selected = color;
    this.AddGroupForm.get('groupColor').setValue(color);
  }

  RemoveGroups() {
    this.OnRemoveGroups.emit([this.SelectedGroup]);
    this.SelectedGroup = '';
    this.changeDetectorRef.detectChanges();
  }

  SearchDataChanged(searchData: string) {
    this.SearchData = searchData;
  }
}
