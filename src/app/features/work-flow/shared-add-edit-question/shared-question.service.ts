import { Injectable } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { TranslateService } from '../../../core/services/translate.service';
import { MaxlengthQuestionTypes, MinMaxQuestionTypes, OptionQuestionTypes } from '../different-question-types';
import { IDropdown } from '../models/dropdown.interface';
import { SupportedLanguage } from '../models/supported-language';
import { PreServiceQuestion } from '../models/work-flow-request.interface';
import { Option, Question } from '../../../models/common/work-flow-detail.interface';
import { WorkFlowService } from '../work-flow.service';
import { MaxLengthGreaterThenMinLengthValidator } from '../workflow.validators';

@Injectable()
export class SharedQuestionService extends AbstractComponentService {

  AddEditQuestionForm: FormGroup;
  supportedLanguages = [];
  IsOptionsDirty = false;
  updateOptionIndex: number = null ;
  IsOptionEditable = false;
  SupportedLanguageList$: Observable<SupportedLanguage[]>;
  PreServiceQuestions$: Observable<PreServiceQuestion[]>;

  IsEditMode = false;
  count = 0;
  OptionControlArray: FormArray;
  IsDisplayChanged = false;
  get questionsArray() {
    return this.AddEditQuestionForm.get('question') as FormArray;
  }
  get OptionArray() {
    return this.AddEditQuestionForm.get('options') as FormArray;
  }

  get IsOptionErrorVisible() {
    return this.IsOptionsDirty && this.OptionArray.hasError('required');
  }

  constructor(private workFlowService: WorkFlowService, private translateService: TranslateService) {
    super();
    this.InitSubjectsAndObservables();
    this.SubscribeSupportedLanguages();
    this.InitFormGroup();
  }

  private InitSubjectsAndObservables() {
    this.SupportedLanguageList$ = this.workFlowService.SupportedLanguages$;
    this.PreServiceQuestions$ = this.workFlowService.PreServiceQuestions$;
  }

  private SubscribeSupportedLanguages() {
    this.subs.sink = this.SupportedLanguageList$.subscribe(languages => {
      this.supportedLanguages = languages ;
    });
  }

  get PreServiceQuestionsSubject(){
    return this.workFlowService.PreServiceQuestionsSubject;
  }
  private InitFormGroup() {
      this.IsDisplayChanged = false;
      this.OptionControlArray = this.formBuilder.array([]);
      this.AddEditQuestionForm = this.formBuilder.group({
        id: [],
        type: [null, Validators.required],
        shortName: [null, Validators.required],
        question: this.formBuilder.array([]),
        maxLength: [],
        option: this.OptionControlArray,
        options: this.formBuilder.array([]),
        min: [],
        max: [],
        isRequired: [],
        isPersonalIdentifier: [],
        isPurge: [],
        isVisible: [true],
        isDisplay: [],
      });
      this.AddEditQuestionForm.controls.type.valueChanges.subscribe(
        x => {
          if ((x?.value != QuestionType.DropDown.value) &&
          (x?.value != QuestionType.MultiSelect.value) && (x?.value != QuestionType.Options.value)){
            const fa = this.AddEditQuestionForm.controls.option as FormArray;
            fa.controls.forEach(element => {
              const fg = element as FormGroup;
              fg.controls.option.setValue(null);
              this.IsOptionEditable = false;
              this.updateOptionIndex = null;
            });
          }
        }
      );
      this.SetSupportedLanguageOptionFormArray();
  }

  public EnableDisableIsDisplay() {
    const questionCount = this.PreServiceQuestionsSubject.value.filter(question => question.isDisplay && !(question.isDeleted)).length;
    const isDisplayControl = this.AddEditQuestionForm.controls.isDisplay;
    if (isDisplayControl.value){
      this.EnableControl(isDisplayControl);
      return;
    }
    this.EnableDisableControlBasedOnQuestionIsDisplayProperty(questionCount, isDisplayControl);
  }

  private EnableDisableControlBasedOnQuestionIsDisplayProperty(questionCount: number, isDisplayControl) {
    if (questionCount < 5) {
      this.EnableControl(isDisplayControl);
    }
    else {
      this.DisableControl(isDisplayControl);
    }
  }

  private EnableControl(control) {
    control.enable({ emitEvent: false });
  }

