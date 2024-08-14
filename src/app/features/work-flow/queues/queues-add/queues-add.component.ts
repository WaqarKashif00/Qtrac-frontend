import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { WorkflowValidationMessage } from 'src/app/models/validation-message/workflow-message';
import { QueuesService } from '../queues.service';

@Component({
  selector: 'lavi-queues-add',
  templateUrl: './queues-add.component.html',
  styleUrls:['./queues-add.component.scss']
})
export class QueuesAddComponent extends AbstractComponent {

  @Input() OpenQueueDialog: boolean;
  @Input() Mode: string;
  @Input() HideNumberingFormat: boolean;
  @Output() SaveForm: EventEmitter<FormGroup> = new EventEmitter();
  @Output() Close: EventEmitter<void> = new EventEmitter();

  get AddQueuesForm() {
    return this.queuesService.AddQueueForm;
  }
  get MiddlefixNumberFormat(){
    return this.AddQueuesForm.get('numberingRule.middlefix').value;
  }
  WorkflowMessage = WorkflowValidationMessage;
  constructor(private queuesService: QueuesService) {
    super();
  }

  public SaveQueue() {
    this.SaveForm.emit(this.AddQueuesForm);
  }
  Cancel() {
    this.Close.emit();
  }

  ngOnChanges(param){

    const numberingRulePrefixFormControl = this.AddQueuesForm.get('numberingRule.prefix');
    const numberingRulePostFixFormControl = this.AddQueuesForm.get('numberingRule.postfix');

    if(param.HideNumberingFormat){
      if (param.HideNumberingFormat?.currentValue) {
        numberingRulePrefixFormControl.enable();
        numberingRulePostFixFormControl.enable();
        numberingRulePrefixFormControl.setValidators(Validators.required);
      } else {
        numberingRulePrefixFormControl.setValidators(null);
        numberingRulePrefixFormControl.disable();
        numberingRulePostFixFormControl.disable();
      }
    }
  }
}
