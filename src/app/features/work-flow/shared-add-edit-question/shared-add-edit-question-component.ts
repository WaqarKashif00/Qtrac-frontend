import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { PreServiceQuestion } from 'src/app/models/common/work-flow-detail.interface';
import { Mode } from 'src/app/models/enums/mode.enum';
import { WorkflowValidationMessage } from 'src/app/models/validation-message/workflow-message';
import { WorkflowMessages } from '../message-constant';
import { SupportedLanguage } from '../models/supported-language';
import { SharedQuestionService } from './shared-question.service';

@Component({
  selector: 'lavi-shared-add-edit-question',
  templateUrl: './shared-add-edit-question-component.html',
  styleUrls: ['./shared-add-edit-question-component.scss', '../work-flow-configuration/work-flow-configuration.component.scss']
})
export class SharedAddEditQuestionComponent extends AbstractComponent implements OnChanges {
  @Input() supportedLanguageList: SupportedLanguage[];
  @Output() Cancel: EventEmitter<void> = new EventEmitter();
  @Output() Save: EventEmitter<FormGroup> = new EventEmitter();
  @Input() Mode: string;
  @Input() IsCancelButtonVisible = true;
  @Input() IsOnlySaveButtonVisible = false;
  @Input() IsHideAllButton = false;
  @Input() IsSaveClicked: boolean;
  @Input() IsGlobalQuestion = true;
  ShowDisplayField$: Observable<boolean>;

  WorkflowMessage = WorkflowValidationMessage;
  listItems = [];
  OptionsMode: string = Mode.Add;
  PreServiceQuestions$: Observable<PreServiceQuestion[]>;
  get IsDisplayChanged(): boolean{
    return this.sharedQuestionService.IsDisplayChanged;
  }
  get QuestionTypeFormControlValue() {
    const typeFormControl = this.AddEditQuestionForm.get('type');
    return typeFormControl.value ? typeFormControl.value.value : '';
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes.IsSaveClicked && changes.IsSaveClicked.currentValue){
              this.AddEditQuestion();
    }
    if (changes.IsGlobalQuestion && changes.IsGlobalQuestion.currentValue){
      if (!this.IsGlobalQuestion){
        this.IsGlobalQuestion = changes.IsGlobalQuestion.currentValue;
      }
    }
  }


  get OptionVisible() {
    return this.sharedQuestionService.IsOptionQuestionType(this.QuestionTypeFormControlValue);
  }
  get MaxLengthVisible() {
    return this.sharedQuestionService.IsMaxLengthQuestionType(this.QuestionTypeFormControlValue);
  }
  get MinMaxVisible() {
    return this.sharedQuestionService.IsMinMaxQuestionType(this.QuestionTypeFormControlValue);
  }
  get AddEditQuestionForm() {
    return this.sharedQuestionService.AddEditQuestionForm;
  }
  get OptionArray() {
    return this.sharedQuestionService.OptionArray;
  }
  get SupportedQuestionArray() {
    return this.sharedQuestionService.questionsArray;
  }

  get SupportedOptionsArray(){
    return this.sharedQuestionService.OptionControlArray;
  }
  get IsOptionErrorVisible() {
    return this.sharedQuestionService.IsOptionErrorVisible;
  }
  get isEditable() {
    return this.sharedQuestionService.IsOptionEditable;
  }

  constructor(private sharedQuestionService: SharedQuestionService) {
    super();
    this.listItems = this.sharedQuestionService.GetQuestionTypes();
    this.PreServiceQuestions$ = this.sharedQuestionService.PreServiceQuestions$;
  }

  get PreServiceQuestionsSubject(){
    return this.sharedQuestionService.PreServiceQuestionsSubject;
  }

  onOptionsSelected({ value }) {
    this.sharedQuestionService.IsOptionsDirty = false;
  }

  onRequiredCheckChange(event) {
    const isRequiredChecked: boolean = this.AddEditQuestionForm.controls.isRequired.value;
    if (isRequiredChecked) {
      this.AddEditQuestionForm.controls.isVisible.disable({ emitEvent: false });
    }
    else {
      this.AddEditQuestionForm.controls.isVisible.enable({ emitEvent: true });
    }
    this.AddEditQuestionForm.controls.isVisible.setValue(isRequiredChecked === true ? true : false);

  }

  get updateOptionIndex(){
    return this.sharedQuestionService.updateOptionIndex;
  }

  AddEditQuestion() {
    this.sharedQuestionService.IsOptionsDirty = true;
    this.Save.emit(this.AddEditQuestionForm);
  }

  AddOption() {
    this.OptionsMode = Mode.Add;
    this.sharedQuestionService.AddOption();
  }

  DeleteOption(index: number): void {
    if (confirm(WorkflowMessages.ConfirmDeleteMessage)) {
      this.sharedQuestionService.DeleteOption(index);
    }
  }

  EditOption(index: number): void {
    this.OptionsMode = Mode.Edit;
    this.sharedQuestionService.EditOption(index);
  }

  UpdateOption() {
    this.sharedQuestionService.UpdateOption();
  }

  CancelQuestion() {
    this.OptionsMode = Mode.Add;
    this.SupportedOptionsArray.clear();
    this.Cancel.emit();
  }

  translate(question: string, isQuestion: boolean){
    this.sharedQuestionService.translate(question, isQuestion);
  }

  OnIsDisplayChanges(): void{
    this.sharedQuestionService.OnIsDisplayChanges();
  }

}
