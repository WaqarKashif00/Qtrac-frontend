import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupResult } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AppNotificationService } from 'src/app/core/services/notification.service';
import { cloneObject, getArrayValueIfNotEmptyElseNull } from 'src/app/core/utilities/core-utilities';
import { ActionType } from 'src/app/models/enums/action-type.enum';
import { Mode } from 'src/app/models/enums/mode.enum';
import { Action, ConditionRouting } from '../../../models/common/work-flow-detail.interface';
import { AdvanceWorkflowType } from '../enums/request-document-type';
import { WorkflowMessages } from '../message-constant';
import { AdvanceRules } from '../models/advance-workflow-rules.interface';
import { IDropdown } from '../models/dropdown.interface';
import { IPreServiceQuestionFormGroup } from '../models/pre-service-question-form-group.interface';
import { IConditionRoutingFormGroup } from '../models/question-set-form-group';
import { SupportedLanguage } from '../models/supported-language';
import { PreServiceQuestion, QuestionSet } from '../models/work-flow-request.interface';
import { SharedQuestionService } from '../shared-add-edit-question/shared-question.service';
import { WorkFlowService } from '../work-flow.service';

@Injectable()
export class QuestionSetService extends AbstractComponentService {
  GetQuestionSetIndex(questionSetId: string) {
    return this.workFlowService.GetQuestionSetIndex(questionSetId);
  }

  OpenQuestionSetModal$: Observable<boolean>;
  private OpenQuestionSetModalSubject: BehaviorSubject<boolean>;

  IsAddQuestionsVisibe$: Observable<boolean>;
  private IsAddQuestionsVisibeSubject: BehaviorSubject<boolean>;

  IsSaveClicked$: Observable<boolean>;
  private IsSaveClickedSubject: BehaviorSubject<boolean>;

  Questions$: Observable<PreServiceQuestion[]>;
  private QuestionsSubject: BehaviorSubject<PreServiceQuestion[]>;

  ConditionalRoutings$: Observable<ConditionRouting[]>;
  private ConditionalRoutingsSubject: BehaviorSubject<ConditionRouting[]>;

  QuestionTabSelected$: Observable<boolean>;
  private QuestionTabSelectedSubject: BehaviorSubject<boolean>;

  supportedLanguageList$: Observable<SupportedLanguage[]>;
  QuestionSets$: Observable<QuestionSet[]>;
  Routings$: Observable<GroupResult[]>;

  supportedLanguages = [];
  AddEditQuestionSetForm: FormGroup;
  QuestionSetName : FormControl;
  UpdateActionIndex: number;
  QuestionMode = Mode.Add;
  ConditionalRoutingMode = Mode.Add;
  ActionMode = Mode.Add;
  ActionErrorMessage = '';

  get AddEditQuestionSetIdFormControl() {
    return this.AddEditQuestionSetForm.get('id');
  }
  get ConditionRoutingFormGroup() {
    return this.AddEditQuestionSetForm.get('conditionRouting') as FormGroup;
  }
  get IsConditionalRoutingFormControl() {
    return this.AddEditQuestionSetForm.get('conditionRouting.isConditionalRouting');
  }
  get ConditionFormControl() {
    return this.AddEditQuestionSetForm.get('conditionRouting.condition');
  }
  get ConditionNameFormControl() {
    return this.AddEditQuestionSetForm.get('conditionRouting.name');
  }
  get ActionsFormArray() {
    return (this.AddEditQuestionSetForm.get('conditionRouting') as FormGroup).get('actions') as FormArray;
  }
  get ActionRoutingFormControl() {
    return this.AddEditQuestionSetForm.get('conditionRouting.routing');
  }
  get ActionColorFormControl() {
    return this.AddEditQuestionSetForm.get('conditionRouting.color');
  }
  get ActionTypeFormControl() {
    return this.AddEditQuestionSetForm.get('conditionRouting.actionType');
  }

