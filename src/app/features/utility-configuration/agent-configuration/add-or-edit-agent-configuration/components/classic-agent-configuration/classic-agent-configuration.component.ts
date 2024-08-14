import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IDropdownList } from 'src/app/models/common/dropdown-list.interface';
import { DefaultAgentConfigValues } from 'src/app/models/constants/agent-configuration.constants';
import { AgentConfigurationMessages } from 'src/app/models/validation-message/agent-configuration';

@Component({
  selector: 'lavi-agent-classic-configuration',
  templateUrl: './classic-agent-configuration.component.html',
})
export class AgentClassicConfigurationComponent extends AbstractComponent {
  @Input() TimeFormat: IDropdownList[];
  @Input() TimeInQueue: IDropdownList[];
  @Input() ClassicConfigForm: FormGroup;

  @Output() OnChangeOfAllowSmsCheckbox = new EventEmitter();
  @Output() OnChangeOfAllowGroupCheckbox = new EventEmitter();
  @Output() OnChangeOfCustomerTabUrlCheckbox = new EventEmitter();

  public DefaultValues = DefaultAgentConfigValues;
  public ValidationMessages = AgentConfigurationMessages;

  Init() {
    // Inherited from AbstractComponent to initialize component life cycle
  }

  Destroy(){
    // Inherited from AbstractComponent to destroy component life cycle
  }

  public ResetAllowSmsCheckbox(){
    this.OnChangeOfAllowSmsCheckbox.emit();
  }

  public ResetAllowGroupCheckbox(){
    this.OnChangeOfAllowGroupCheckbox.emit();
  }


  public OnChangeCustomerUrlCheckbox(){
    this.OnChangeOfCustomerTabUrlCheckbox.emit();
  }

}
