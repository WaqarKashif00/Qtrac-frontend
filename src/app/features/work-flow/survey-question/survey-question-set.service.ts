import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { cloneObject, getArrayValueIfNotEmptyElseNull } from 'src/app/core/utilities/core-utilities';
import { Mode } from 'src/app/models/enums/mode.enum';
import { SurveyQuestionSet } from '../../../models/common/work-flow-detail.interface';
import { WorkflowMessages } from '../message-constant';
import { IDropdown } from '../models/dropdown.interface';
import { IPreServiceQuestionFormGroup } from '../models/pre-service-question-form-group.interface';
import { SupportedLanguage } from '../models/supported-language';
import { PreServiceQuestion } from '../models/work-flow-request.interface';
import { SharedQuestionService } from '../shared-add-edit-question/shared-question.service';
import { WorkFlowService } from '../work-flow.service';

@Injectable()
export class SurveyQuestionSetService extends AbstractComponentService {

  OpenQuestionSetModal$: Observable<boolean>;
  private OpenQuestionSetModalSubject: BehaviorSubject<boolean>;

  IsAddQuestionsVisibe$: Observable<boolean>;
  private IsAddQuestionsVisibeSubject: BehaviorSubject<boolean>;

  IsSaveClicked$: Observable<boolean>;
  private IsSaveClickedSubject: BehaviorSubject<boolean>;

  Questions$: Observable<PreServiceQuestion[]>;
  private QuestionsSubject: BehaviorSubject<PreServiceQuestion[]>;

  QuestionTabSelected$: Observable<boolean>;
  private QuestionTabSelectedSubject: BehaviorSubject<boolean>;

  supportedLanguageList$: Observable<SupportedLanguage[]>;
  QuestionSets$: Observable<SurveyQuestionSet[]>;

  supportedLanguages = [];
  AddEditQuestionSetForm: FormGroup;
  QuestionSetName : FormControl;
  UpdateActionIndex: number;
  QuestionMode = Mode.Add;

  get AddEditQuestionSetIdFormControl() {
    return this.AddEditQuestionSetForm.get('id');
  }

  constructor(
    private workFlowService: WorkFlowService,
    private sharedQuestionService: SharedQuestionService,
  ) {
    super();
    this.InitSubjectsAndObservables();
    this.SubscribeSupportedLanguages();
    this.InitFormGroup();
  }

  GetQuestionSetIndex(questionSetId: string) {
    return this.workFlowService.GetQuestionSetIndex(questionSetId);
  }

  SetEditFormGroup(questionset: SurveyQuestionSet) {

    this.AddEditQuestionSetForm.patchValue({
      id: questionset.id,
      questionSetName: questionset.questionSetName,
    });
  }

  SelectQuestionTab() {
    this.QuestionTabSelectedSubject.next(true);
  }

  OpenModal() {
    let a = this.AddEditQuestionSetForm;
    this.OpenQuestionSetModalSubject.next(true);
  }

  CloseModalAndReset() {
    this.OpenQuestionSetModalSubject.next(false);
    this.sharedQuestionService.AddEditQuestionForm.reset();
    this.AddEditQuestionSetForm.reset();
    this.AddEditQuestionSetForm.controls.id.reset();
    this.QuestionsSubject.next([]);
  }

  InitRequiredAddQuestionConfigurations() {
    this.QuestionMode = Mode.Add;
    this.sharedQuestionService.ResetForm();
    this.sharedQuestionService.SubscribeFormValueChangeEvent();
    this.sharedQuestionService.SetDefaultFormGroup();
    this.sharedQuestionService.SetSupportedLanguagePreQuestionFormArray();
    this.sharedQuestionService.SetSupportedLanguageOptionFormArray()
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

  DeleteQuestion(id: string, setId: string) {
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
      this.workFlowService.AddSurveyQuestionSet(questionSetObject);
      this.CloseModalAndReset();
    }
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
    this.workFlowService.EditSurveyQuestionSet(questionSetObject);
    this.CloseModalAndReset();
  }

  Delete(id: string): void {
    const IsQuestionSetIsAlreadyInUseByService = this.IsQuestionSetIsAlreadyInUseByService(id);
    if (IsQuestionSetIsAlreadyInUseByService) {
      this.AppNotificationService.NotifyError(WorkflowMessages.QuestionSetsAlreadyInUseMessageByService);
      return
    }
    if (confirm(WorkflowMessages.ConfirmDeleteMessage)) {
        this.workFlowService.DeleteSurveyQuestionSet(id);
    }
  }

  IsQuestionSetIsAlreadyInUseByService(id: string) {
    return this.workFlowService.GetServices()
      .some(service => service.surveyTemplate !== null && service.surveyTemplate.id === id && !service.isDeleted);
  }

  GetQuestionTypes(): IDropdown[] {
    return this.sharedQuestionService.GetQuestionTypes();
  }



  IsQuestionsEmpty() {
    return !this.QuestionsSubject.value || this.QuestionsSubject.value.length === 0;
  }


  changeListData(data: any) {
    this.QuestionsSubject.next(data);
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

    this.supportedLanguageList$ = this.workFlowService.SupportedLanguages$;
    this.QuestionSets$ = this.workFlowService.SurveyQuestionSets$;
  }

  private SubscribeSupportedLanguages() {
    this.subs.sink = this.supportedLanguageList$.subscribe(languages => {
      this.supportedLanguages = languages;
    });
  }

  private InitFormGroup() {
    this.AddEditQuestionSetForm = this.workFlowService.InitAddEditSurveyQuestionSetForm()
  }


  private InitRequiredEditQuestionConfigurations() {
    this.QuestionMode = Mode.Edit;
    this.sharedQuestionService.SubscribeFormValueChangeEvent();
    this.sharedQuestionService.SetSupportedLanguagePreQuestionFormArray();
    this.sharedQuestionService.SetSupportedLanguageOptionFormArray();
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

  private GetQuestionSetIdAndName() {
    return {
      id: this.AddEditQuestionSetForm.get('id').value,
      questionSetName: this.AddEditQuestionSetForm.get('questionSetName').value
    };
  }

  private GetQuestionSetObject(response: any, id: string): SurveyQuestionSet {
    return {
      id,
      questionSetName: response.questionSetName,
      questions: getArrayValueIfNotEmptyElseNull(this.QuestionsSubject.value),
    };
  }

}