  constructor(
    private workFlowService: WorkFlowService,
    private sharedQuestionService: SharedQuestionService,
    private appNotificationService: AppNotificationService
  ) {
    super();
    this.InitSubjectsAndObservables();
    this.SubscribeSupportedLanguages();
    this.InitFormGroup();
    this.SubscribeFormChangeEvent();
  }

  private InitSubjectsAndObservables() {
    this.OpenQuestionSetModalSubject = new BehaviorSubject<boolean>(false);
    this.OpenQuestionSetModal$ = this.OpenQuestionSetModalSubject.asObservable();

    this.IsAddQuestionsVisibeSubject = new BehaviorSubject<boolean>(false);
    this.IsAddQuestionsVisibe$  = this.IsAddQuestionsVisibeSubject.asObservable();

    this.IsSaveClickedSubject = new BehaviorSubject<boolean>(false);
    this.IsSaveClicked$ = this.IsSaveClickedSubject.asObservable();

    this.QuestionTabSelectedSubject = new BehaviorSubject<boolean>(true);
    this.QuestionTabSelected$ = this.QuestionTabSelectedSubject.asObservable();

    this.QuestionsSubject = new BehaviorSubject<PreServiceQuestion[]>([]);
    this.Questions$ = this.QuestionsSubject.asObservable();

    this.ConditionalRoutingsSubject = new BehaviorSubject<ConditionRouting[]>([]);
    this.ConditionalRoutings$ = this.ConditionalRoutingsSubject.asObservable();

    this.supportedLanguageList$ = this.workFlowService.SupportedLanguages$;
    this.QuestionSets$ = this.workFlowService.QuestionSets$;
    this.Routings$ = this.workFlowService.Routings$;
  }

  private SubscribeSupportedLanguages() {
    this.subs.sink = this.supportedLanguageList$.subscribe(languages => {
      this.supportedLanguages = languages;
    });
  }

  private InitFormGroup() {
    this.AddEditQuestionSetForm = this.workFlowService.InitAddEditQuestionSetForm()
  }

  private SubscribeFormChangeEvent() {
    this.subs.sink = this.ActionTypeFormControl.valueChanges.subscribe(() => {
      this.ActionErrorMessage = '';
    });
    this.subs.sink = this.IsConditionalRoutingFormControl.valueChanges.subscribe((checked) => {
      if (!checked) {
        this.ConditionFormControl.setErrors(null);
      }
    });
  }

  SetEditFormGroup(questionset: QuestionSet) {

    this.AddEditQuestionSetForm.patchValue({
      id: questionset.id,
      routing : questionset.routing,
      questionSetName: questionset.questionSetName,
      conditionRouting: {
        isConditionalRouting: false
      }
    });
  }

  SelectQuestionTab() {
    this.QuestionTabSelectedSubject.next(true);
  }

  OpenModal() {
    let a = this.AddEditQuestionSetForm;
    if(this.ActionMode==Mode.Add){
      this.AddEditQuestionSetForm.get('questionSetName').clearValidators();
      this.AddEditQuestionSetForm.get('questionSetName').updateValueAndValidity();
    }
    this.workFlowService.PushQueueAndQuestionSetInRoutingSubject();
    this.OpenQuestionSetModalSubject.next(true);
  }

  CloseModalAndReset() {
    this.OpenQuestionSetModalSubject.next(false);
    this.sharedQuestionService.AddEditQuestionForm.reset();
    this.AddEditQuestionSetForm.reset({
      conditionRouting: {
        isConditionalRouting: false
      }
    });
    this.AddEditQuestionSetForm.controls.id.reset();
    this.ActionsFormArray.clear();
    this.ConditionalRoutingMode = Mode.Add;
    this.ActionMode = Mode.Add;
    this.ConditionFormControl.setErrors(null);
    this.QuestionsSubject.next([]);
    this.ConditionalRoutingsSubject.next([]);
  }