  private DisableControl(control) {
    control.disable({ emitEvent: false });
  }

  SetEditFormGroup(preServiceQuestion: PreServiceQuestion) {
    this.IsEditMode = true;
    this.IsDisplayChanged = false;
    this.count = 0;
    this.AddEditQuestionForm.patchValue({
      id: preServiceQuestion.id,
      type: this.GetTypeObject(preServiceQuestion.type),
      shortName: preServiceQuestion.shortName,
      question: preServiceQuestion.question,
      maxLength: this.GetMaxlength(preServiceQuestion),
      option: [],
      options: preServiceQuestion.options ? preServiceQuestion.options : [],
      min: this.GetNumberTypeSettingByName(preServiceQuestion, 'min'),
      max: this.GetNumberTypeSettingByName(preServiceQuestion, 'max'),
      isRequired: preServiceQuestion.isRequired,
      isPersonalIdentifier: preServiceQuestion.isPersonalIdentifier,
      isPurge: preServiceQuestion.isPurge,
      isVisible: preServiceQuestion.isVisible,
      isDisplay: preServiceQuestion.isDisplay,
    });

    this.SetPropertyValue(this.AddEditQuestionForm.controls.isRequired.value,
      this.AddEditQuestionForm.controls.isVisible.value,
      this.AddEditQuestionForm.controls.isDisplay.value);

    this.SetOptionsFormArray(preServiceQuestion);
    this.SetPreServiceQuestionFormArray(preServiceQuestion.question);
    this.EnableDisableIsDisplay();
  }

  private SetPropertyValue(isRequiredCheck: boolean, isVisibleCheck: boolean, isDisplayCheck: boolean ) {
    if (isRequiredCheck && isVisibleCheck){
      this.AddEditQuestionForm.controls.isVisible.disable({emitEvent: false});
    }
    else{
      this.AddEditQuestionForm.controls.isVisible.enable({ emitEvent: true });
    }
  }

  private GetTypeObject(type: any) {
    if (!type) { return null; }
    return this.GetQuestionTypes().find(questionType => questionType.value === type) ?? {};
  }

  private GetMaxlength(preServiceQuestion) {
    const questionType = preServiceQuestion.type;
    return MaxlengthQuestionTypes.includes(questionType) ? preServiceQuestion.typeSetting : null;
  }

  private GetNumberTypeSettingByName(preServiceQuestion, field: string) {
    const questionType = preServiceQuestion.type;
    if (MinMaxQuestionTypes.includes(questionType) && field === 'max') {
      return preServiceQuestion.typeSetting.max;
    }
    if (MinMaxQuestionTypes.includes(questionType) && field === 'min') {
      return preServiceQuestion.typeSetting.min;
    }
    return null;
  }

  private SetOptionsFormArray(preServiceQuestion) {
    const questionType = preServiceQuestion.type;

    const optionsArray = OptionQuestionTypes.includes(questionType)
      ? preServiceQuestion.typeSetting ?? [] : [];
    const optionsFormArray = this.AddEditQuestionForm.get('options') as FormArray;
    optionsFormArray.clear();

    optionsArray.forEach((optionArray: Array<Option>) => {
      const fa = this.formBuilder.array([]);
      this.supportedLanguages.forEach((language: SupportedLanguage) => {
        fa.push(this.formBuilder.group({
            languageId: [language.languageCode],
            languageName: [language.language],
            isDefault: [language.isDefault],
            option: [null, {
              validators: Validators.required,
            }],
        }));
      });
      optionArray.forEach((option: Option) => {
          fa.controls.forEach((form: FormGroup) => {
            if (form.value.languageId == option.languageId){
              form.controls.option.setValue(option.option);
            }
          });
        });
      optionsFormArray.push(fa);
    });

    optionsFormArray.controls.forEach((options: FormArray, ) => {
      if (options.value && Array.isArray(options.value)) {
        options.controls.forEach((option: FormGroup, index: number) => {
          let currentLanguageExist = false;
          this.supportedLanguages.forEach((language: SupportedLanguage) => {
            if (language.languageCode == option.value.languageId) {
              option.controls.isDefault.setValue(language.isDefault);
              currentLanguageExist = true;
            }
          });
          if (currentLanguageExist == false){
            options.removeAt(index);
          }
        });
      }
    });
  }

