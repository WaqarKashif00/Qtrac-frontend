import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IDropdownList } from 'src/app/models/common/dropdown-list.interface';
import { DefaultAgentConfigValues } from 'src/app/models/constants/agent-configuration.constants';
import { AgentConfigurationMessages } from 'src/app/models/validation-message/agent-configuration';

@Component({
  selector: 'lavi-agent-lite-configuration',
  templateUrl: './lite-agent-configuration.component.html',
})
export class AgentLiteConfigurationComponent extends AbstractComponent {
  @Input() TimeFormat: IDropdownList[];
  @Input() LiteConfigForm: FormGroup;

  public DefaultValues = DefaultAgentConfigValues;
  public ValidationMessages = AgentConfigurationMessages;

  Init() {
    // Inherited from AbstractComponent to initialize component life cycle
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }
}