  InitRequiredAddQuestionConfigurations() {
    this.QuestionMode = Mode.Add;
    this.sharedQuestionService.ResetForm();
    this.sharedQuestionService.SubscribeFormValueChangeEvent();
    this.sharedQuestionService.SetDefaultFormGroup();
    this.sharedQuestionService.SetSupportedLanguagePreQuestionFormArray();
    this.sharedQuestionService.SetSupportedLanguageOptionFormArray();
  }

  private InitRequiredEditQuestionConfigurations() {
    this.QuestionMode = Mode.Edit;
    this.sharedQuestionService.SubscribeFormValueChangeEvent();
    this.sharedQuestionService.SetSupportedLanguagePreQuestionFormArray();
    this.sharedQuestionService.SetSupportedLanguageOptionFormArray();
  }

  InitAndSetEditQuestionData(preServiceQuestion: PreServiceQuestion) {
      this.InitRequiredEditQuestionConfigurations();
      this.sharedQuestionService.SetEditFormGroup(preServiceQuestion);
  }




  SetEditQuestionSetQuestions(questions: PreServiceQuestion[]) {
    this.QuestionsSubject.next(questions || []);
  }

  AddQuestion(request: FormGroup): void {
    const shortName = request.get('shortName').value;
    const shortNameAlreadyExist = this.QuestionsSubject.value.some(question => question.shortName?.toLowerCase() === shortName?.toLowerCase());

    if (shortNameAlreadyExist) {
      request.get('shortName').setErrors({isExists:true});
      this.IsSaveClickedSubject.next(false);
      return;
    }
    let fa = request.controls.option as FormArray
    fa.controls.forEach(
      (option:FormGroup)=>{
        option.controls.option.clearValidators();
        option.controls.option.updateValueAndValidity();
      }
    )
    this.formService
      .CallFormMethod<IPreServiceQuestionFormGroup>(request,true)
      .then((response) => {
        const serviceQuestionRequest = this.GetServiceQuestion(response, this.uuid);
        this.QuestionsSubject.value.push(serviceQuestionRequest);
        this.QuestionsSubject.next(cloneObject(this.QuestionsSubject.value));
        this.InitRequiredAddQuestionConfigurations();
        this.IsAddQuestionsVisibeSubject.next(false);
      }).catch(rej=>{
        if(request.controls.options.invalid && !request.controls.options.hasError('required')){
          let options= request.controls.options as FormArray;
          options.controls.forEach((optionLanguageArray:FormArray)=>{
            if(optionLanguageArray.invalid){
              optionLanguageArray.controls.forEach((element:FormGroup) => {
                if(element.controls.isDefault.value && element.controls.option.invalid){
                }else if(element.controls.option.invalid){
                  optionLanguageArray.setErrors({translationError:true})
                }
              });
            }

          })
        }
        let fa = request.controls.option as FormArray
        fa.controls.forEach(
          (option: FormGroup) => {
            option.controls.option.setValidators(Validators.required);
          })
        this.IsSaveClickedSubject.next(false);
      })
      .finally(()=>{
        this.IsSaveClickedSubject.next(false);
      });
  }

