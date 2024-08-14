import { ChangeDetectorRef, Injectable } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { GroupResult } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { TranslateService } from 'src/app/core/services/translate.service';
import { cloneObject } from 'src/app/core/utilities/core-utilities';
import { IAddUserRole } from 'src/app/models/common/user-role/add-user-role';
import {
  ActionType,
  IActionAlertRuleActions,
} from 'src/app/models/constants/action-alert-constant';
import { Validations } from 'src/app/models/constants/validation.constant';
import { Mode } from 'src/app/models/enums/mode.enum';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { AdvanceWorkflowType } from '../enums/request-document-type';
import { WorkflowMessages } from '../message-constant';
import {
  ActionAlertRuleActions,
  AdvanceRules,
  DynamicVariable,
  ICondition,
  IConditionArray,
  ISMSAndEmailAndAnnouncementTemplate,
  Operator,
} from '../models/advance-workflow-rules.interface';
import { variable_type } from '../models/conditional-events';
import { SupportedLanguage } from '../models/supported-language';
import { Queue } from '../models/work-flow-request.interface';
import { Group } from '../models/work-flow-response.interface';
import { operatorsValue, TypeOfBoolean } from '../operators-on-type-selection';
import { WorkFlowService } from '../work-flow.service';

@Injectable()
export class AdvanceWorkflowRuleService extends AbstractComponentService {
  AdvanceRuleCopyCount: number;
  Mode = Mode.Add;
  Groups$: Observable<Group[]>;
  Queues$: Observable<Queue[]>;
  Routings$: Observable<GroupResult[]>;
  AdvanceWorkflowList$: Observable<AdvanceRules[]>;
  AdvanceRuleModelOpen$: Observable<boolean>;
  AllRolesList$: Observable<IAddUserRole[]>;
  OperatorsSubject: BehaviorSubject<Operator[]>;
  Operators: Observable<Operator[]>;
  ConditionVariableList: DynamicVariable[];
  Triggers: DynamicVariable[];
  ConditionsNameGrouped$: Observable<GroupResult[]>;
  ConditionsNameGroupedSubject$: BehaviorSubject<GroupResult[]>;
  AdvanceRuleForm: FormGroup;
  ConditionFormArray: FormArray;
  ActionFormArray: FormArray;
  SupportedLanguages: SupportedLanguage[];
  IsAdditionalLanguage: boolean;
  Groups: Group[];
  Queues:Queue[];


  get DynamicVariablesList() {
    return this.workFlowService.DynamicVariablesList;
  }

  get QuestionSet() {
    return this.workFlowService?.QuestionSetsSubject?.value
      ?.filter((x: any) => !x.isDeleted)?.map((x) => {
        return {
          id: x.id,
          shortName: x.questionSetName,
          type: variable_type.questionSet,
        };
      });
  }

  constructor(
    private workFlowService: WorkFlowService,
    private translateService: TranslateService,
    private changesDetect: ChangeDetectorRef
  ) {
    super();
    this.Init();
  }
  getChoiceLabel(choice: string) {
    return this.workFlowService.getChoiceLabel(choice);
  }
  findChoices(searchText: string) {
    return this.workFlowService.findChoices(searchText);
  }

  ChangeOperationType(type: string, conditionFormGroup: FormGroup) {
    conditionFormGroup.controls?.type.setValue(type);
  }

  ChangeRuleType(type: string) {
    if (type != this.AdvanceRuleForm.controls?.type.value) {
      this.AdvanceRuleForm.controls?.type.setValue(type);
      this.ActionFormArray?.clear();
      this.ActionFormArray?.reset();
      this.ActionFormArray?.updateValueAndValidity();

      this.AdvanceRuleForm.controls?.type.setValue(type);
      this.ConditionFormArray?.clear();
      this.ConditionFormArray?.reset();
      this.ConditionFormArray?.updateValueAndValidity();
      if (
        AdvanceWorkflowType[0].value ==
        this.AdvanceRuleForm?.controls?.type?.value
      ) {
        this.AdvanceRuleForm.controls?.when.setValue(this.QuestionSet[0]);
      } else {
        this.AdvanceRuleForm.controls.when.setValue(this.Triggers[0]);
      }
    }
  }

