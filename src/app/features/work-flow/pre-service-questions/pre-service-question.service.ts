import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { WorkflowMessages } from '../message-constant';
import { IPreServiceQuestionFormGroup } from '../models/pre-service-question-form-group.interface';
import { SupportedLanguage } from '../models/supported-language';
import { PreServiceQuestion } from '../models/work-flow-request.interface';
import {
  PreServiceQuestion as PreServiceQuestionResponse
} from '../../../models/common/work-flow-detail.interface';
import { SharedQuestionService } from '../shared-add-edit-question/shared-question.service';
import { WorkFlowService } from '../work-flow.service';

@Injectable()
export class PreServiceQuestionService extends AbstractComponentService {
  changeListData(data: any) {
    this.workFlowService.PreServiceQuestionsSubject.next(data);
  }

  preServiceQuestionList$: Observable<PreServiceQuestionResponse[]>;
  SupportedLanguageList$: Observable<SupportedLanguage[]>;
  openQuestionDial$: Observable<boolean>;
  openQuestionDialSubject: BehaviorSubject<boolean>;

  constructor(
    private workFlowService: WorkFlowService,
    private sharedQuestionService: SharedQuestionService,
  ) {
    super();
    this.InitSubjectsAndObservables();
  }

  private InitSubjectsAndObservables() {
    this.preServiceQuestionList$ = this.workFlowService.PreServiceQuestions$;
    this.SupportedLanguageList$ = this.workFlowService.SupportedLanguages$;
    this.openQuestionDialSubject = new BehaviorSubject<boolean>(false);
    this.openQuestionDial$ = this.openQuestionDialSubject.asObservable();
  }

  SetEditData(preServiceQuestion) {
    this.sharedQuestionService.SetEditFormGroup(preServiceQuestion);
  }

  CloseModalAndResetForm() {
    this.openQuestionDialSubject.next(false);
    this.sharedQuestionService.AddEditQuestionForm.reset();
    this.sharedQuestionService.AddEditQuestionForm.controls.isVisible.enable();

  }

  OpenModalAndInitAddConfigurations() {
    this.InitRequiredAddConfigurations();
    this.OpenModal();
  }

  private InitRequiredAddConfigurations() {
    this.sharedQuestionService.SubscribeFormValueChangeEvent();
    this.sharedQuestionService.SetDefaultFormGroup();
    this.sharedQuestionService.SetSupportedLanguagePreQuestionFormArray();
    this.sharedQuestionService.SetSupportedLanguageOptionFormArray();
    this.sharedQuestionService.EnableDisableIsDisplay();
  }

  OpenModalAndInitEditConfigurations() {
    this.InitRequiredEditConfigurations();
    this.OpenModal();
  }

  private InitRequiredEditConfigurations() {
    this.sharedQuestionService.SubscribeFormValueChangeEvent();
    this.sharedQuestionService.SetSupportedLanguagePreQuestionFormArray();
    this.sharedQuestionService.SetSupportedLanguageOptionFormArray()
  }

  private OpenModal() {
    this.openQuestionDialSubject.next(true);
  }

  Add(request: FormGroup): void {

    let shortName = request.get('shortName').value;
    shortName = shortName ? shortName.toLowerCase().trim():"";
    const shortNameAlreadyExist = this.workFlowService.GetPreServiceQuestions()
      .some(preServiceQuestion => preServiceQuestion.shortName.toLowerCase().trim() === shortName && !preServiceQuestion.isDeleted);

    if (shortNameAlreadyExist) {
      request.get('shortName').setErrors({isExists:true});
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
        const preServiceQuestionRequest = this.GetPreServiceQuestionRequest(response, this.uuid);
        this.workFlowService.AddPreQuestion(preServiceQuestionRequest);
        this.CloseModalAndResetForm();
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
      });
  }

  private GetPreServiceQuestionRequest(response: IPreServiceQuestionFormGroup, id: string): PreServiceQuestion {
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

  Edit(request: FormGroup): void {

    const id = request.get('id').value;
    let shortName = request.get('shortName').value;
    shortName = shortName ? shortName.toLowerCase().trim():"";
    const shortNameAlreadyExist = this.workFlowService.GetPreServiceQuestions()
      .some(preServiceQuestion => preServiceQuestion.shortName.toLowerCase().trim() === shortName && preServiceQuestion.id !== id && !preServiceQuestion.isDeleted);

    if (shortNameAlreadyExist) {
      request.get('shortName').setErrors({isExists:true});
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
        const preServiceQuestionRequest = this.GetPreServiceQuestionRequest(response, response.id);
        this.workFlowService.EditPreQuestion(preServiceQuestionRequest);
        this.CloseModalAndResetForm();
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
      });;
  }

  Delete(id: string): void {
    this.workFlowService.DeletePreQuestion(id);
  }


  GetQuestionTypes() {
    return this.sharedQuestionService.GetQuestionTypes();
  }

}