  EditQuestion(request: FormGroup): void {
    const id = request.get('id').value;
    const shortName = request.get('shortName').value;
    const shortNameAlreadyExist = this.QuestionsSubject.value.some(
      question => question.shortName?.toLowerCase() === shortName?.toLowerCase() && question.id !== id);

    if (shortNameAlreadyExist) {
      request.get('shortName').setErrors({isExists:true});
      this.IsSaveClickedSubject.next(false);
      return;
    }
    let fa = request.controls.option as FormArray
    fa.controls.forEach(
      (option:FormGroup)=>{
        option.controls.option.clearValidators();
        option.controls.option.updateValueAndValidity();
      }
    )
    this.formService
      .CallFormMethod<IPreServiceQuestionFormGroup>(request,true)
      .then((response) => {
        const serviceQuestion = this.GetServiceQuestion(response, response.id);
        this.GetQuestionType(serviceQuestion);
        const editServiceQuestionIndex = this.QuestionsSubject.value.findIndex(que => que.id === serviceQuestion.id);
        this.QuestionsSubject.value[editServiceQuestionIndex] = serviceQuestion;
        this.QuestionsSubject.next(cloneObject(this.QuestionsSubject.value));
        this.InitRequiredAddQuestionConfigurations();
        this.IsAddQuestionsVisibeSubject.next(false);
      }).catch((value)=>{
        if(request.controls.options.invalid && !request.controls.options.hasError('required')){
          let options= request.controls.options as FormArray;
          options.controls.forEach((optionLanguageArray:FormArray)=>{
            if(optionLanguageArray.invalid){
              optionLanguageArray.controls.forEach((element:FormGroup) => {
                if(element.controls.isDefault.value && element.controls.option.invalid){
                }else if(element.controls.option.invalid){
                  optionLanguageArray.setErrors({translationError:true})
                }
              });
            }

          })
        }
        let fa = request.controls.option as FormArray
        fa.controls.forEach(
          (option: FormGroup) => {
            option.controls.option.setValidators(Validators.required);
          }
    )
        this.IsSaveClickedSubject.next(false);
      }).finally(()=>{
        this.IsSaveClickedSubject.next(false);
      });
  }

  private GetServiceQuestion(response: IPreServiceQuestionFormGroup, id: string): PreServiceQuestion {
    return {
      id,
      isPersonalIdentifier: response.isPersonalIdentifier,
      isPurge: response.isPurge,
      isRequired: response.isRequired,
      isVisible: response.isVisible,
      isDisplay: response.isDisplay,
      question: response.question,
      shortName: response.shortName,
      type: response.type.value,
      typeSetting: this.GetTypeSettings(response),
    };
  }

  private GetQuestionType(preServiceQuestion: PreServiceQuestion) {
    if (typeof (preServiceQuestion.type) === 'object') {
      let dummyType: any;
      dummyType = preServiceQuestion.type;
      preServiceQuestion.type = dummyType.value;
    }
  }

  private GetTypeSettings(response: IPreServiceQuestionFormGroup) {
    const questionType = response.type.value;
    if (this.sharedQuestionService.IsMaxLengthQuestionType(questionType)) {
      return response.maxLength;
    }
    if (this.sharedQuestionService.IsMinMaxQuestionType(questionType)) {
      return {
        min: response.min,
        max: response.max,
      };
    }
    if (this.sharedQuestionService.IsOptionQuestionType(questionType)) {
      return response.options;
    }
    return null;
  }

  DeleteQuestion(id: string, setId: string) {
    if(!this.workFlowService.HandleIfQuestionOrEventUsedInAdvancedWorkflow(id,setId)){
      if (confirm(WorkflowMessages.ConfirmDeleteMessage)) {
        let data = this.QuestionsSubject.value;
        data.forEach((x, index) => {
          if (x.id == id) {
            this.QuestionsSubject.value.splice(index, 1);
          }
        })
        this.QuestionsSubject.next(cloneObject(this.QuestionsSubject.value));
      }
    }
    else{
      return this.appNotificationService.NotifyError(WorkflowMessages.QuestionSetAlreadyUse);
    }
  }

  SetEditConditionRoutingFormGroupAndMode(conditionRouting: ConditionRouting) {
    this.ResetActionFormControls();
    this.ConditionalRoutingMode = Mode.Edit;
    this.ConditionRoutingFormGroup.patchValue({
      id: conditionRouting.id,
      name: conditionRouting.conditionName,
      isConditionalRouting: (conditionRouting.condition) ? true : false,
      condition: conditionRouting.condition,
    });
    if (!conditionRouting.condition) {
      this.ConditionFormControl.setErrors(null);
    }
    this.SetActionsFormArray(conditionRouting.actions);
  }

  SetActionsFormArray(actions: Action[]) {
    this.ActionsFormArray.clear();
    if (!actions) {
      return;
    }
    actions.forEach(action => {
      this.ActionsFormArray.push(this.GetActionFormGroup(action));
    });
  }