  AddSubCondition(conditionArray: FormArray, condition?: ICondition) {
    let conditionForm = this.formBuilder.group({
      type: ['and', Validators.required],
      condition: [null, Validators.required],
      operator: [null, Validators.required],
      value: [null, Validators.required],
    });
    conditionArray.push(conditionForm);
    this.OnTypeChange(conditionForm);
    this.OnOperatorChange(conditionForm);
    if (condition) {
      conditionForm.controls?.type.setValue(condition?.type);
      conditionForm.controls.condition.setValue(condition.condition);
      conditionForm.controls.operator.setValue(condition.operator);
      conditionForm.controls.value.setValue(condition.value);
    }
  }

  AddNewCondition(condition?: IConditionArray) {
    let conditionArray = this.formBuilder.array([]);
    let conditionForm = this.formBuilder.group({
      type: ['and', Validators.required],
      condition: [null, Validators.required],
      operator: [null, Validators.required],
      value: [null, Validators.required],
    });
    conditionArray.push(conditionForm);
    let subRootCondition = this.formBuilder.group({
      type: ['and'],
      conditions: conditionArray,
    });
    this.ConditionFormArray.push(subRootCondition);
    this.ConditionFormArray.markAsDirty();
    this.ConditionFormArray.markAsTouched();
    this.OnTypeChange(conditionForm);
    this.OnOperatorChange(conditionForm);
    if (condition) {
      subRootCondition.controls?.type.setValue(condition?.type);
    }
    if (condition?.conditions && condition?.conditions[0]) {
      conditionForm.controls?.type.setValue(condition?.conditions[0]?.type);
      conditionForm.controls.condition.setValue(
        condition?.conditions[0].condition
      );
      conditionForm.controls.operator.setValue(
        condition?.conditions[0].operator
      );
      conditionForm.controls.value.setValue(condition?.conditions[0].value);
    }
    return conditionArray;
  }

  AddNewAction(action?: ActionAlertRuleActions) {
    let TemplateArray = this.formBuilder.array([]);

    let ActionForm = this.formBuilder.group({
      id: [null],
      action: [null, Validators.required],
      templates: TemplateArray,
      alert: [null],
      group: [null],
      position: [null],
      roleId: [null],
      color: [null],
      routing: [null],
      priority: [null],
      reportingEventaname: [null],
      routetoqueue: [null],
    });
    this.ActionFormArray.push(ActionForm);
    this.OnActionChange(ActionForm, TemplateArray, null);
    if (action) {
      ActionForm.controls.id.setValue(action.id);
      ActionForm.controls.action.setValue(action.action);
      ActionForm.controls.color.setValue(action.color);
      ActionForm.controls.alert.setValue(action.alert);
      ActionForm.controls.group.setValue(action.group);
      ActionForm.controls.position.setValue(action.position);
      ActionForm.controls.roleId.setValue(action?.roleId);
      ActionForm.controls.routing.setValue(action.routing);
      ActionForm.controls.priority.setValue(action?.priority);
      ActionForm.controls.reportingEventaname.setValue(action?.reportingEventaname);
      ActionForm.controls.routetoqueue.setValue(action?.routetoqueue);
      if (action?.templates && action?.templates[0]) {
        this.setTemplatesFormArray(
          this.AdvanceRuleForm,
          TemplateArray,
          this.setTemplatesArray(action?.templates)
        );
      }
    }
    this.ActionFormArray.markAsTouched();
    this.ActionFormArray.markAsDirty();
  }

  RemoveConditionGroup(index: number) {
    this.ConditionFormArray.controls.splice(index, 1);
    this.ConditionFormArray.updateValueAndValidity();
  }

  RemoveIndividualCondition(Index: number, ParentIndex: number) {
    let ParentCondition = this.ConditionFormArray.controls[
      ParentIndex
    ] as FormGroup;
    let ConditionsArray = ParentCondition.controls.conditions as FormArray;
    ConditionsArray.controls.splice(Index, 1);
    ConditionsArray.updateValueAndValidity();
    if (ConditionsArray.controls.length == 0) {
      this.ConditionFormArray.controls.splice(ParentIndex, 1);
    }
    this.ConditionFormArray.updateValueAndValidity();
  }

  CreateCopyOfAdvanceRule(dataItem: AdvanceRules) {
    this.AdvanceRuleCopyCount = 0;
    const CopyActionAlert: AdvanceRules = {
      id: this.uuid,
      name: dataItem.name,
      isDeleted: false,
      type: dataItem?.type,
      conditions: dataItem.conditions,
      actions:
        dataItem.actions &&
        dataItem.actions.map<ActionAlertRuleActions>((x) => {
          x.id = this.uuid;
          return x;
        }),
      when: dataItem.when,
    };
    this.IsAdvanceRuleCopyExist(CopyActionAlert.name);
    for (let i = 1; i < this.AdvanceRuleCopyCount; i++) {
      CopyActionAlert.name += WorkflowMessages.CopyPostFixMessage;
    }
    this.AddActionAlertInWorkflowList(CopyActionAlert);
  }

