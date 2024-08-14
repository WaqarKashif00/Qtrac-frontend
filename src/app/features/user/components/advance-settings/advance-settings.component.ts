import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import { IDropdownList } from 'src/app/models/common/dropdown-list.interface';
import { DefaultUserDropdownValues } from 'src/app/models/constants/user.constant';
import { UserMessages } from 'src/app/models/validation-message/user';
import { IAgentView } from '../../models/agent-view.interface';
import { UserService } from '../../user.service';

@Component({
  selector: 'lavi-user-advance-settings',
  templateUrl: './advance-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAdvanceSettingsComponent  extends AbstractComponent implements AfterViewInit {

  @Input() AgentForm: FormGroup;
  @Input() AgentTemplate: IDropdownList[];
  @Input() Queue: IDropdownList;
  @Input() TemplateList: IAgentView[];
  @Input() ShowOverrideCheckbox: boolean;

  @Output() Queues = new EventEmitter();
  @Output() AddTemplate = new EventEmitter();
  @Output() UncheckOverride = new EventEmitter();
  @Output() showHintMessage = false;

  @ViewChild('queuesMultiselect') QueuesMultiSelectComponent: MultiSelectComponent;

  UserMessages = UserMessages;
  DefaultValues = DefaultUserDropdownValues;

  constructor(private service: UserService){
    super();
    this.showHintMessage = false;
  }

  ngAfterViewInit() {
    this.DisableMultiSelectComponent();
  }

  public BindQueues(event: IAgentDropdown) {
    this.Queues.emit(event.workflowId);
    if (event.id == null) {
      this.showHintMessage = false;
    }
  }

  public BindHintMessage(){
    this.showHintMessage = true;
  }

  public Add(){
    this.service.AddTemplates(this.AgentForm);
    this.showHintMessage = false;
  }

  public Delete(id: string){
    this.service.DeleteTemplates(id);
  }

  public BindAgentViewByRoleOnUncheck() {
    if (!(this.AgentForm.controls.isOverride.value)){
          this.UncheckOverride.emit();
    }
    else{
      this.DisableMultiSelectComponent();
    }
  }

  private DisableMultiSelectComponent() {
    this.QueuesMultiSelectComponent.searchbar.readonly = true;
  }
}