  private GetActionFormGroup(action: Action) {
    return this.formBuilder.group({
      actionType: action.actionType,
      routingId: action.routingId,
      routingType: action.routingType,
      color: action.color,
      group: action.group
    });
  }

  AddConditionalRouting() {
    const request = this.ConditionRoutingFormGroup;
    const IsActionTypeInValid = this.IsActionTypeInValid();
    if (IsActionTypeInValid) {
      return;
    }
    const conditionName = request.get('name').value;
    const conditionNameAlreadyExist = this.ConditionalRoutingsSubject.value.some(
      conditionalRouting => conditionalRouting.conditionName === conditionName);

    if (conditionNameAlreadyExist) {
      this.AppNotificationService.NotifyError(WorkflowMessages.ConditionNameAlreadyExistMessage);
      return;
    }

    this.formService.CallFormMethod<IConditionRoutingFormGroup>(request).then((response) => {
      const conditionRoutingObject = this.ConditionRoutingObject(response, this.uuid);
      this.ConditionalRoutingsSubject.value.push(conditionRoutingObject);
      this.ConditionalRoutingsSubject.next(this.ConditionalRoutingsSubject.value);
      this.ResetConditionRoutingModeAndConditionalRouting();
    });
  }

  private IsActionTypeInValid() {
    if (this.ActionsFormArray.length === 0) {
      this.ActionErrorMessage = WorkflowMessages.AddActionMessage;
      return true;
    }
    return false;
  }

  EditConditionalRouting() {
    const request = this.ConditionRoutingFormGroup;
    const IsActionTypeInValid = this.IsActionTypeInValid();
    if (IsActionTypeInValid) {
      return;
    }

    const id = request.get('id').value;
    const conditionName = request.get('name').value;
    const conditionNameAlreadyExist = this.ConditionalRoutingsSubject.value.some(
      conditionalRouting => conditionalRouting.conditionName === conditionName && conditionalRouting.id !== id);

    if (conditionNameAlreadyExist) {
      this.AppNotificationService.NotifyError(WorkflowMessages.ConditionNameAlreadyExistMessage);
      return;
    }

    this.formService.CallFormMethod<IConditionRoutingFormGroup>(request).then((response) => {
      const conditionRoutingObject = this.ConditionRoutingObject(response, response.id);
      const editConditionRoutingIndex =
        this.ConditionalRoutingsSubject.value.findIndex(condition => condition.id === conditionRoutingObject.id);
      this.ConditionalRoutingsSubject.value[editConditionRoutingIndex] = conditionRoutingObject;
      this.ConditionalRoutingsSubject.next(this.ConditionalRoutingsSubject.value);
      this.ResetConditionRoutingModeAndConditionalRouting();
    });
  }

  private ConditionRoutingObject(response: IConditionRoutingFormGroup, id: string): ConditionRouting {
    return {
      id,
      conditionName: response.name,
      condition: response.condition ? this.GetDefaultConditionValueWhenRulesEmpty(response.condition) : null,
      actions: response.actions
    };
  }

  private GetDefaultConditionValueWhenRulesEmpty(condition: any) {
    return condition.rules.length === 0 ? null : condition;
  }

  private ResetConditionRoutingModeAndConditionalRouting() {
    this.ResetConditionRoutingFormGroupAndMode();
    this.ConditionFormControl.setErrors(null);
  }

  DeleteConditionRouting(index: number) {
    this.ConditionalRoutingsSubject.value.splice(index, 1);
    this.ConditionalRoutingsSubject.next(this.ConditionalRoutingsSubject.value);
  }

  SetEditQuestionSetConditionalRouting(conditionRouting: ConditionRouting[]) {
    this.ConditionalRoutingsSubject.next(conditionRouting || []);
  }

  ResetConditionRoutingFormGroupAndMode() {
    this.ConditionalRoutingMode = Mode.Add;
    this.ActionMode = Mode.Add;
    this.ConditionRoutingFormGroup.reset();
    this.AddEditQuestionSetForm.patchValue({
      conditionRouting: {
        isConditionalRouting: false
      }
    });
    this.ActionsFormArray.clear();
  }