  private SetPreServiceQuestionFormArray(questions: Question[]) {
    this.questionsArray.clear();

    this.setDefaultQuestionerArray(this.questionsArray);
    if (questions && Array.isArray(questions) && questions[0]) {
      questions.forEach((question: Question) => {
        this.questionsArray.controls.forEach((form: FormGroup) => {
          if (form.value.languageId == question.languageId){
            form.controls.languageId.setValue(question.languageId);
            form.controls.languageName.setValue(question.languageName);
            form.controls.question.setValue(question.question);
          }
        });
      });
    }
  }
  setDefaultQuestionerArray(form: FormArray) {
    this.supportedLanguages.forEach((x: SupportedLanguage) => {
      form.push(this.formBuilder.group({
        languageId: [x.languageCode],
          languageName: [x.language],
          isDefault: [x.isDefault],
          question: [null, Validators.required],
      }));
    });
  }

  SetPreServiceOptionFormArray(options){
    this.OptionControlArray.clear();
    if (options) {
      options.forEach((option) => {
        this.OptionControlArray.push(
          this.formBuilder.group({
            languageId: [option.languageId],
            languageName: [option.languageName],
            isDefault: [option.isDefault],
            option: [option.option, Validators.required],
          })
        );
      });
  }
    this.AddEditQuestionForm.controls.option;
}
  translate(text: string, isQuestion: boolean){
    if (text){
      this.subs.sink = this.translateService.GetTranslatedTexts(text).subscribe(TranslateResponses => {

        if (TranslateResponses && TranslateResponses.length !== 0) {
          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < TranslateResponses.length; index++) {
            const TranslateRes = TranslateResponses[index];
            // tslint:disable-next-line: prefer-for-of
            if (isQuestion){
              for (let ind = 0; ind < this.questionsArray.length; ind++) {
                const questionsFormGroup = this.questionsArray.at(ind) as FormGroup;
                if (ind !== 0 && TranslateRes.languageId === questionsFormGroup.get('languageId').value) {
                  questionsFormGroup.get('question').setValue(TranslateRes.translatedText);
                }
              }
            }else{
              for (let ind = 0; ind < this.OptionControlArray.length; ind++) {
                const optionsFormGroup = this.OptionControlArray.at(ind) as FormGroup;
                if (ind !== 0 && TranslateRes.languageId === optionsFormGroup.get('languageId').value) {
                  optionsFormGroup.get('option').setValue(TranslateRes.translatedText);
                }
              }
            }

          }
        }
      });
    }

  }

  SubscribeFormValueChangeEvent() {
    const questionTypeFormControl = this.AddEditQuestionForm.get('type');
    const maxLengthFormControl = this.AddEditQuestionForm.get('maxLength');
    const minFormControl = this.AddEditQuestionForm.get('min');
    const maxFormControl = this.AddEditQuestionForm.get('max');

    this.subs.sink = questionTypeFormControl.valueChanges.subscribe((type: IDropdown) => {
      const value = type ? type.value : '';
      // this.OptionControlArray.reset();
      if (MaxlengthQuestionTypes.includes(value)) {
        maxLengthFormControl.setValidators(Validators.required);
      } else {
        maxLengthFormControl.reset();
        maxLengthFormControl.setValidators(null);
      }

      if (MinMaxQuestionTypes.includes(value)) {
        minFormControl.setValidators(Validators.required);
        maxFormControl.setValidators(Validators.required);
        this.AddEditQuestionForm.setValidators(MaxLengthGreaterThenMinLengthValidator);
      } else {
        minFormControl.reset();
        minFormControl.setValidators(null);
        maxFormControl.reset();
        maxFormControl.setValidators(null);
        this.AddEditQuestionForm.setValidators(null);
      }

      if (OptionQuestionTypes.includes(value)) {
        this.OptionArray.setValidators(Validators.required);
      } else {
        this.OptionArray.reset();
        this.OptionArray.clear();
        this.OptionArray.setValidators(null);
      }
      maxLengthFormControl.updateValueAndValidity();
      minFormControl.updateValueAndValidity();
      maxFormControl.updateValueAndValidity();
      this.OptionArray.updateValueAndValidity();
      this.AddEditQuestionForm.updateValueAndValidity();
    });
  }

  SetDefaultFormGroup() {
    this.AddEditQuestionForm.patchValue({
      id: null,
      type: null,
      shortName: null,
      question: [],
      maxLength: null,
      option: [],
      options: [],
      min: null,
      max: null,
      isRequired: null,
      isPersonalIdentifier: null,
      isPurge: null,
      isVisible: true,
      isDisplay: null,
    });
  }

  SetSupportedLanguagePreQuestionFormArray() {
    const questions: Question[] = [];
    if (this.supportedLanguages) {
      this.supportedLanguages.forEach(language => {
        questions.push(
          {
            isDefault: language.isDefault,
            languageId: language.languageCode,
            languageName: language.language,
            question: null
          });
      });
    }
    this.SetPreServiceQuestionFormArray(questions);
  }

  SetSupportedLanguageOptionFormArray(){
    const options: Option[] = [];
    if (this.supportedLanguages) {
      this.supportedLanguages.forEach(language => {
        options.push(
          {
            isDefault: language.isDefault,
            languageId: language.languageCode,
            languageName: language.language,
            option: null
          });
      });
    }
    this.SetPreServiceOptionFormArray(options);
  }


  GetQuestionTypes(): IDropdown[] {
    const questionTypes = [];
    for (const [propertyKey, propertyValue] of Object.entries(QuestionType)) {
      questionTypes.push({ value: propertyValue.value, text: propertyValue.display });
    }
    return questionTypes;
  }

  AddOption() {
    this.IsOptionEditable = false;
    const fa = this.OptionControlArray.controls.forEach(
      (x: FormGroup) => {
        x.controls.option.setValidators(Validators.required);
      }
    );
    this.OptionControlArray.updateValueAndValidity();
    if (this.OptionControlArray.valid){
      const formarray = this.formBuilder.array([]);
      this.OptionControlArray.controls.forEach((option: FormGroup) => {
        formarray.push(
          this.formBuilder.group({
            languageId: [option.value.languageId],
            languageName: [option.value.languageName],
            isDefault: [option.value.isDefault],
            option: [option.value.option, Validators.required
            ],
          })
        );
      });
      this.OptionArray.push(formarray);
      this.SetSupportedLanguageOptionFormArray();
    }else{
      this.OptionControlArray.controls.forEach((option: FormGroup) => {
        this.formService.CallFormMethod(option).then(x => {});
      });
    }

  }

  DeleteOption(index: number): void {
    this.OptionArray.removeAt(index);
  }

  EditOption(index: number): void {
    this.updateOptionIndex = index;
    const Editableoption = this.OptionArray.at(index).value?.sort((currentLanguage, nextLanguage) => {
      return (currentLanguage.isDefault === nextLanguage.isDefault) ? 0 : currentLanguage.isDefault ? -1 : 1;
    });
    this.OptionControlArray.setValue(Editableoption);
    this.IsOptionEditable = true;
  }

  UpdateOption() {
    const fa = this.OptionControlArray.controls.forEach(
      (x: FormGroup) => {
        x.controls.option.setValidators(Validators.required);
      }
    );
    this.OptionControlArray.updateValueAndValidity();
    if (this.OptionControlArray.valid){
      const updatedText = this.OptionControlArray.value;
      this.OptionArray.at(this.updateOptionIndex).setValue(updatedText);
      this.SetSupportedLanguageOptionFormArray();
      this.IsOptionEditable = false;
      this.updateOptionIndex = null;
    }else{
      this.OptionControlArray.controls.forEach((option: FormGroup) => {
        this.formService.CallFormMethod(option).then(x => {});
      });
    }

  }

  IsMaxLengthQuestionType(questionType: string): boolean {
    return MaxlengthQuestionTypes.includes(questionType);
  }

  IsMinMaxQuestionType(questionType: string): boolean {
    return MinMaxQuestionTypes.includes(questionType);
  }

  IsOptionQuestionType(questionType: string): boolean {
    return OptionQuestionTypes.includes(questionType);
  }

  ResetForm() {
    this.AddEditQuestionForm.reset();
    this.AddEditQuestionForm.controls.isVisible.enable();

  }

  OnIsDisplayChanges(){
    this.IsDisplayChanged = true;
  }

}
