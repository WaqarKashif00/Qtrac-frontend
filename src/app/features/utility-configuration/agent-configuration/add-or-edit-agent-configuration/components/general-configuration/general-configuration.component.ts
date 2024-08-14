import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IDropdownList } from 'src/app/models/common/dropdown-list.interface';
import { DefaultAgentConfigValues } from 'src/app/models/constants/agent-configuration.constants';
import { AgentConfigurationMessages } from 'src/app/models/validation-message/agent-configuration';
import { ITextFieldLoaderSettings } from 'src/app/models/common/text-field-loader-settings.interface';
import { ILayoutTemplate} from 'src/app/features/branch-list/models/layout-template.interface';
import { ISchedulerTemplate } from 'src/app/features/branch-list/models/scheduler-template.interface';

@Component({
  selector: 'lavi-agent-general-configuration',
  templateUrl: './general-configuration.component.html',
  styleUrls: ['./general-configuration.component.scss'],
})
export class AgentGeneralConfigurationComponent extends AbstractComponent {
  @Input() WorkflowList: IDropdownList[];
  @Input() AgentViewList: IDropdownList[];
  @Input() MobileTemplatesList: ILayoutTemplate[];
  @Input() SchedulerTemplatesList: ISchedulerTemplate[];
  @Input() GeneralConfigForm: FormGroup;

  @Output() OnChangeOfAgentViewType = new EventEmitter();
  @Output() OnChangeOfWorkflow = new EventEmitter();

  public DefaultValues = DefaultAgentConfigValues;
  public ValidationMessages = AgentConfigurationMessages;
  get GeneralConfigNameFormControl() {
    return this.GeneralConfigForm.get('name');
  }

  LoaderSettings: ITextFieldLoaderSettings = {
    TextFiledDivClasses: ['col-lg-12', 'col-md-12'],
  };
  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    super();
  }
  Init() {
    this.subs.sink = this.GeneralConfigNameFormControl.statusChanges.subscribe(
      () => {
        this.changeDetectorRef.detectChanges();
      }
    );
    // Inherited from AbstractComponent to initialize component life cycle
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }
 WorkflowChange(){  
    const workflow = this.GeneralConfigForm.get('workflow').value;
    const workflowId = workflow?.workFlowId;
    this.OnChangeOfWorkflow.emit(workflowId);

  }

  

  public OnChangeOfAgentView(event: IDropdownList) {
    this.OnChangeOfAgentViewType.emit(event.value);
  }
}