  ValidateThenAddAction() {
    const action = this.ValidateAndGetActionObject();
    if (!action) { return; }
    const ActionsArray = this.ActionsFormArray.value as Action[] || [];
    const isActionTypeAlreadyExist = ActionsArray.some(act => act.actionType === action.actionType);
    this.ActionErrorMessage = '';
    if (isActionTypeAlreadyExist) {
      this.ActionErrorMessage = WorkflowMessages.AlreadyExistActionTypeMessage;
      return null;
    }

    this.ActionsFormArray.push(this.GetActionFormGroup(action));
    this.ResetActionFormControls();
  }

  private ValidateAndGetActionObject() {
    const actionType = this.ActionTypeFormControl.value;
    const actionTypeValue = actionType ? actionType.value : '';
    const actionTypeText = actionType ? actionType.text : '';
    const color = this.ActionColorFormControl.value;
    const routing = this.ActionRoutingFormControl.value;

    let action: Action;
    if (this.IsRoutingActionType(actionTypeValue)) {
      action = {
        actionType: actionTypeValue,
        color,
        routingId: routing ? routing.id : null,
        routingType: routing ? routing.type : null,
        group: routing ? routing.group : null
      };
    }
    if (this.IsFlagActionType(actionTypeValue)) {
      action = {
        actionType: actionTypeValue,
        color,
        routingId: null,
        routingType: actionTypeText,
        group: null
      };
    }
    if (!action) {
      this.ActionErrorMessage = WorkflowMessages.SelectActionMessage;
      return null;
    }
    if (action && this.IsRoutingActionType(action.actionType) && !action.routingType) {
      this.ActionErrorMessage = WorkflowMessages.SelectRoutingMessage;
      return null;
    }
    if (action && this.IsFlagActionType(action.actionType) && !action.color) {
      this.ActionErrorMessage = WorkflowMessages.SelectColorMessage;
      return null;
    }
    const questionSetId = this.AddEditQuestionSetIdFormControl.value;
    if (questionSetId && questionSetId === action.routingId) {
      this.ActionErrorMessage = WorkflowMessages.SameQuestionSetErrorMessage;
      return null;
    }

    return action;
  }

  EditAction(index: number) {
    this.UpdateActionIndex = index;
    this.ActionMode = Mode.Edit;
    const action = this.ActionsFormArray.at(index).value;
    const editActionObject = this.GetActions().find(act => act.value === action.actionType);
    this.ActionTypeFormControl.setValue(editActionObject);

    if (this.IsRoutingActionType(action.actionType)) {
      const editRoutingObject = this.workFlowService.GetRoutingById(action.routingId);
      this.ActionRoutingFormControl.setValue(editRoutingObject);
    }
    if (this.IsFlagActionType(action.actionType)) {
      this.ActionColorFormControl.setValue(action.color);
    }
  }

  UpdateAction() {
    const EditActionFormGroup = this.ActionsFormArray.at(this.UpdateActionIndex) as FormGroup;
    const action = this.ValidateAndGetActionObject();
    if (!action) { return; }

    this.ActionErrorMessage = '';
    const ActionsArray = this.ActionsFormArray.value as Action[] || [];
    let isActionAlreadyExist = false;

    if (this.IsRoutingActionType(action.actionType)) {
      isActionAlreadyExist = ActionsArray.some(act =>
        act.actionType === action.actionType && act.routingType === action.routingType);
    }
    if (this.IsFlagActionType(action.actionType)) {
      isActionAlreadyExist = ActionsArray.some(act =>
        act.actionType === action.actionType && act.color === action.color);
    }

    if (isActionAlreadyExist) {
      this.ActionErrorMessage = WorkflowMessages.AlreadyExistActionMessage;
      return null;
    }

    EditActionFormGroup.get('actionType').setValue(action.actionType);
    EditActionFormGroup.get('color').setValue(action.color);
    EditActionFormGroup.get('routingId').setValue(action.routingId);
    EditActionFormGroup.get('routingType').setValue(action.routingType);
    this.ActionMode = Mode.Add;
    this.ResetActionFormControls();
  }