  OpenEditModal(dataItem: AdvanceRules) {
    this.SetFormData(dataItem);
    this.workFlowService.AdvanceRuleModelOpenSubject.next(true);
    this.Mode = Mode.Edit;
    this.changesDetect.detectChanges();
  }

  DeleteAdvanceRule(id: string) {
    let DeleteIndex =
      this.workFlowService.AdvanceWorkflowListSubject.value.findIndex(
        (x) => x.id == id
      );
    if (DeleteIndex >= 0) {
      this.workFlowService.AdvanceWorkflowListSubject.value[
        DeleteIndex
      ].isDeleted = true;
      this.workFlowService.AdvanceWorkflowListSubject.next(
        cloneObject(this.workFlowService.AdvanceWorkflowListSubject.value)
      );
    }
  }

  AddActionAlertInWorkflowList(response: AdvanceRules) {
    const data = this.workFlowService.AdvanceWorkflowListSubject.value;
    data.push(response);
    this.workFlowService.AdvanceWorkflowListSubject.next(cloneObject(data));
  }

  OpenAdvanceRuleModal() {
    this.AdvanceRuleForm.reset();
    this.SetFormData(this.GetDefaultFormData());
    this.workFlowService.OpenAdvanceRuleModal();
    this.Mode = Mode.Add;
  }

  SetFormData(dataItem: AdvanceRules) {
    this.AdvanceRuleForm.controls.name?.setValue(dataItem.name);
    this.AdvanceRuleForm.controls.id?.setValue(dataItem.id);
    this.AdvanceRuleForm.controls?.type?.setValue(dataItem?.type);
    this.AdvanceRuleForm.controls.when?.setValue(dataItem.when);

    let ConditionArray = this.AdvanceRuleForm.controls.conditions as FormArray;
    ConditionArray?.clear();
    dataItem?.conditions?.forEach((condition) => {
      let conditionFormArray = this.AddNewCondition(condition);
      condition?.conditions.forEach((subCondition, index) => {
        if (index > 0) {
          this.AddSubCondition(conditionFormArray, subCondition);
        }
      });
    });

    let ActionArray = this.AdvanceRuleForm.controls.actions as FormArray;
    ActionArray?.clear();
    dataItem?.actions.forEach((action) => {
      this.AddNewAction(action);
    });
  }

  CloseAdvanceRuleModal() {
    this.SetFormData(this.GetDefaultFormData());
    this.workFlowService.CloseAdvanceRuleModal();
  }

  RemoveAction(index: number) {
    this.ActionFormArray.controls.splice(index, 1);
    this.ActionFormArray.updateValueAndValidity();
  }

  Save() {
    if (
      this.AdvanceRuleForm.controls?.type.value == AdvanceWorkflowType[1].value
    ) {
      this.AdvanceRuleForm.controls.conditions.clearValidators();
      this.AdvanceRuleForm.controls.conditions.updateValueAndValidity();
    } else {
      this.AdvanceRuleForm.controls.conditions.setValidators(
        Validators.required
      );
      this.AdvanceRuleForm.controls.conditions.updateValueAndValidity();
    }
    this.ActionFormArray.markAsDirty();
    this.ConditionFormArray.markAsDirty();
    this.formService
      .CallFormMethod(this.AdvanceRuleForm, true)
      .then((x) => {
        if (this.Mode == Mode.Add) {
          this.workFlowService.AddAdvanceRuleInList(this.AdvanceRuleForm.value);
        }
        if (this.Mode == Mode.Edit) {
          this.workFlowService.UpdateAdvanceRuleInList(
            this.AdvanceRuleForm.value
          );
        }
      })
      .catch((x) => {
        this.ActionFormArray.controls.forEach((form: FormGroup) => {
          if (
            form.invalid &&
            (form.controls.action.value?.type == ActionType.Email ||
              form.controls.action.value?.type == ActionType.SMS)
          ) {
            let templateArray = form.controls.templates as FormArray;
            templateArray.controls.forEach((templateForm: FormGroup) => {
              templateForm.markAsDirty();
            });
            let defaultTemplate = templateArray.controls.find(
              (x) => x.value.isDefault
            );
            if (!defaultTemplate.invalid && templateArray.invalid) {
              templateArray.setErrors({ notTranslated: true });
            }
          }
        });
      });
  }

