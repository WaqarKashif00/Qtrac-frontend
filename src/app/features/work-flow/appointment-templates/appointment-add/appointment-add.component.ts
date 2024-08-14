import { Component, EventEmitter, Input, Output, SecurityContext } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { DompurifySanitizer } from 'src/app/core/services/dompurify.service';
import { WorkflowConstants } from 'src/app/models/constants/basic-workflow-rules-constants';
import { EditorConfig } from 'src/app/models/constants/editor-config.constant';
import { WorkflowValidationMessage } from 'src/app/models/validation-message/workflow-message';
import { IMobileDropdown } from '../../models/appointment-rule';
import { AppointmentTemplateService } from '../appointment-template.service';

@Component({
  selector: 'lavi-appointment-template-add',
  templateUrl: './appointment-add.component.html',
  styleUrls: ['./appointment-add.component.scss', '../../work-flow-configuration/work-flow-configuration.component.scss']
})
export class AppointmentTemplateAddComponent extends AbstractComponent {
  @Input() OpenAppointmentDialog: boolean;
  @Input() Mode: string;
  @Output() SaveForm: EventEmitter<FormGroup> = new EventEmitter();
  @Output() Close: EventEmitter<void> = new EventEmitter();
  WorkflowMessage = WorkflowValidationMessage;
  EditorConfig = EditorConfig;
  quietHoursDropdown = WorkflowConstants.QuietHours;
  remindsViaDropdown = WorkflowConstants.RemindsVia;
  remindsInDropdown = WorkflowConstants.RemindsIn;
  reminderTypeDropdown = WorkflowConstants.ReminderPeriodTypes;
  bookInAdvanceTypeDropDown = WorkflowConstants.BookInAdvanceTypes;
  defaultValues = WorkflowConstants.DefaultValueDropdown;
  skipKeys: string[] = ['%'];

  
  get AddAppointmentForm() {
    return this.appointmentService.AddAppointmentForm;
  }

  get ConfirmationEmailArray(){
    return this.appointmentService.ConfirmationEmailArray;
  }

  get VerificationEmailArray(){
    return this.appointmentService.VerificationEmailArray
  }

  get VerificationSMSArray(){
    return this.appointmentService.VerificationSMSArray
  }

  get ConfirmationSMSArray(){
    return this.appointmentService.ConfirmationSMSArray;
  }

  get AppointmentCancelEmailArray(){
    return this.appointmentService.AppointmentCancelEmailArray;
  }

  get AppointmentCancelSMSArray(){
    return this.appointmentService.AppointmentCancelSMSArray;
  }

  get AppointmentUpdateEmailArray(){
    return this.appointmentService.AppointmentUpdateEmailArray;
  }

  get AppointmentUpdateSMSArray(){
    return this.appointmentService.AppointmentUpdateSMSArray;
  }

  get RemindersFormArray(){
    return  this.appointmentService.RemindersArray;
  }

  get isCancelledEmailTranslationValid(){
    return this.appointmentService.isCancelledEmailTranslationValid;
  }

  set isCancelledEmailTranslationValid(value: boolean){
    this.appointmentService.isCancelledEmailTranslationValid = value;
  }

  get isCancelledSMSTranslationValid(){
    return this.appointmentService.isCancelledSMSTranslationValid;
  }

  set isCancelledSMSTranslationValid(value: boolean){
    this.appointmentService.isCancelledSMSTranslationValid = value;
  }

  get isUpdateEmailTranslationValid(){
    return this.appointmentService.isUpdateEmailTranslationValid;
  }

  set isUpdateEmailTranslationValid(value: boolean){
    this.appointmentService.isUpdateEmailTranslationValid = value;
  }

  get isUpdateSMSTranslationValid(){
    return this.appointmentService.isUpdateSMSTranslationValid;
  }

  set isUpdateSMSTranslationValid(value: boolean){
    this.appointmentService.isUpdateSMSTranslationValid = value;
  }