  ResetActionFormControls() {
    this.ActionRoutingFormControl.reset();
    this.ActionTypeFormControl.reset();
    this.ActionColorFormControl.reset();
  }

  DeleteAction(index: number) {
    this.ActionsFormArray.removeAt(index);
  }

  Add(): void {

    let questionSetName = this.AddEditQuestionSetForm.get('questionSetName').value;
    questionSetName = questionSetName ? questionSetName.toLowerCase().trim() :"";

    let isQuestionSetAlreadyExist = this.workFlowService.GetQuestionSets().
      some(question => question.questionSetName.toLowerCase().trim() == questionSetName && !question.isDeleted);

    if(isQuestionSetAlreadyExist){
      this.AddEditQuestionSetForm.get('questionSetName').setErrors({isExists:true});
      return;
    }

    this.AddEditQuestionSetForm.get('questionSetName').setValidators(Validators.required);
    this.AddEditQuestionSetForm.get('questionSetName').updateValueAndValidity();

    if (this.AddEditQuestionSetForm.get('questionSetName').invalid) {
      this.AddEditQuestionSetForm.get('questionSetName').markAsTouched();
    } else {
      const questionSet = this.GetQuestionSetIdAndName();
      const questionSetObject = this.GetQuestionSetObject(questionSet, this.uuid);
      this.workFlowService.AddQuestionSet(questionSetObject);
      this.CloseModalAndReset();
    }
  }

  private GetQuestionSetIdAndName() {
    return {
      id: this.AddEditQuestionSetForm.get('id').value,
      questionSetName: this.AddEditQuestionSetForm.get('questionSetName').value
    };
  }

  private QuestionsAndConditionRoutingsIsEmpty() {
    return this.QuestionsSubject.value.length === 0 && this.ConditionalRoutingsSubject.value.length === 0;
  }

  Edit(): void {
    let id =this.AddEditQuestionSetForm.get('id').value;
    let questionSetName = this.AddEditQuestionSetForm.get('questionSetName').value;
    questionSetName = questionSetName ? questionSetName.toLowerCase().trim() :"";

    let isQuestionSetAlreadyExist = this.workFlowService.GetQuestionSets().
      some(question => question.questionSetName.toLowerCase().trim() == questionSetName && question.id !== id && !question.isDeleted);

    if(isQuestionSetAlreadyExist){
      this.AddEditQuestionSetForm.get('questionSetName').setErrors({isExists:true});
      return;
    }
    this.AddEditQuestionSetForm.get('questionSetName').setValidators(Validators.required);
    this.AddEditQuestionSetForm.get('questionSetName').updateValueAndValidity();
    if (this.AddEditQuestionSetForm.get('questionSetName').invalid) { return; }
    const questionSet = this.GetQuestionSetIdAndName();
    const questionSetObject = this.GetQuestionSetObject(questionSet, questionSet.id);
    this.workFlowService.EditQuestionSet(questionSetObject);
    this.CloseModalAndReset();
  }

  private GetQuestionSetObject(response: any, id: string): QuestionSet {
    let conditionRoutings = null;
    if(this.AddEditQuestionSetForm.controls.routing.value){
      conditionRoutings=[];
      conditionRoutings.push(
        {
          conditionName: this.AddEditQuestionSetForm.controls.routing.value.type,
          condition: null,
          id: this.uuid,
          actions: [
            {
              actionType: 'routing',
              routingId: this.AddEditQuestionSetForm.controls.routing.value.id,
              routingType: this.AddEditQuestionSetForm.controls.routing.value.type,
              color: 'default',
              group: this.AddEditQuestionSetForm.controls.routing.value.group,
            },
          ],
        }
      )
    }

    return {
      id,
      routing: this.AddEditQuestionSetForm.controls.routing.value,
      questionSetName: response.questionSetName,
      questions: getArrayValueIfNotEmptyElseNull(this.QuestionsSubject.value),
      conditionRoutings: conditionRoutings /*GetArrayValueIfNotEmptyElseNull(this.ConditionalRoutingsSubject.value)*/
    };
  }

