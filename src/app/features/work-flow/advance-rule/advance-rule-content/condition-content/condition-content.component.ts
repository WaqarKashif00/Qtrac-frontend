import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { groupBy } from "@progress/kendo-data-query";
import { of } from "rxjs";
import { AbstractComponent } from "src/app/base/abstract-component";
import { PreServiceQuestion } from "src/app/models/common/work-flow-detail.interface";
import { DynamicFieldIds, NumberTimeMagnitude, TextDynamicFieldForDropdown, TimeInNumberDynamicField } from "src/app/models/constants/dynamic-field.constants";
import { Validations } from "src/app/models/constants/validation.constant";
import { QuestionType } from "src/app/models/enums/question-type.enum";
import { WorkflowValidationMessage } from "src/app/models/validation-message/workflow-message";
import { Operators } from "../../../operators-on-type-selection";
import { ConditionContentService } from "./condition-content.service";

@Component({
  selector: 'condition-content',
  templateUrl: './condition-content.component.html',
  styleUrls: ['./condition-content.component.scss', './../advance-rule-content.component.scss', './../../../work-flow-configuration/work-flow-configuration.component.scss'],
  providers: [ConditionContentService]
})
export class ConditionContentComponent extends AbstractComponent {
  @Input() ConditionVariables;
  @Input() DynamicVariablesList;
  @Input() ShowAddCondition: boolean;
  @Input() ConditionForm: FormGroup;
  @Output() AddCondition: EventEmitter<any> = new EventEmitter();
  @Input() Index: number;
  @Input() ParentIndex: number;

  WorkflowMessage = WorkflowValidationMessage;
  DynamicField = TextDynamicFieldForDropdown;
  TimeDynamicField = TimeInNumberDynamicField;
  questionType = QuestionType;
  Validation = Validations;
  operatorEnum = Operators;

  get ConditionVar() {
    return groupBy(this.ConditionVariables, [{ field: 'type' }]);
  }

  get Operator() {
    if (this.ConditionForm?.value?.condition && this.ConditionForm.value.condition.id) {
      if(this.ConditionForm?.value?.condition?.id == DynamicFieldIds.serviceNameId || this.ConditionForm?.value?.condition?.id == DynamicFieldIds.queueNameId
        || this.ConditionForm?.value?.condition?.id == DynamicFieldIds.groupNameId || this.ConditionForm?.value?.condition?.id == DynamicFieldIds.workflowNameId
        || this.ConditionForm?.value?.condition?.id == DynamicFieldIds.locationNameId || this.ConditionForm?.value?.condition?.id == DynamicFieldIds.supportedLanguageId) {
          return this.conditionContentService.ChangeOperator(this.ConditionForm.value.condition.data_type,this.ConditionForm?.value?.condition?.id);
        }
      return this.conditionContentService.ChangeOperator(this.ConditionForm.value.condition.data_type);
    }
    return [];
  }

  get Services() {
    return this.conditionContentService.Services;
  }

  get Queues() {
    return this.conditionContentService.Queues
  }

  get Groups() {
    return this.conditionContentService.Groups
  }

  get Workflows() {
    return this.conditionContentService.workflows
  }

  get Locations() {
    return this.conditionContentService.Branches
  }
  get SelectedLanguage() {
    return this.conditionContentService.SelectedLanguage
  }

  get CheckTextControlVisibility() {
    return !(this.DynamicField.some(x => x.id == this.ConditionForm?.value?.condition?.id))
  }


  get showMinuteLabel() {
    return this?.TimeDynamicField?.some(x => x.id == this.ConditionForm?.value?.condition?.id) ? NumberTimeMagnitude : '';
  }

  get dropdownSettings() {
    return {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: true,
      limitSelection: 10
    };
  }

  constructor(private conditionContentService: ConditionContentService) {
    super();
  }

  AddSubCondition() {
    this.AddCondition.emit()
  }

  RemoveIndividualCondition() {
    this.conditionContentService.RemoveIndividualCondition(this.Index, this.ParentIndex)
  }

  DropdownData() {
    
    if (this.ConditionForm?.value?.condition?.id == DynamicFieldIds.serviceNameId) {
      return of(this.Services);
    }
    if (this.ConditionForm?.value?.condition?.id == DynamicFieldIds.queueNameId) {
      return of(this.Queues);
    }
    if (this.ConditionForm?.value?.condition?.id == DynamicFieldIds.groupNameId) {
      return this.Groups;
    }
    if (this.ConditionForm?.value?.condition?.id == DynamicFieldIds.workflowNameId) {
      return this.Workflows;
    }
    if (this.ConditionForm?.value?.condition?.id == DynamicFieldIds.locationNameId) {
      return this.Locations;
    }
    if (this.ConditionForm?.value?.condition?.id == DynamicFieldIds.supportedLanguageId) {
      this.ConditionForm.controls.value.clearValidators()
      this.ConditionForm.controls.value.addValidators(Validators.required);
      return this.SelectedLanguage;
    }
    let question: PreServiceQuestion = this.conditionContentService.IsConditionMultiValueType(this.ConditionForm.value.condition)
    if (question) {
      return this.MultiValuedData(question);
    }
  }

  compareFn(variable1, variable2) {
    return variable1 && variable2 && variable1.id == variable2.id;
  }

  compareOperatorFn(variable1, variable2) {
    return variable1 && variable2 && variable1.text == variable2.text;
  }


  private MultiValuedData(question: PreServiceQuestion) {
    let data = question?.typeSetting?.map(typesetting => {
      return typesetting?.find(option => option.isDefault).option
    })
    return of(data);
  }

}