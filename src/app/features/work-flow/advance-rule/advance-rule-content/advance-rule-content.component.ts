import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { GroupResult } from '@progress/kendo-data-query';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IAddUserRole } from 'src/app/models/common/user-role/add-user-role';
import { ActionAndAlertActionsDropDownList, ActionRule, ActionType } from 'src/app/models/constants/action-alert-constant';
import { Mode } from 'src/app/models/enums/mode.enum';
import { WorkflowValidationMessage } from 'src/app/models/validation-message/workflow-message';
import { Routing } from '../../../appointment-scheduler/models/work-flow-detail.interface';
import { AdvanceWorkflowType, RuleOperationType } from '../../enums/request-document-type';
import { ConditionVariable } from '../../models/conditional-events';
import { SupportedLanguage } from '../../models/supported-language';
import { Group, Queue } from '../../models/work-flow-response.interface';
import { AdvanceWorkflowRuleService } from '../advance-workflow-rule.service';

@Component({
  selector: 'lavi-advance-rule-content',
  templateUrl: './advance-rule-content.component.html',
  styleUrls: ['./advance-rule-content.component.scss', './../../work-flow-configuration/work-flow-configuration.component.scss']
})
export class AdvanceRuleContentComponent extends AbstractComponent {

  @Input() OpenRuleDialog: boolean;
  @Input() DynamicVariablesList: ConditionVariable
  @Input() ConditionVariables: GroupResult[];
  @Input() Triggers: ConditionVariable;
  @Input() AdvanceRuleForm: FormGroup;
  @Input() ConditionFormArray: FormArray;
  @Input() ActionFormArray: FormArray;
  @Input() Groups: Group[]
  @Input() Routings: GroupResult[];
  @Input() LanguageSupported: SupportedLanguage[];
  @Output() Save: EventEmitter<any> = new EventEmitter();
  @Output() Cancel: EventEmitter<any> = new EventEmitter();

  AllRolesList:IAddUserRole[];
  ModeEnum = Mode;
  ActionType = ActionType;
  ActionRule = ActionRule;
  WorkflowMessage = WorkflowValidationMessage;
  AdvanceWorkflowType = AdvanceWorkflowType;
  RuleOperationType = RuleOperationType;
 
  NoQueueRouting = {
    id: 'NoQueue',
    type: Routing.NoQueue,
    group: Routing.NoQueue
  };

  get NotDeletedGroups() :Group[]{
    return this.service?.Groups?.filter(x=>!x.isDeleted);
  }

  get Actions() {
    if (this.AdvanceRuleForm.value.type == AdvanceWorkflowType[0].value) {
      return ActionAndAlertActionsDropDownList.filter(x => x.type == ActionType.Route);
    } else {
      return ActionAndAlertActionsDropDownList.filter(x => x.type != ActionType.Route);
    }
  }
  get NotDeletedQueue() :Queue[]{
    return this.service?.Queues?.filter(x=>!x.isDeleted);
  }

  get WhenVariablesList(): ConditionVariable[] | any {
    if (AdvanceWorkflowType[0].value == this.AdvanceRuleForm?.controls?.type?.value) {
      return this.QuestionSet;
    } else {
      return this.Triggers;
    }
  }

  get QuestionSet() {
    return this.service?.QuestionSet;
  }

  get Mode(){
    return this.service.Mode
  }


  findChoices = (searchText: string) => {
    return this.service.findChoices(searchText);
  };

  getChoiceLabel = (choice: string) => {
    return this.service.getChoiceLabel(choice);
  }

  constructor(private service: AdvanceWorkflowRuleService) {
    super();
    this.subs.sink = this.service.AllRolesList$
    .subscribe((response) => {
      this.AllRolesList = response;
    });
  }

  ngOnInit(): void {
    this.service.PushQueueAndQuestionSetInRoutingSubject();
  }

  ngOnChanges() {
    if (!this.AdvanceRuleForm.value.type) {
      this.AdvanceRuleForm.controls.type.setValue(AdvanceWorkflowType[0].value);
    }
    if (!this.AdvanceRuleForm.value.when) {
      this.AdvanceRuleForm.controls.when.setValue((this.WhenVariablesList && this.WhenVariablesList[0]) ? this.WhenVariablesList[0] : null);
    }
   
  }

  AddCondition() {
    this.service.AddNewCondition()
  }

  AddSubCondition(conditionArray: FormArray) {
    this.service.AddSubCondition(conditionArray)
  }

  GenerateResponse(data: FormGroup, conditionArray: FormArray, index: number, parentIndex: number) {
    return {
      showAddCondition: ((conditionArray.length - 1) == index),
      index: index,
      conditions: conditionArray,
      condition: data,
      parentIndex: parentIndex
    }
  }

  showAddCondition(data: any, index: number) {
    let fa = data.controls.conditions as FormArray

    return {
      showAddCondition: fa.length == 1,
      conditions: fa,
      parentIndex: index
    }
  }

  ChangeRuleType(type: string) {
    this.service.ChangeRuleType(type)
  }

  ChangeOperationType(type: string, conditionFormGroup: FormGroup) {
    this.service.ChangeOperationType(type, conditionFormGroup)
  }

  RemoveConditionGroup(index: number) {
    this.service.RemoveConditionGroup(index)
  }

  AddNewActions() {
    this.service.AddNewAction()
  }

  RemoveAction(index: number) {
    this.service.RemoveAction(index)
  }

  ActionTemplateResponse(act: FormGroup) {
    return {
      action: act
    }
  }

  TemplateArray(templateArray: FormArray) {
    return {
      templates: templateArray
    }
  }

  SaveRule() {
    this.Save.emit()
  }

  CloseModal() {
    this.Cancel.emit()
  }

  translate(text: string, formarray: FormArray, templatePropertyName?: string, EmailSubject?: string, subjectControlName?: string) {
    this.service.translate(text, formarray, templatePropertyName, EmailSubject, subjectControlName);
  }

  NoTemplateSelected(formArray: FormArray) {
    return !(formArray.controls.some(x => x['selected']))
  }

  ShowSelectedLanguageTemplate(value: FormGroup, formArray: FormArray) {
    formArray.controls.forEach(x => {
      x['selected'] = false;
    })
    value['selected'] = true;
  }

  ClearAllConditions() {
    this.ConditionFormArray.clear();
    this.ConditionFormArray.reset();
  }

  ClearAllActions() {
    this.ActionFormArray.clear();
    this.ActionFormArray.reset();
  }

  compareFn(variable1, variable2) {
    return variable1 && variable2 && variable1?.id == variable2?.id;
  }

  compareFnAction(variable1, variable2) {
    return variable1 && variable2 && variable1.text == variable2.text;
  }

  roleCompareFunction(variable1, variable2) {
    return variable1 && variable2 && variable1 == variable2;
  }
}