  Delete(id: string): void {

    const IsQuestionSetIsAlreadyInUseByService = this.IsQuestionSetIsAlreadyInUseByService(id);
    const IsQuestionSetIsAlreadyInUseByQuestionSet = this.IsQuestionSetIsAlreadyInUseByQuestionSet(id);
    const IsQuestionSetAlreadyInUseByAdvanceRule = this.IsQuestionSetAlreadyInUseByAdvanceRule(id);


    if (IsQuestionSetIsAlreadyInUseByService) {
      this.appNotificationService.NotifyError(WorkflowMessages.QuestionSetsAlreadyInUseMessageByService);
      return
    }
    if(IsQuestionSetIsAlreadyInUseByQuestionSet){
      this.appNotificationService.NotifyError(WorkflowMessages.QuestionSetsAlreadyInUseMessageByQuestionSet);
      return
    }
    if(IsQuestionSetAlreadyInUseByAdvanceRule){
      this.appNotificationService.NotifyError(WorkflowMessages.QuestionSetAlreadyInUseByAdvanceRule);
      return
    }


    if (confirm(WorkflowMessages.ConfirmDeleteMessage)) {
        this.workFlowService.DeleteQuestionSet(id);
    }
  }


  IsQuestionSetAlreadyInUseByAdvanceRule(id:string){
    return this.workFlowService.GetAdvanceRule().some(advanceRule=>advanceRule.when != null && advanceRule.when.id== id && !advanceRule.isDeleted)
    || this.workFlowService.GetAdvanceRule().some(advanceRule=> advanceRule.type == AdvanceWorkflowType[0].value  && !advanceRule.isDeleted && advanceRule.actions.some(adavnceRuleAction=>adavnceRuleAction.action.type == "Route" && adavnceRuleAction.routing.id == id));
  }

  IsQuestionSetIsAlreadyInUseByService(id: string) {
    return this.workFlowService.GetServices()
      .some(service => service.routing !== null && service.routing.id === id && !service.isDeleted );
  }

  IsQuestionSetIsAlreadyInUseByQuestionSet(id: string) {
    return this.workFlowService.GetQuestionSets()
      .some(questionSet => questionSet.routing !== null && questionSet.routing.id === id && !questionSet.isDeleted);
  }




  GetQuestionTypes(): IDropdown[] {
    return this.sharedQuestionService.GetQuestionTypes();
  }

  GetActions(): IDropdown[] {
    return [
      { text: 'Route To', value: 'routing' },
      { text: 'Flag Person', value: 'flag' },
    ];
  }

  GetDefaultAction(): IDropdown {
    return this.GetActions()[0];
  }

  IsRoutingActionType(actionType: string) {
    return actionType === ActionType.Routing;
  }

  IsAlertActionType(actionType: string) {
    return actionType === ActionType.Alert;
  }

  IsFlagActionType(actionType: string) {
    return actionType === ActionType.Flag;
  }

  IsQuestionsEmpty() {
    return !this.QuestionsSubject.value || this.QuestionsSubject.value.length === 0;
  }



  changeListData(data: any) {
    this.QuestionsSubject.next(data);
  }

  PushQueueAndQuestionSetInRoutingSubject() {
    this.workFlowService.PushQueueAndQuestionSetInRoutingSubject();
  }

  GetRoutingCountAndNames(id) {
    const data = this.workFlowService.AdvanceWorkflowListSubject.value.
    filter((x: AdvanceRules) => x.type == AdvanceWorkflowType[0].value && x.when.id == id)?.map(res => {
      return {
        name: res.name
      };
    }
    );
    return data;
  }




}


