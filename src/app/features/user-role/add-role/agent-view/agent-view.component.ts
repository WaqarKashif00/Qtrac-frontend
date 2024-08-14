import {
  ChangeDetectionStrategy,

  Component,
  EventEmitter,
  Input,

  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { MediatorService } from 'src/app/core/services/mediator.service';
import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import { UserRoleMesseges } from 'src/app/models/validation-message/user-role.messeges';
import {
  IAgentQueueDropdownList,
  IAgentTemplate
} from '../../../../models/common/user-role/add-user-role';

@Component({
  selector: 'lavi-agent-view',
  templateUrl: './agent-view.component.html',
  styleUrls: ['./agent-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentViewComponent extends AbstractComponent {
  @Input() AgentTemplateDropdownList: Array<IAgentDropdown>;
  @Input() AgentQueueDropdownList: Array<IAgentQueueDropdownList>;
  @Input() agentTemplates: Array<IAgentTemplate>;
  @Input() EditedTemplateId: string;
  @Output() OnAddTemplate: EventEmitter<FormGroup>;
  @Output() OnTemplateChange: EventEmitter<string>;
  @Output() OnDeleteTemplate: EventEmitter<string>;
  @Output() OnUpdateTemplate: EventEmitter<string>;
  @Output() showHintMessage = false;
  AgentTemplateForm: FormGroup;
  DefaultTemplate: IAgentDropdown;
  ConfigMessages = UserRoleMesseges;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    super();
    this.OnAddTemplate = new EventEmitter<FormGroup>();
    this.OnDeleteTemplate = new EventEmitter<string>();
    this.OnUpdateTemplate = new EventEmitter<string>();
    this.OnTemplateChange = new EventEmitter<string>();
    this.DefaultTemplate = {
      id: '',
      name: 'Select Queue View Template',
    };
    this.AgentTemplateForm = formBuilder.group({
      template: [null, [Validators.required]],
      queues: ['', [Validators.required]],
    });
    this.showHintMessage = false;
  }

  public BindHintMessage(){
    this.showHintMessage = true;
  }

  AddAgentTemplate(): void {
    this.OnAddTemplate.emit(this.AgentTemplateForm);
    this.showHintMessage = false;
  }

  DeleteTemplate(templateCode: string): void {
    this.OnDeleteTemplate.emit(templateCode);
  }

  UpdateTemplate(template: IAgentTemplate): void {
    this.AgentTemplateForm.patchValue(template);
    this.TemplateChanged({id:template.templateCode,name:template.templateName},false);
    this.OnUpdateTemplate.emit(template.templateCode);
  };
  GenerateCSVStringForService(queues: Array<IAgentQueueDropdownList>): string {
    const csvString = queues.map((x) => x.queueName).join(', ');
    return csvString;
  }

  TemplateChanged(template: IAgentDropdown, resetQueueData:boolean): void {
    let workFlowId = null;
    if (template.id == '') {
      this.showHintMessage = false;
    }

    if (template.id !== this.DefaultTemplate.id) {
      workFlowId = this.AgentTemplateDropdownList
        .find(agentTemplate => agentTemplate.id === template.id).workflowId;
    }
    this.OnTemplateChange.emit(workFlowId);
    if(resetQueueData){
      this.AgentTemplateForm.get('queues').setValue('');
    }
    this.AgentTemplateForm
      .get('template')
      .setValue(template.id ? template : null);
  }
}
