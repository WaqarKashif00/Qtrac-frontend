import { Injectable } from "@angular/core";
import { FormArray, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { BehaviorSubject, Observable } from "rxjs";
import { AbstractComponentService } from "src/app/base/abstract-component-service";
import { TranslateService } from "src/app/core/services/translate.service";
import { cloneObject } from "src/app/core/utilities/core-utilities";
import { WorkflowConstants } from "src/app/models/constants/basic-workflow-rules-constants";
import { Mode } from "src/app/models/enums/mode.enum";
import { IMobileDropdown } from "../models/appointment-rule";
import { SendSmsTemplate } from "../models/basic-workflow-behaviour-rule.interface";
import { SupportedLanguage } from "../models/supported-language";
import { AppointmentTemplate, AppointmentTemplateCommunicationReminders, EmailTemplate, ReminderTemplate } from "../models/work-flow-request.interface";
import { WorkFlowService } from "../work-flow.service";


@Injectable()
export class AppointmentTemplateService extends AbstractComponentService {
  changeListData(data: any) {
    this.workFlowService.AppointTemplateListSubject.next(data);
  }


  AddAppointmentForm: FormGroup;
  AppointmentTemplateList$: any;
  public OpenAppointmentTemplateDialog$: Observable<boolean>;
  public subjectOpenAppointTemplateDialog: BehaviorSubject<boolean>;
  Mode: string;
  RemindersArray: FormArray;
  VerificationEmailArray: FormArray;
  VerificationSMSArray: FormArray;
  ConfirmationEmailArray: FormArray;
  ConfirmationSMSArray: FormArray;
  SupportedLanguage: SupportedLanguage[];
  AppointmentUpdateEmailArray: FormArray;
  AppointmentUpdateSMSArray: FormArray;
  AppointmentCancelEmailArray: FormArray;
  AppointmentCancelSMSArray: FormArray;
  WorkflowConstants = WorkflowConstants;
  defaultValues = WorkflowConstants.DefaultValueDropdown;

  isConfirmationEmailTranslationValid:boolean=true;
  isConfirmationSMSTranslationValid:boolean=true;
  isVerificationEmailTranslationValid:boolean=true;
  isVerificationSMSTranslationValid:boolean=true;
  isUpdateEmailTranslationValid:boolean=true;
  isUpdateSMSTranslationValid:boolean=true;
  isCancelledEmailTranslationValid:boolean=true;
  isCancelledSMSTranslationValid:boolean=true;
  
  get DynamicVariablesList(){
    return this.workFlowService.DynamicVariablesList
  }

  get MobileList() : IMobileDropdown[]{
    return this.workFlowService.MobileList
  }
  constructor(
    private workFlowService: WorkFlowService,
    private translateService: TranslateService,
  ) {
    super();
    this.subs.sink = this.workFlowService.SupportedLanguages$.subscribe(
      x => {
        this.SupportedLanguage = x;
      }
    );
    this.InitFormGroup();
    this.InitSubjectAndObservables();
  }

  public InitFormGroup() {
    this.RemindersArray = this.formBuilder.array([
    ]);

    this.VerificationEmailArray = this.formBuilder.array([])
    this.VerificationSMSArray = this.formBuilder.array([])

    this.ConfirmationEmailArray = this.formBuilder.array([]);
    this.ConfirmationSMSArray = this.formBuilder.array([]);

    this.AppointmentUpdateEmailArray = this.formBuilder.array([]);
    this.AppointmentUpdateSMSArray = this.formBuilder.array([]);


    this.AppointmentCancelEmailArray = this.formBuilder.array([]);
    this.AppointmentCancelSMSArray = this.formBuilder.array([]);

    this.AddAppointmentForm = this.formBuilder.group({
      id: [],
      templateName: [null, Validators.required],
      mobileTemplate: [null, Validators.required],
      noOfPeopleInTimeSlot: [null, [Validators.required, Validators.pattern('^[0-9]*$'),this.nonZeroValidator]],
      durationOfEachTimeSlotInMinutes: [null, [Validators.required, Validators.pattern('^[0-9]*$'), this.nonZeroValidator],],
      bookInBefore: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      bookInBeforeType: [null, [Validators.required]],
      bookInAdvance: [null, [Validators.required, Validators.pattern('^[0-9]*$'), this.nonZeroValidator]],
      bookInAdvanceType: [null, [Validators.required]],
      earlyCheckInMinutes: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      lateCheckInMinutes: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],

      enableConfirmationEmailAfterRegistration: [null],
      confirmationEmail: this.ConfirmationEmailArray,
      enableConfirmationSMSAfterRegistration: [null],
      confirmationSMS: this.ConfirmationSMSArray,

      enableVerificationEmail: [null],
      verificationEmail: this.VerificationEmailArray,
      enableVerificationSMS: [null],
      verificationSMS: this.VerificationSMSArray,

      enableSendEmailOnAppointmentUpdate: [null],
      appointmentUpdateEmail: this.AppointmentUpdateEmailArray,
      enableSendSMSOnAppointmentUpdate: [null],
      appointmentUpdateSMS: this.AppointmentUpdateSMSArray,

      enableSendEmailOnAppointmentCancel: [null],
      appointmentCancelEmail: this.AppointmentCancelEmailArray,
      enableSendSMSOnAppointmentCancel: [null],
      appointmentCancelSMS: this.AppointmentCancelSMSArray,

      enableBCCBranchWithEveryRegistration: [null],

      reminders: this.RemindersArray,

      enableQuietHours: [null],
      from: [""],
      to: [""]
    }, { validator: this.checkTimeValidation });
  }
  nonZeroValidator(control) {
    const value = control.value;
    if (parseInt(value)) {
      return null;
    } else {
      return { nonZero: true, required: true};
    }
  }
  private setDefaultTemplateArrays() {
    this.ClearAllTemplateArrays();
    this.SupportedLanguage.forEach((x: SupportedLanguage) => {


      this.AddDataInEmailTemplateArray({
        emailSubject: null,
        emailTemplate: null,
        language: x.language,
        languageCode: x.languageCode,
        isDefault: x.isDefault
      },this.VerificationEmailArray);

      this.AddDatInSMSTemplateArray({
        language: x.language,
        languageCode: x.languageCode,
        isDefault: x.isDefault,
        smsTemplate: null
      }, this.VerificationSMSArray);


      this.AddDataInEmailTemplateArray({
        emailSubject: null,
        emailTemplate: null,
        language: x.language,
        languageCode: x.languageCode,
        isDefault: x.isDefault
      },this.ConfirmationEmailArray);

      this.AddDatInSMSTemplateArray({
        language: x.language,
        languageCode: x.languageCode,
        isDefault: x.isDefault,
        smsTemplate: null
      }, this.ConfirmationSMSArray);

      this.AddDataInEmailTemplateArray({
        emailSubject: null,
        emailTemplate: null,
        language: x.language,
        languageCode: x.languageCode,
        isDefault: x.isDefault
      },this.AppointmentUpdateEmailArray);

      this.AddDatInSMSTemplateArray({
        language: x.language,
        languageCode: x.languageCode,
        isDefault: x.isDefault,
        smsTemplate: null
      }, this.AppointmentUpdateSMSArray);

      this.AddDataInEmailTemplateArray({
        emailSubject: null,
        emailTemplate: null,
        language: x.language,
        languageCode: x.languageCode,
        isDefault: x.isDefault
      },this.AppointmentCancelEmailArray);

      this.AddDatInSMSTemplateArray({
        language: x.language,
        languageCode: x.languageCode,
        isDefault: x.isDefault,
        smsTemplate: null
      }, this.AppointmentCancelSMSArray);
    })
  }

  private ClearAllTemplateArrays() {
    this.VerificationEmailArray.clear();
    this.VerificationSMSArray.clear();
    this.ConfirmationEmailArray.clear();
    this.ConfirmationSMSArray.clear();
    this.AppointmentUpdateEmailArray.clear();
    this.AppointmentUpdateSMSArray.clear();
    this.AppointmentCancelEmailArray.clear();
    this.AppointmentCancelSMSArray.clear();
  }

  private SetDefaultEmailTemplateArray(formArray:FormArray) {
    formArray.clear();
    this.SupportedLanguage.forEach((x: SupportedLanguage) => {
      this.AddDataInEmailTemplateArray({
        emailSubject: null,
        emailTemplate: null,
        language: x.language,
        languageCode: x.languageCode,
        isDefault: x.isDefault
      },formArray);
    });
  }

  private SetDefaultSMSTemplateArray(formArray:FormArray) {
    formArray.clear()
    this.SupportedLanguage.forEach((x: SupportedLanguage) => {
      this.AddDatInSMSTemplateArray({
        language: x.language,
        languageCode: x.languageCode,
        isDefault: x.isDefault,
        smsTemplate: null
      },formArray);
    });
  }

  private AddDatInSMSTemplateArray(x: SendSmsTemplate,formArray:FormArray) {
    formArray.push(
      this.formBuilder.group({
        isDefault: [x.isDefault],
        language: [x.language],
        languageCode: [x.languageCode],
        smsTemplate: [x.smsTemplate]
      })
    );
  }

  private AddDataInEmailTemplateArray(x: EmailTemplate,formArray:FormArray) {
    formArray.push(
      this.formBuilder.group({
        isDefault: [x.isDefault],
        language: [x.language],
        languageCode: [x.languageCode],
        emailSubject: [x.emailSubject],
        emailTemplate: [x.emailTemplate]
      })
    );
  }

  private AddDataInReminderTemplateArray(formArray:FormArray,x: ReminderTemplate) {
    formArray.push(
      this.formBuilder.group({
        isDefault: [x.isDefault],
        language: [x.language],
        languageCode: [x.languageCode],
        template:[x.template,Validators.required],
        subject:[x.subject,Validators.required]
      })
    );
  }

  public SetFormGroup(appointmentTemplate: AppointmentTemplate) {
    this.AddAppointmentForm.controls.id.setValue(appointmentTemplate.id);
    this.AddAppointmentForm.controls.templateName.setValue(appointmentTemplate.templateName);
    this.AddAppointmentForm.controls.mobileTemplate.setValue(appointmentTemplate.mobileTemplate);
    this.AddAppointmentForm.controls.noOfPeopleInTimeSlot.setValue(appointmentTemplate.noOfPeopleInTimeSlot);
    this.AddAppointmentForm.controls.durationOfEachTimeSlotInMinutes.setValue(appointmentTemplate.durationOfEachTimeSlotInMinutes);
    this.AddAppointmentForm.controls.bookInBefore.setValue(appointmentTemplate.bookInBefore);
    this.AddAppointmentForm.controls.bookInBeforeType.setValue(appointmentTemplate.bookInBeforeType? appointmentTemplate.bookInBeforeType : WorkflowConstants.BookInAdvanceTypes[0] );
    this.AddAppointmentForm.controls.bookInAdvance.setValue(appointmentTemplate.bookInAdvance);
    this.AddAppointmentForm.controls.bookInAdvanceType.setValue(appointmentTemplate.bookInAdvanceType? appointmentTemplate.bookInAdvanceType : WorkflowConstants.BookInAdvanceTypes[0] );
    this.AddAppointmentForm.controls.earlyCheckInMinutes.setValue(appointmentTemplate.earlyCheckInMinutes);
    this.AddAppointmentForm.controls.lateCheckInMinutes.setValue(appointmentTemplate.lateCheckInMinutes);
    this.AddAppointmentForm.controls.enableConfirmationEmailAfterRegistration.setValue(appointmentTemplate.enableConfirmationEmailAfterRegistration);
    this.AddAppointmentForm.controls.enableConfirmationSMSAfterRegistration.setValue(appointmentTemplate.enableConfirmationSMSAfterRegistration);
    this.AddAppointmentForm.controls.enableVerificationEmail.setValue(appointmentTemplate.enableVerificationEmail);
    this.AddAppointmentForm.controls.enableVerificationSMS.setValue(appointmentTemplate.enableVerificationSMS);
    this.AddAppointmentForm.controls.enableSendSMSOnAppointmentCancel.setValue(appointmentTemplate.enableSendSMSOnAppointmentCancel);
    this.AddAppointmentForm.controls.enableSendEmailOnAppointmentCancel.setValue(appointmentTemplate.enableSendEmailOnAppointmentCancel);
    this.AddAppointmentForm.controls.enableSendSMSOnAppointmentUpdate.setValue(appointmentTemplate.enableSendSMSOnAppointmentUpdate);
    this.AddAppointmentForm.controls.enableSendEmailOnAppointmentUpdate.setValue(appointmentTemplate.enableSendEmailOnAppointmentUpdate);
    this.AddAppointmentForm.controls.enableBCCBranchWithEveryRegistration.setValue(appointmentTemplate.enableBCCBranchWithEveryRegistration);
    this.AddAppointmentForm.controls.enableQuietHours.setValue(appointmentTemplate.enableQuietHours);
    this.AddAppointmentForm.controls.from.setValue(appointmentTemplate.from);
    this.AddAppointmentForm.controls.to.setValue(appointmentTemplate.to);

    this.setReminderForm(appointmentTemplate.reminders);
    this.setEmailTemplateArray(appointmentTemplate.verificationEmail,this.VerificationEmailArray,appointmentTemplate.enableVerificationEmail);
    this.setSMSTemplateArray(appointmentTemplate.verificationSMS,this.VerificationSMSArray, appointmentTemplate.enableVerificationSMS);

    this.setEmailTemplateArray(appointmentTemplate.confirmationEmail,this.ConfirmationEmailArray,appointmentTemplate.enableConfirmationEmailAfterRegistration);
    this.setSMSTemplateArray(appointmentTemplate.confirmationSMS,this.ConfirmationSMSArray, appointmentTemplate.enableConfirmationSMSAfterRegistration);

    this.setEmailTemplateArray(appointmentTemplate.appointmentUpdateEmail,this.AppointmentUpdateEmailArray,appointmentTemplate.enableSendEmailOnAppointmentUpdate);
    this.setSMSTemplateArray(appointmentTemplate.appointmentUpdateSMS,this.AppointmentUpdateSMSArray,appointmentTemplate.enableSendSMSOnAppointmentUpdate);

    this.setEmailTemplateArray(appointmentTemplate.appointmentCancelEmail,this.AppointmentCancelEmailArray,appointmentTemplate.enableSendEmailOnAppointmentCancel);
    this.setSMSTemplateArray(appointmentTemplate.appointmentCancelSMS,this.AppointmentCancelSMSArray,appointmentTemplate.enableSendSMSOnAppointmentCancel);
    if(this.AddAppointmentForm.controls.enableQuietHours.value && this.AddAppointmentForm.controls.enableQuietHours.value === true){
      this.AddAppointmentForm.controls['to'].setValidators(Validators.required);
    this.AddAppointmentForm.controls['from'].setValidators(Validators.required);
    this.AddAppointmentForm.controls['from'].updateValueAndValidity();
    this.AddAppointmentForm.controls['to'].updateValueAndValidity();
    }

  }

  setEmailTemplateArray(emailArray: EmailTemplate[],formArray:FormArray,value:boolean) {
    this.SetDefaultEmailTemplateArray(formArray);

    //set value to supported language if translation exist.
    if (Array.isArray(emailArray) && emailArray[0]) {
      emailArray.forEach((x) => {
        formArray.controls.forEach((form:FormGroup)=>{
          if(form.value.languageCode == x.languageCode){
            form.controls.language.setValue(x.language);
            form.controls.languageCode.setValue(x.languageCode);
            form.controls.emailTemplate.setValue(x.emailTemplate);
            form.controls.emailSubject.setValue(x.emailSubject);
            if(value && value===true){
              form.controls.emailTemplate.setValidators(Validators.required);
              form.controls.emailSubject.setValidators(Validators.required);
            }
          }
        })
      })
    }
  }

  setSMSTemplateArray(SMSArray: SendSmsTemplate[],formArray:FormArray,value:boolean) {
    //add all supported language
    this.SetDefaultSMSTemplateArray(formArray)

    //set value to supported language if translation exist.
    if (Array.isArray(SMSArray) && SMSArray[0]) {
      SMSArray.forEach((x) => {
        formArray.controls.forEach((form:FormGroup)=>{
          if(form.value.languageCode == x.languageCode){
            form.controls.language.setValue(x.language);
            form.controls.languageCode.setValue(x.languageCode);
            form.controls.smsTemplate.setValue(x.smsTemplate);
            if(value && value===true){
              form.controls.smsTemplate.setValidators(Validators.required);
            }
          }
        })
      })
    }
  }

  public newReminderForm(): FormGroup {
    let form =  this.formBuilder.group({
      remindsVia: [WorkflowConstants.RemindsVia[0]],
      remindsIn: [WorkflowConstants.RemindsIn[0]],
      reminderPeriodType: [WorkflowConstants.ReminderPeriodTypes[0]],
      reminderTemplate: this.formBuilder.array([]),
    });
    this.setDefaultReminderArray(form);
    return form;
  }

  private setDefaultReminderArray(form : FormGroup){
    let remindersTemplateArray = form.controls.reminderTemplate as FormArray;
    remindersTemplateArray.clear();
    this.SupportedLanguage.forEach((x: SupportedLanguage) => {
      this.AddDataInReminderTemplateArray(remindersTemplateArray,{
        template: null,
        subject:null,
        language: x.language,
        languageCode: x.languageCode,
        isDefault: x.isDefault
      });
    });
    if(form.controls.remindsVia.value != "Email"){
      remindersTemplateArray.controls.forEach(
        (formGroup:FormGroup)=>{
          formGroup.controls.subject.clearValidators();
          formGroup.controls.subject.updateValueAndValidity();
        }
      )
    }
    form.controls.remindsVia.valueChanges.subscribe(x=>{
      if(x!='Email'){
        remindersTemplateArray.controls.forEach(
          (formGroup:FormGroup)=>{
            formGroup.controls.subject.clearValidators();
            formGroup.controls.subject.updateValueAndValidity();
          }
        )
      }
      if(x=="Email"){
        remindersTemplateArray.controls.forEach(
          (formGroup:FormGroup)=>{
              formGroup.controls.subject.setValidators(Validators.required);
              formGroup.controls.subject.updateValueAndValidity();
          }
        )
      }
    })
  }

  private setReminderTemplateArray(form : FormGroup, reminderTemplates: ReminderTemplate[]){
    let remindersTemplateArray = form.controls.reminderTemplate as FormArray;
      remindersTemplateArray.clear();
      this.setDefaultReminderArray(form);

      //set value to supported language if translation exist.
      if (Array.isArray(reminderTemplates) && reminderTemplates[0]) {
        reminderTemplates.forEach((x:ReminderTemplate) => {
          remindersTemplateArray.controls.forEach((form:FormGroup)=>{
            if(form.value.languageCode == x.languageCode){
              form.controls.language.setValue(x.language);
              form.controls.languageCode.setValue(x.languageCode);
              form.controls.template.setValue(x.template);
              form.controls.subject.setValue(x.subject);
            }
          })
        })
        if(form.controls.remindsVia.value != "Email"){
          remindersTemplateArray.controls.forEach(
            (formGroup:FormGroup)=>{
              formGroup.controls.subject.clearValidators();
              formGroup.controls.subject.updateValueAndValidity();
            }
          )
        }
      }
  }

  setReminderForm(reminders: AppointmentTemplateCommunicationReminders[]) {
    this.RemindersArray.clear();
    let size = this.RemindersArray.length
    for (let i = 0; i < size; i++) {
      this.removeReminderForm(i);
    }
    if (this.Mode == Mode.Edit) {
      for (let i = 0; i < reminders.length; i++) {
        let form = this.formBuilder.group({
          remindsVia: [reminders[i].remindsVia,Validators.required],
          remindsIn: [reminders[i].remindsIn,Validators.required],
          reminderPeriodType: [reminders[i].reminderPeriodType,Validators.required],
          reminderTemplate: this.formBuilder.array([]),
        });

        this.setReminderTemplateArray(form,reminders[i].reminderTemplate)
        this.RemindersArray.push(form);
      }
    }
  }

  public addReminderForm() {
    let form = this.newReminderForm()

    this.RemindersArray.push(form);
  }

  public removeReminderForm(index) {
    this.RemindersArray.removeAt(index);
  }

  public GetDefaultAppointmentTemplate(): AppointmentTemplate {
    return {
      id: null,
      templateName: null,

      mobileTemplate:null,
      noOfPeopleInTimeSlot: null,
      durationOfEachTimeSlotInMinutes: null,
      bookInBefore: null,
      bookInBeforeType: WorkflowConstants.BookInAdvanceTypes[0],
      bookInAdvance: null,
      bookInAdvanceType: WorkflowConstants.BookInAdvanceTypes[0],
      earlyCheckInMinutes: null,
      lateCheckInMinutes: null,

      enableVerificationEmail: null,
      verificationEmail: null,
      enableVerificationSMS: null,
      verificationSMS: null,

      enableConfirmationEmailAfterRegistration: null,
      confirmationEmail: [],
      confirmationSMS: [],
      enableConfirmationSMSAfterRegistration: null,
      enableBCCBranchWithEveryRegistration: null,

      enableSendEmailOnAppointmentUpdate: null,
      appointmentUpdateEmail: [],
      enableSendSMSOnAppointmentUpdate: null,
      appointmentUpdateSMS: [],

      enableSendEmailOnAppointmentCancel: null,
      appointmentCancelEmail: [],
      enableSendSMSOnAppointmentCancel: null,
      appointmentCancelSMS: [],

      reminders: [{
        remindsVia: 'SMS',
        remindsIn: null,
        reminderPeriodType: null,
        reminderTemplate: [],
      }],

      enableQuietHours: null,
      from: null,
      to: null,
    }
  }

  OpenModal() {
    this.subjectOpenAppointTemplateDialog.next(true);
    this.subs.sink = this.workFlowService.GetDynamicVariables(true).subscribe(x => {
      this.workFlowService.DynamicVariablesListSubject.next(cloneObject(x));
    });
  }

  CloseModalAndResetForm() {
    this.subjectOpenAppointTemplateDialog.next(false);
    this.AddAppointmentForm.reset();
    this.AddAppointmentForm.controls['from'].clearValidators();
    this.AddAppointmentForm.controls['to'].clearValidators();
    this.AddAppointmentForm.controls['from'].updateValueAndValidity();
    this.AddAppointmentForm.controls['to'].updateValueAndValidity();
    this.RemindersArray.clear()
    this.setDefaultTemplateArrays()
  }

  SetEditData(appointmentTemplate: AppointmentTemplate) {
    this.SetFormGroup(appointmentTemplate);
  }

  Add(request: FormGroup): void {
    let AppointmentTemplateName = request.get('templateName').value;
    AppointmentTemplateName = AppointmentTemplateName ? AppointmentTemplateName : ""
    let templatesList = this.workFlowService.GetAppointmentTemplates()
    const appointmentTemplateNameAlreadyExist = templatesList
      .some(template => template.templateName?.toLowerCase()?.trim() === AppointmentTemplateName?.toLowerCase()?.trim() && !template.isDeleted);

    if (appointmentTemplateNameAlreadyExist) {
      request.get('templateName').setErrors({ isExists: true });
      return;
    }
    this.formService.CallFormMethod<AppointmentTemplate>(request,true).then((response) => {
      response.id = this.uuid;
      this.workFlowService.AddAppointTemplate(response);
      this.CloseModalAndResetForm();
    }).catch(err=>{
      this.CheckAndSetAdditionalLanguageMessage();
    });
  }

  CheckAndSetAdditionalLanguageMessage() {
    if(this.VerificationEmailArray.invalid){
      this.CheckEmailsTranslationValidation(this.VerificationEmailArray,"isVerificationEmailTranslationValid");
    }
    if(this.VerificationSMSArray.invalid){
      this.CheckSMSTranslationValidation(this.VerificationSMSArray,"isVerificationSMSTranslationValid");
    }
    if(this.ConfirmationEmailArray.invalid){
      this.CheckEmailsTranslationValidation(this.ConfirmationEmailArray,"isConfirmationEmailTranslationValid");
    }
    if(this.ConfirmationSMSArray.invalid){
      this.CheckSMSTranslationValidation(this.ConfirmationSMSArray,"isConfirmationSMSTranslationValid");
    }
    if(this.AppointmentUpdateEmailArray.invalid){
      this.CheckEmailsTranslationValidation(this.AppointmentUpdateEmailArray,"isUpdateEmailTranslationValid");
    }
    if(this.AppointmentUpdateSMSArray.invalid){
      this.CheckSMSTranslationValidation(this.AppointmentUpdateSMSArray,"isUpdateSMSTranslationValid");
    }
    if(this.AppointmentCancelEmailArray.invalid){
      this.CheckEmailsTranslationValidation(this.AppointmentCancelEmailArray,"isCancelledEmailTranslationValid");
    }
    if(this.AppointmentCancelSMSArray.invalid){
      this.CheckSMSTranslationValidation(this.AppointmentCancelSMSArray,"isCancelledSMSTranslationValid");
    }
    if(this.RemindersArray.invalid){
      this.RemindersArray.controls.forEach((fg:FormGroup)=>{
        let faReminder = fg.controls.reminderTemplate as FormArray
        faReminder.controls.forEach((x: FormGroup) => {
          if (x.controls.isDefault.value !== true) {
            if (x.controls.template.invalid) {
              faReminder.setErrors({InvalidTranslation:true})
            }
            if(x.controls.subject.invalid){
              faReminder.setErrors({InvalidTranslation:true})
            }
          }
        });
      })
    }
  }

  CheckSMSTranslationValidation(formArray:FormArray,propertyName:string) {
    formArray.controls.forEach((x: FormGroup) => {
      if (x.controls.isDefault.value !== true) {
        if (x.controls.smsTemplate.invalid) {
          this[propertyName] = false;
        }
      }
    });
  }

  private CheckEmailsTranslationValidation(formArray:FormArray,propertyName:string) {
    formArray.controls.forEach((x: FormGroup) => {
      if (x.controls.isDefault.value !== true) {
        if (x.controls.emailSubject.invalid || x.controls.emailTemplate.invalid) {
          this[propertyName] = false;
        }
      }
    });
  }


  Edit(request: FormGroup): void {
    const id = request.get('id').value;
    let appointTemplateName = request.get('templateName').value;
    appointTemplateName = appointTemplateName ? appointTemplateName : "";
    const appointmentTemplateNameAlreadyExist = this.workFlowService.GetAppointmentTemplates()
      .some(template => template.templateName.toLowerCase() === appointTemplateName.toLowerCase() && template.id !== id && !template.isDeleted);

    if (appointmentTemplateNameAlreadyExist) {
      request.get('templateName').setErrors({ isExists: true });
      return;
    }
    this.formService.CallFormMethod<AppointmentTemplate>(request,true).then((response) => {
      this.workFlowService.EditAppointmentTemplate(response);
      this.CloseModalAndResetForm();
    }).catch(x=>{
      this.CheckAndSetAdditionalLanguageMessage()
    });
  }

  Delete(id: string): void {
    this.workFlowService.DeleteAppointmentTemplate(id);
  }

  private InitSubjectAndObservables() {
    this.AppointmentTemplateList$ = this.workFlowService.AppointTemplateList$;
    this.subjectOpenAppointTemplateDialog = new BehaviorSubject<boolean>(false);
    this.OpenAppointmentTemplateDialog$ = this.subjectOpenAppointTemplateDialog.asObservable();
  }


  checkTimeValidation: ValidatorFn = (
    control: FormGroup
  ): ValidationErrors | null => {
    try {
      const fromtime = control.get('from').value;

      const closeTime = control.get('to').value;

      if ((closeTime !== this.defaultValues.time && fromtime === this.defaultValues.timeOpen)) {
        return {
          invalidStartTime: true,
        };
      }
      else if ((closeTime === this.defaultValues.time && fromtime !== this.defaultValues.timeOpen)) {
        return {
          invalidEndTime: true,
        };
      }

      if(closeTime === this.defaultValues.time && fromtime ===this.defaultValues.timeOpen){
        return {
          invalidTime: true,
        };
      }
      const startTime = new Date().setHours(this.GetHours(fromtime), this.GetMinutes(fromtime), 0);

      const endTime = new Date(startTime).setHours(this.GetHours(closeTime), this.GetMinutes(closeTime), 0);

   if (startTime === endTime) {
        return {
          invalidEndTime: true,
        };
      }
      else {
        return {};
      }
    } catch (err) {
    }
  }

  private GetHours(d) {
    // tslint:disable-next-line: radix
    let h = parseInt(d.split(':')[0]);
    if (d.split(':')[1].split(' ')[1] === 'PM') {
      h = h + 12;
    }
    return h;
  }

  private GetMinutes(d) {
    // tslint:disable-next-line: radix
    return parseInt(d.split(':')[1].split(' ')[0]);
  }

  public OnSMSSelectionChanged(formArray:FormArray,value:boolean){
    this.workFlowService.OnSelectionChangeSMSValidation(formArray,value)
  }

  public OnEmailSelectionChanged(formArray:FormArray,value:boolean){
    this.workFlowService.OnSelectionChangeEmailValidation(formArray,value);
  }

  translate(text: string, formarray: FormArray, templatePropertyName?:string,EmailSubject?:string,subjectControlName?:string) {
    let ruleDocumentRequest = this.workFlowService.GetRequestDocument(this.workFlowService.WorkFlow,true,true)
    if(text){
      this.subs.sink = this.translateService.GetTranslatedTexts(text,ruleDocumentRequest).subscribe(TranslateResponses => {
        if (TranslateResponses && TranslateResponses.length !== 0) {
          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < TranslateResponses.length; index++) {
            const TranslateRes = TranslateResponses[index];
            // tslint:disable-next-line: prefer-for-of
            for (let ind = 0; ind < formarray.length; ind++) {
              const formgroup = formarray.controls[ind] as FormGroup;
              if (ind !== 0 && TranslateRes.languageId === formgroup.get('languageCode').value) {
                formgroup.get(templatePropertyName).setValue(TranslateRes.translatedText);
              }
            }
          }
        }
      });
    }

    if(EmailSubject){
      this.subs.sink = this.translateService.GetTranslatedTexts(EmailSubject,ruleDocumentRequest).subscribe(TranslateResponses => {

        if (TranslateResponses && TranslateResponses.length !== 0) {
          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < TranslateResponses.length; index++) {
            const TranslateRes = TranslateResponses[index];
            // tslint:disable-next-line: prefer-for-of
            for (let ind = 0; ind < formarray.length; ind++) {
              const formgroup = formarray.controls[ind] as FormGroup;
              if (ind !== 0 && TranslateRes.languageId === formgroup.get('languageCode').value) {
                formgroup.get(subjectControlName).setValue(TranslateRes.translatedText);
              }
            }

          }
        }
      });
    }
  }

  findChoices(searchText: string) {
    return this.workFlowService.findChoices(searchText);
  }
}