  PushQueueAndQuestionSetInRoutingSubject() {
    this.workFlowService.PushQueueAndQuestionSetInRoutingSubject();
  }

  translate(
    text: string,
    formarray: FormArray,
    templatePropertyName?: string,
    EmailSubject?: string,
    subjectControlName?: string
  ) {
    formarray.updateValueAndValidity();
    let ruleDocumentRequest = this.workFlowService.GetRequestDocument(
      this.workFlowService.WorkFlow,
      true
    );

    if (text) {
      this.subs.sink = this.translateService
        .GetTranslatedTexts(text, ruleDocumentRequest)
        .subscribe((TranslateResponses) => {
          if (TranslateResponses && TranslateResponses.length !== 0) {
            // tslint:disable-next-line: prefer-for-of
            for (let index = 0; index < TranslateResponses.length; index++) {
              const TranslateRes = TranslateResponses[index];
              // tslint:disable-next-line: prefer-for-of
              for (let ind = 0; ind < formarray.length; ind++) {
                const formgroup = formarray.controls[ind] as FormGroup;
                if (
                  ind !== 0 &&
                  TranslateRes.languageId ===
                    formgroup.get('languageCode').value
                ) {
                  formgroup
                    .get(templatePropertyName)
                    .setValue(TranslateRes.translatedText);
                }
              }
            }
          }
        });
    }

    if (EmailSubject) {
      this.subs.sink = this.translateService
        .GetTranslatedTexts(EmailSubject, ruleDocumentRequest)
        .subscribe((TranslateResponses) => {
          if (TranslateResponses && TranslateResponses.length !== 0) {
            // tslint:disable-next-line: prefer-for-of
            for (let index = 0; index < TranslateResponses.length; index++) {
              const TranslateRes = TranslateResponses[index];
              // tslint:disable-next-line: prefer-for-of
              for (let ind = 0; ind < formarray.length; ind++) {
                const formgroup = formarray.controls[ind] as FormGroup;
                if (
                  ind !== 0 &&
                  TranslateRes.languageId ===
                    formgroup.get('languageCode').value
                ) {
                  formgroup
                    .get(subjectControlName)
                    .setValue(TranslateRes.translatedText);
                }
              }
            }
          }
        });
    }
  }

  private Init() {

    this.Groups$ = this.workFlowService.Groups$;
    this.Queues$ = this.workFlowService.Queues$;
    this.Groups$.subscribe((x) => {
      this.Groups = x;
    });
    this.Queues$.subscribe((x) => {
      this.Queues = x;
    });
    this.Routings$ = this.workFlowService.Routings$;
    this.AllRolesList$ = this.workFlowService.AllRolesList$;
    this.AdvanceWorkflowList$ = this.workFlowService.AdvanceWorkflowList$;
    this.AdvanceRuleModelOpen$ = this.workFlowService.AdvanceRuleModelOpen$;

    this.subs.sink = this.workFlowService.SupportedLanguages$.subscribe(
      (supportedLanguages) => {
        this.SupportedLanguages = supportedLanguages;
        if (supportedLanguages.length > 1) {
          this.IsAdditionalLanguage = true;
        }
        this.InitForm();
        this.ConditionsNameGroupedSubject$ = new BehaviorSubject<GroupResult[]>(
          []
        );
        this.ConditionsNameGrouped$ =
          this.ConditionsNameGroupedSubject$.asObservable();

        this.workFlowService
          .GetConditionalRoutingVariables()
          .subscribe((x: any[]) => {
            this.ConditionVariableList = x.map((x) => {
              return {
                data_type: x.data_type,
                fieldName: x.shortName,
                id: x.id,
                shortName: x.friendlyName,
                type: x?.type,
              };
            });
          });
      }
    );
  }

