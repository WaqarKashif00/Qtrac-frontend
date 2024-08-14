import { Component, Input } from '@angular/core';
import { GroupResult } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IAddUserRole } from 'src/app/models/common/user-role/add-user-role';
import { AdvanceRules } from '../models/advance-workflow-rules.interface';
import { Group } from '../models/work-flow-response.interface';
import { AdvanceWorkflowRuleService } from './advance-workflow-rule.service';

@Component({
  selector: 'lavi-advance-rule',
  templateUrl: './advance-rule.component.html',
  styleUrls: ['./advance-rule.component.scss'],
  providers: [AdvanceWorkflowRuleService]
})
export class AdvanceRuleComponent extends AbstractComponent {

  @Input() OpenAddModal: boolean;
  Groups$: Observable<Group[]>
  Routings$: Observable<GroupResult[]>
  AdvanceWorkflowList$: Observable<AdvanceRules[]>;
  AdvanceRuleModelOpen$: Observable<boolean>;
  AllRolesList$: Observable<IAddUserRole[]>;
  get DynamicVariablesList() {
    return this.advanceRuleService.DynamicVariablesList;
  }

  get ConditionVariableList() {
    return this.advanceRuleService.ConditionVariableList;
  }

  get Triggers() {
    return this.advanceRuleService.Triggers;
  }

  get AdvanceRuleForm() {
    return this.advanceRuleService.AdvanceRuleForm;
  }

  get ConditionFormArray() {
    return this.advanceRuleService.ConditionFormArray;
  }

  get ActionFormArray() {
    return this.advanceRuleService.ActionFormArray;
  }

  get SupportedLanguages() {
    return this.advanceRuleService.SupportedLanguages;
  }

  get QuestionSet() {
    return this.advanceRuleService.QuestionSet
  }

  constructor(private advanceRuleService: AdvanceWorkflowRuleService) {
    super();
  }

  ngOnInit(): void {
    this.Groups$ = this.advanceRuleService.Groups$
    this.Routings$ = this.advanceRuleService.Routings$
    this.AdvanceWorkflowList$ = this.advanceRuleService.AdvanceWorkflowList$
    this.AdvanceRuleModelOpen$ = this.advanceRuleService.AdvanceRuleModelOpen$
    this.AllRolesList$ = this.advanceRuleService.AllRolesList$
  }

  OpenAddRulesModal() {
    this.advanceRuleService.OpenAdvanceRuleModal()
  }

  CloseAddRuleModal() {
    this.advanceRuleService.CloseAdvanceRuleModal()
  }

  SaveRule() {
    this.advanceRuleService.Save()
  }

}