  get isConfirmationEmailTranslationValid(){
    return this.appointmentService.isConfirmationEmailTranslationValid;
  }

  set isConfirmationEmailTranslationValid(value: boolean){
    this.appointmentService.isConfirmationEmailTranslationValid = value;
  }

  get isConfirmationSMSTranslationValid(){
    return this.appointmentService.isConfirmationSMSTranslationValid;
  }

  set isConfirmationSMSTranslationValid(value: boolean){
    this.appointmentService.isConfirmationSMSTranslationValid = value;
  }

  get ConditionsName() {
    return this.appointmentService.DynamicVariablesList;
  }

  get isVerificationEmailTranslationValid(){
    return this.appointmentService.isVerificationEmailTranslationValid;
  }

  set isVerificationEmailTranslationValid(value: boolean){
    this.appointmentService.isVerificationEmailTranslationValid = value;
  }

  get isVerificationSMSTranslationValid(){
    return this.appointmentService.isVerificationSMSTranslationValid;
  }

  set isVerificationSMSTranslationValid(value: boolean){
    this.appointmentService.isVerificationSMSTranslationValid = value;
  }

  get MobileList():IMobileDropdown[]{
    return this.appointmentService.MobileList
  }
  findChoices = (searchText: string) => {
    return this.appointmentService.findChoices(searchText);
  };

  getChoiceLabel = (choice: string) => {
    let displayText = (this.ConditionsName as any)?.find((variable: any) => variable.shortName == choice)?.fieldName;
    return `%${displayText}%`;
  }
  
  constructor(private appointmentService: AppointmentTemplateService, private dompurifySanitizer: DompurifySanitizer) {
    super();
  }

  public OnSMSSelectionChanged(formArray: FormArray, value: boolean){
    this.appointmentService.OnSMSSelectionChanged(formArray, value);
  }

  public OnEmailSelectionChanged(formArray: FormArray, value: boolean){
    this.appointmentService.OnEmailSelectionChanged(formArray, value);
  }
  public SaveAppointmentTemplate() {
    this.SaveForm.emit(this.AddAppointmentForm);
  }

  UpdateEmailTemplateFormArray(index: number, value: string,EmailTemplateFormArray:FormArray) {
    if(value && value.includes('<angular-editor-toolbar') && value.includes('angular-editor-toolbar-set')) {
      return;
    }

    const santizedHTMLvalue = this.dompurifySanitizer.sanitize(SecurityContext.HTML,value);
    EmailTemplateFormArray.controls[index].get('emailTemplate').setValue(santizedHTMLvalue);
  }


  Cancel() {
    this.Close.emit();
  }

  addReminder(){
    this.appointmentService.addReminderForm();
  }

  deleteReminder(index: number){
    this.appointmentService.removeReminderForm(index);
  }

  OnQuiteHoursChange(value: boolean){
      if (!value && (value === false || value == null)){
        this.AddAppointmentForm.controls.from.enable();
        this.AddAppointmentForm.controls.to.enable();
        this.AddAppointmentForm.controls.to.setValidators(Validators.required);
        this.AddAppointmentForm.controls.from.setValidators(Validators.required);
        this.AddAppointmentForm.controls.from.updateValueAndValidity();
        this.AddAppointmentForm.controls.to.updateValueAndValidity();
      }else{
        this.AddAppointmentForm.controls.from.clearValidators();
        this.AddAppointmentForm.controls.to.clearValidators();
        this.AddAppointmentForm.controls.from.updateValueAndValidity();
        this.AddAppointmentForm.controls.to.updateValueAndValidity();
        this.AddAppointmentForm.controls.from.disable();
        this.AddAppointmentForm.controls.to.disable();
      }
      this.AddAppointmentForm.controls.from.reset();
      this.AddAppointmentForm.controls.to.reset();
  }

  translate(text: string, formarray: FormArray, templatePropertyName?: string, EmailSubject?: string, subjectControlName?: string){
    this.appointmentService.translate(text, formarray, templatePropertyName, EmailSubject, subjectControlName);
  }

  
}