  private InitForm() {
    this.ConditionFormArray = this.formBuilder.array([], Validators.required);
    this.ActionFormArray = this.formBuilder.array([], Validators.required);
    this.AdvanceRuleForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      type: [null, Validators.required],
      when: [null, Validators.required],
      conditions: this.ConditionFormArray,
      actions: this.ActionFormArray,
    });

    this.AdvanceRuleForm.controls?.type.valueChanges.subscribe((x) => {
      if (x == AdvanceWorkflowType[0].value) {
        this.workFlowService
          .GetConditionalRoutingVariables()
          .subscribe((x: any[]) => {
            this.ConditionVariableList = x.map((x) => {
              return {
                data_type: x.data_type,
                fieldName: x.shortName,
                id: x.id,
                shortName: x.friendlyName,
                type: x?.type,
              };
            });
          });
      } else {
        this.workFlowService
          .GetAlertConditionalVariables()
          .subscribe((x: any[]) => {
            this.ConditionVariableList = x.map((x) => {
              return {
                data_type: x.data_type,
                fieldName: x.shortName,
                id: x.id,
                shortName: x.friendlyName,
                type: x?.type,
              };
            });
            this.Triggers = this.ConditionVariableList.filter(
              (x) => x?.type == variable_type.trigger
            );
          });
      }
    });
  }

  private setTemplatesFormArray(
    addEditActionForm: FormGroup,
    templateArray: FormArray,
    templates: ISMSAndEmailAndAnnouncementTemplate[]
  ) {
    templateArray.clear();
    let templatesWithAllLanguage = this.setTemplatesArray(templates);

    templatesWithAllLanguage?.forEach((x: ISMSAndEmailAndAnnouncementTemplate) => {
      let formGroup = this.formBuilder.group({
        language: [x.language, Validators.required],
        languageCode: [x.languageCode, Validators.required],
        isDefault: [x.isDefault, Validators.required],
        subject: [
          x.subject,
          addEditActionForm?.controls?.action?.value?.type == ActionType.Email
            ? Validators.required
            : null,
        ],
        template: [x.template, Validators.required],
      });
      formGroup['selected'] = x.isDefault ? true : false;
      templateArray.push(formGroup);
    });
  }

  private setTemplatesArray(
    template: ISMSAndEmailAndAnnouncementTemplate[]
  ): ISMSAndEmailAndAnnouncementTemplate[] {
    let SMSEmailTemplateArray: ISMSAndEmailAndAnnouncementTemplate[] = [];
    this.SupportedLanguages.forEach((x) => {
      SMSEmailTemplateArray.push({
        language: x.language,
        languageCode: x.languageCode,
        subject: null,
        template: null,
        isDefault: x.isDefault,
      });
    });

    SMSEmailTemplateArray.forEach((x) => {
      let templateData = template?.find(
        (y) => y.languageCode == x.languageCode
      );
      x.subject = templateData?.subject;
      x.template = templateData?.template;
    });

    return SMSEmailTemplateArray;
  }

  private OnActionChange(
    addEditActionForm: FormGroup,
    templateArray: FormArray,
    templates: any
  ) {
    addEditActionForm.controls.action.valueChanges.subscribe(
      (action: IActionAlertRuleActions) => {
        if (action?.type == ActionType.SMS) {
          addEditActionForm.controls.roleId.clearValidators();
          addEditActionForm.controls.alert.clearValidators();
          addEditActionForm.controls.group.clearValidators();
          addEditActionForm.controls.position.clearValidators();
          addEditActionForm.controls.color.clearValidators();
          addEditActionForm.controls.routing.clearValidators();
          addEditActionForm.controls.reportingEventaname.clearValidators();
          addEditActionForm.controls.routetoqueue.clearValidators();
          addEditActionForm.controls.routetoqueue.updateValueAndValidity();
          addEditActionForm.controls.reportingEventaname.updateValueAndValidity();
          addEditActionForm.controls.alert.updateValueAndValidity();
          addEditActionForm.controls.group.updateValueAndValidity();
          addEditActionForm.controls.position.updateValueAndValidity();
          addEditActionForm.controls.roleId.updateValueAndValidity();
          addEditActionForm.controls.color.updateValueAndValidity();
          addEditActionForm.controls.routing.updateValueAndValidity(); 
          this.setTemplatesFormArray(
            addEditActionForm,
            templateArray,
            this.setTemplatesArray(templates)
          );
          templateArray.controls.forEach((formGroup: FormGroup) => {
            formGroup.controls.subject.clearValidators();
            formGroup.controls.subject.reset();
          });
        }
        if (action?.type == ActionType.Email) {
          addEditActionForm.controls.roleId.clearValidators();
          addEditActionForm.controls.group.clearValidators();
          addEditActionForm.controls.alert.clearValidators();
          addEditActionForm.controls.position.clearValidators();
          addEditActionForm.controls.color.clearValidators();
          addEditActionForm.controls.routing.clearValidators();
          addEditActionForm.controls.reportingEventaname.clearValidators();
          addEditActionForm.controls.routetoqueue.clearValidators();
          addEditActionForm.controls.routetoqueue.updateValueAndValidity();
          addEditActionForm.controls.reportingEventaname.updateValueAndValidity();
          addEditActionForm.controls.alert.updateValueAndValidity();
          addEditActionForm.controls.roleId.updateValueAndValidity();
          addEditActionForm.controls.group.updateValueAndValidity();
          addEditActionForm.controls.position.updateValueAndValidity();
          addEditActionForm.controls.color.updateValueAndValidity();
          addEditActionForm.controls.routing.updateValueAndValidity();
          this.setTemplatesFormArray(
            addEditActionForm,
            templateArray,
            this.setTemplatesArray(templates)
          );
          templateArray.controls.forEach((formGroup: FormGroup) => {
            formGroup.controls.subject.setValidators(Validators.required);
          });
          templateArray.updateValueAndValidity();
        }
        if (action?.type == ActionType.Announcement) {
          addEditActionForm.controls.roleId.clearValidators();
          addEditActionForm.controls.group.clearValidators();
          addEditActionForm.controls.alert.clearValidators();
          addEditActionForm.controls.position.clearValidators();
          addEditActionForm.controls.color.clearValidators();
          addEditActionForm.controls.routing.clearValidators();
          addEditActionForm.controls.reportingEventaname.clearValidators();
          addEditActionForm.controls.routetoqueue.clearValidators();
          addEditActionForm.controls.routetoqueue.updateValueAndValidity();
          addEditActionForm.controls.reportingEventaname.updateValueAndValidity();
          addEditActionForm.controls.alert.updateValueAndValidity();
          addEditActionForm.controls.roleId.updateValueAndValidity();
          addEditActionForm.controls.group.updateValueAndValidity();
          addEditActionForm.controls.position.updateValueAndValidity();
          addEditActionForm.controls.color.updateValueAndValidity();
          addEditActionForm.controls.routing.updateValueAndValidity();
          this.setTemplatesFormArray(
            addEditActionForm,
            templateArray,
            this.setTemplatesArray(templates)
          );
          templateArray.controls.forEach((formGroup: FormGroup) => {
            formGroup.controls.subject.setValidators(Validators.required);
          });
          templateArray.updateValueAndValidity();
        }
        if (action?.type == ActionType.Group) {
          addEditActionForm.controls.group.setValidators(Validators.required);
          addEditActionForm.controls.alert.clearValidators();
          addEditActionForm.controls.roleId.clearValidators();
          addEditActionForm.controls.position.clearValidators();
          addEditActionForm.controls.color.clearValidators();
          addEditActionForm.controls.routing.clearValidators();
          addEditActionForm.controls.reportingEventaname.clearValidators();
          addEditActionForm.controls.routetoqueue.clearValidators();
          addEditActionForm.controls.routetoqueue.updateValueAndValidity();
          addEditActionForm.controls.reportingEventaname.updateValueAndValidity();
          addEditActionForm.controls.alert.updateValueAndValidity();
          addEditActionForm.controls.roleId.updateValueAndValidity();
          addEditActionForm.controls.position.updateValueAndValidity();
          addEditActionForm.controls.color.updateValueAndValidity();
          addEditActionForm.controls.routing.updateValueAndValidity();
          templates = templateArray.value;
          templateArray.clear();
        }
        if (action?.type == ActionType.Alert) {
          addEditActionForm.controls.alert.setValidators(Validators.required);
          addEditActionForm.controls.roleId.setValidators(Validators.required);
          addEditActionForm.controls.group.clearValidators();
          addEditActionForm.controls.position.clearValidators();
          addEditActionForm.controls.color.clearValidators();
          addEditActionForm.controls.routing.clearValidators();
          addEditActionForm.controls.reportingEventaname.clearValidators();
          addEditActionForm.controls.routetoqueue.clearValidators();
          addEditActionForm.controls.routetoqueue.updateValueAndValidity();
          addEditActionForm.controls.reportingEventaname.updateValueAndValidity();
          addEditActionForm.controls.group.updateValueAndValidity();
          addEditActionForm.controls.position.updateValueAndValidity();
          addEditActionForm.controls.color.updateValueAndValidity();
          addEditActionForm.controls.routing.updateValueAndValidity();
          templates = templateArray.value;
          templateArray.clear();
        }
        if (action?.type == ActionType.Position) {
          addEditActionForm.controls.position.setValidators(
            Validators.required
          );
          addEditActionForm.controls.alert.clearValidators();
          addEditActionForm.controls.roleId.clearValidators();
          addEditActionForm.controls.group.clearValidators();
          addEditActionForm.controls.color.clearValidators();
          addEditActionForm.controls.routing.clearValidators();
          addEditActionForm.controls.reportingEventaname.clearValidators();
          addEditActionForm.controls.reportingEventaname.updateValueAndValidity();
          addEditActionForm.controls.alert.updateValueAndValidity();
          addEditActionForm.controls.roleId.updateValueAndValidity();
          addEditActionForm.controls.group.updateValueAndValidity();
          addEditActionForm.controls.color.updateValueAndValidity();
          addEditActionForm.controls.routing.updateValueAndValidity();
          templates = templateArray.value;
          templateArray.clear();
        }
        if (action?.type == ActionType.Color) {
          addEditActionForm.controls.color.setValidators(Validators.required);
          addEditActionForm.controls.position.clearValidators();
          addEditActionForm.controls.alert.clearValidators();
          addEditActionForm.controls.roleId.clearValidators();
          addEditActionForm.controls.group.clearValidators();
          addEditActionForm.controls.routing.clearValidators();
          addEditActionForm.controls.reportingEventaname.clearValidators();
          addEditActionForm.controls.routetoqueue.clearValidators();
          addEditActionForm.controls.routetoqueue.updateValueAndValidity();
          addEditActionForm.controls.reportingEventaname.updateValueAndValidity();
          addEditActionForm.controls.position.updateValueAndValidity();
          addEditActionForm.controls.alert.updateValueAndValidity();
          addEditActionForm.controls.roleId.updateValueAndValidity();
          addEditActionForm.controls.group.updateValueAndValidity();
          addEditActionForm.controls.routing.updateValueAndValidity();
          templates = templateArray.value;
          templateArray.clear();
        }
        if (action?.type == ActionType.Route) {
          addEditActionForm.controls.routing.setValidators(Validators.required);
          addEditActionForm.controls.alert.clearValidators();
          addEditActionForm.controls.roleId.clearValidators();
          addEditActionForm.controls.group.clearValidators();
          addEditActionForm.controls.position.clearValidators();
          addEditActionForm.controls.color.clearValidators();
          addEditActionForm.controls.reportingEventaname.clearValidators();
          addEditActionForm.controls.routetoqueue.clearValidators();
          addEditActionForm.controls.routetoqueue.updateValueAndValidity();
          addEditActionForm.controls.reportingEventaname.updateValueAndValidity();
          addEditActionForm.controls.alert.updateValueAndValidity();
          addEditActionForm.controls.roleId.updateValueAndValidity();
          addEditActionForm.controls.group.updateValueAndValidity();
          addEditActionForm.controls.position.updateValueAndValidity();
          addEditActionForm.controls.color.updateValueAndValidity();
          templates = templateArray.value;
          templateArray.clear();
        }
        if (action?.type == ActionType.Priority) {
          addEditActionForm.controls.roleId.clearValidators();
          addEditActionForm.controls.alert.clearValidators();
          addEditActionForm.controls.group.clearValidators();
          addEditActionForm.controls.position.clearValidators();
          addEditActionForm.controls.color.clearValidators();
          addEditActionForm.controls.routing.clearValidators();
          addEditActionForm.controls.reportingEventaname.clearValidators();
          addEditActionForm.controls.routetoqueue.clearValidators();
          addEditActionForm.controls.routetoqueue.updateValueAndValidity();
          addEditActionForm.controls.reportingEventaname.updateValueAndValidity();
          addEditActionForm.controls.alert.updateValueAndValidity();
          addEditActionForm.controls.group.updateValueAndValidity();
          addEditActionForm.controls.position.updateValueAndValidity();
          addEditActionForm.controls.roleId.updateValueAndValidity();
          addEditActionForm.controls.color.updateValueAndValidity();
          addEditActionForm.controls.routing.updateValueAndValidity(); 
        }
        if (action?.type == ActionType.ReportingEventAName) {
            addEditActionForm.controls.reportingEventaname.setValidators(Validators.required);
            addEditActionForm.controls.alert.clearValidators();
            addEditActionForm.controls.group.clearValidators();
            addEditActionForm.controls.position.clearValidators();
            addEditActionForm.controls.roleId.clearValidators();
            addEditActionForm.controls.color.clearValidators();
            addEditActionForm.controls.routing.clearValidators();
            addEditActionForm.controls.routetoqueue.clearValidators();
            addEditActionForm.controls.routetoqueue.updateValueAndValidity();
            addEditActionForm.controls.group.updateValueAndValidity();
            addEditActionForm.controls.position.updateValueAndValidity();
            addEditActionForm.controls.roleId.updateValueAndValidity();
            addEditActionForm.controls.color.updateValueAndValidity();
            addEditActionForm.controls.routing.updateValueAndValidity();
            templates = templateArray.value;
            templateArray.clear();
        }
        if (action?.type == ActionType.RouteToQueue) {
          addEditActionForm.controls.routetoqueue.setValidators(Validators.required);
          addEditActionForm.controls.alert.clearValidators();
          addEditActionForm.controls.group.clearValidators();
          addEditActionForm.controls.position.clearValidators();
          addEditActionForm.controls.roleId.clearValidators();
          addEditActionForm.controls.color.clearValidators();
          addEditActionForm.controls.routing.clearValidators();
          addEditActionForm.controls.reportingEventaname.clearValidators();
          addEditActionForm.controls.reportingEventaname.updateValueAndValidity();
          addEditActionForm.controls.group.updateValueAndValidity();
          addEditActionForm.controls.position.updateValueAndValidity();
          addEditActionForm.controls.roleId.updateValueAndValidity();
          addEditActionForm.controls.color.updateValueAndValidity();
          addEditActionForm.controls.routing.updateValueAndValidity();
          templates = templateArray.value;
          templateArray.clear();
      }
   
        addEditActionForm.updateValueAndValidity();
        this.changesDetect.detectChanges();
      }
    );
  }

  private OnOperatorChange(conditionFormGroup: FormGroup) {
    this.subs.sink =
      conditionFormGroup.controls.operator.valueChanges.subscribe((x) => {
        if (x && x.text) {
          conditionFormGroup.controls.value.clearValidators();
          conditionFormGroup.controls.value.reset();
          if (
            x.value == operatorsValue.IsEmpty ||
            conditionFormGroup.controls?.condition?.value?.data_type ==
              TypeOfBoolean
          ) {
            conditionFormGroup.controls.value.clearValidators();
            conditionFormGroup.controls.value.updateValueAndValidity();
          } else {
            conditionFormGroup.controls.value.setValidators(
              Validators.required
            );
            if (
              conditionFormGroup.controls.condition.value.data_type ==
                QuestionType.PhoneNumber.value ||
              conditionFormGroup.controls.condition.value.data_type ==
                QuestionType.SMSPhoneNumber.value
            ) {
              conditionFormGroup.controls.value.setValidators([
                Validators.pattern(Validations.PhoneNoRegx),
                Validators.required,
              ]);
            }
            if (
              conditionFormGroup.controls.condition.value.data_type ==
              QuestionType.Email.value
            ) {
              conditionFormGroup.controls.value.setValidators([
                Validators.pattern(Validations.EmailRegX),
                Validators.required,
              ]);
            }
            if (
              conditionFormGroup.controls.condition.value.data_type ==
              QuestionType.Number.value
            ) {
              conditionFormGroup.controls.value.setValidators([
                Validators.pattern(Validations.NumberOnlyRegx),
                Validators.required,
              ]);
            }
            conditionFormGroup.controls.value.updateValueAndValidity();
          }
        }
        this.changesDetect.detectChanges();
      });
  }

  private OnTypeChange(conditionFormGroup: FormGroup) {
    conditionFormGroup.controls.condition.valueChanges.subscribe((x) => {
      if (x && x.id) {
        this.ResetOperatorAndValue(conditionFormGroup);
      }
      this.changesDetect.detectChanges();
    });
  }

  private ResetOperatorAndValue(conditionFormGroup?: FormGroup) {
    if (conditionFormGroup) {
      conditionFormGroup.get('operator').reset();
      conditionFormGroup.get('value').reset();
    }
  }

  private GetDefaultFormData(): AdvanceRules {
    return {
      actions: [],
      conditions: [],
      id: null,
      isDeleted: false,
      name: null,
      type: AdvanceWorkflowType[0].value,
      when: null,
    };
  }

  private IsAdvanceRuleCopyExist(name: any) {
    this.AdvanceRuleCopyCount = this.AdvanceRuleCopyCount + 1;
    const isCopyExist =
      this.workFlowService.AdvanceWorkflowListSubject.value.find(
        (x) => x.name == name
      );
    if (isCopyExist) {
      this.IsAdvanceRuleCopyExist(name + WorkflowMessages.CopyPostFixMessage);
    }
  }
}
