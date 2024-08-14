import { ChangeDetectorRef, Injectable } from "@angular/core";
import { FormArray, FormGroup, Validators } from "@angular/forms";
import { AbstractComponentService } from "src/app/base/abstract-component-service";
import { WorkFlowService } from "../work-flow.service";
import { SupportedLanguage } from "../models/supported-language"
import { TranslateService } from "src/app/core/services/translate.service";
import { IBasicWorkFlowRules, ISmsAtPositionAndTemplate, SendSmsTemplate } from "../models/basic-workflow-behaviour-rule.interface";
import { Observable } from "rxjs";
import { IRulesDocuments } from "src/app/models/common/dynamic-variable.interface";

@Injectable()
export class BasicWorkflowRuleService extends AbstractComponentService {
    
    supportedLanguages: SupportedLanguage[]=[];

    get BasicWorkflowRulesForm() {
        return this.workFlowService.BasicWorkflowRulesForm
    }

    get workflow(){
        return this.workFlowService.WorkFlow
    }
    get IsAdditionalLanguageAvailable() {
        return this.workFlowService.HavingAdditionalLanguage;
    }

    BasicWorkFlowData$:Observable<any>;
    get SmsAtPositionFormArray() {
        return this.workFlowService.SmsAtPositionFormArray;
    }

    get EmailAtPositionFormArray() {
        return this.workFlowService.EmailAtPositionFormArray;
    }

    constructor(private workFlowService: WorkFlowService, private translateService: TranslateService, private changeDetect : ChangeDetectorRef) {
        super();
        this.BasicWorkFlowData$ = this.workFlowService.BasicWorkFlowData$
    }

    DetectChanges(){
        this.changeDetect.detectChanges();
    }

    get SendSMSRegistrationTemplateArray() {
        return this.workFlowService.SendSMSRegistrationTemplateArray
    }

    get SendSMSToJoinQueueTemplateArray() {
        return this.workFlowService.SendSMSToJoinQueueTemplateArray
    }

    get SendSMSAutoReplyTemplateArray() {
        return this.workFlowService.SendSMSAutoReplyTemplateArray
    }

    get SendSMSAtYourTurnTemplateArray() {
        return this.workFlowService.SendSMSAtYourTurnTemplateArray
    }

    get SendSMSWhenCancelledTemplateArray() {
        return this.workFlowService.SendSMSWhenCancelledTemplateArray
    }

    get SendEmailRegistrationTemplateArray() {
        return this.workFlowService.SendEmailRegistrationTemplateArray
    }

    get SendEmailAtYourTurnTemplateArray() {
        return this.workFlowService.SendEmailAtYourTurnTemplateArray
    }

    get SendEmailWhenCancelledTemplateArray() {
        return this.workFlowService.SendEmailWhenCancelledTemplateArray
    }

    get SendSmsUponTransferTemplateArray() {
        return this.workFlowService.SendSmsUponTransferTemplateArray
    }

    get SendSmsWhenRequeuedTemplateArray() {
        return this.workFlowService.SendSmsWhenRequeuedTemplateArray
    }

    get SendSmsForSurveyTemplateArray() {
        return this.workFlowService.SendSmsForSurveyTemplateArray
    }

    get SendEmailUponTransferTemplateArray() {
        return this.workFlowService.SendEmailUponTransferTemplateArray
    }

    get SendEmailWhenRequeuedTemplateArray() {
        return this.workFlowService.SendEmailWhenRequeuedTemplateArray
    }

    get SendEmailForSurveyTemplateArray() {
        return this.workFlowService.SendEmailForSurveyTemplateArray
    }

    get DynamicVariablesList(){
        return this.workFlowService.DynamicVariablesList
    }
    InitBasicWorkFlowRules(){
        this.workFlowService.InitBasicWorkFlowRules();
        this.changeDetect.detectChanges();
    }

    addSMSAndEmailAtPositionForm(ruleType:string) {
        if(ruleType==='SMS'){
            this.workFlowService.SmsAtPositionFormArray.push(this.workFlowService.newSMSAndEmailAtPositionForm(ruleType));
        }else{
            this.workFlowService.EmailAtPositionFormArray.push(this.workFlowService.newSMSAndEmailAtPositionForm(ruleType));
        }
    }

    removeSMSAtPositionForm(ruleType :string,index: number) {
        if(ruleType==="SMS"){
            this.workFlowService.SmsAtPositionFormArray.removeAt(index);
        }else{
            this.workFlowService.EmailAtPositionFormArray.removeAt(index);
        }
    }

    get Mode(){
        return this.workFlowService.Mode;
    }

    isAnyAdditionLanguageInvalid(){
        return this.workFlowService.isAdditionalLanguageInvalid;
    }
    SetBasicWorkFlowRules() {
        
        this.workFlowService.SetBasicWorkFlowRules(this.BasicWorkflowRulesForm.value);
        if(!this.isAnyAdditionLanguageInvalid()){
            this.formService.CallFormMethod<IBasicWorkFlowRules>(this.BasicWorkflowRulesForm,true).catch(err=>{
                this.workFlowService.CheckAndSetLanguageOfBasicWorkflowRule();
                this.changeDetect.detectChanges();
              });
        }
        this.changeDetect.detectChanges();
    }

    translate(text: string, formarray: FormArray, controlName: string, emailSubject?: string, ruleDocumentRequest?:IRulesDocuments) {
        if (text) {
            this.subs.sink = this.translateService.GetTranslatedTexts(text,ruleDocumentRequest).subscribe(TranslateResponses => {

                if (TranslateResponses && TranslateResponses.length !== 0) {
                    // tslint:disable-next-line: prefer-for-of
                    for (let index = 0; index < TranslateResponses.length; index++) {
                        const TranslateRes = TranslateResponses[index];
                        // tslint:disable-next-line: prefer-for-of
                        for (let ind = 0; ind < formarray.length; ind++) {
                            const formGroup = formarray.controls[ind] as FormGroup;
                            if (ind !== 0 && TranslateRes.languageId === formGroup.get('languageCode').value) {
                                formGroup.get(controlName).setValue(TranslateRes.translatedText);
                            }
                        }

                    }
                }
            });
        }else{
            for (let ind = 0; ind < formarray.length; ind++) {
                const formGroup = formarray.controls[ind] as FormGroup;
                if(formGroup.value.isDefault){
                    
                    formGroup.get(controlName).updateValueAndValidity();
                    formGroup.get(controlName).markAsDirty();
                    formGroup.get(controlName).markAsTouched();
                }
            }
        }

        if (emailSubject) {
            this.subs.sink = this.translateService.GetTranslatedTexts(emailSubject,ruleDocumentRequest).subscribe(TranslateResponses => {

                if (TranslateResponses && TranslateResponses.length !== 0) {
                    // tslint:disable-next-line: prefer-for-of
                    for (let index = 0; index < TranslateResponses.length; index++) {
                        const TranslateRes = TranslateResponses[index];
                        // tslint:disable-next-line: prefer-for-of
                        for (let ind = 0; ind < formarray.length; ind++) {
                            const formGroup = formarray.controls[ind] as FormGroup;
                            if (ind !== 0 && TranslateRes.languageId === formGroup.get('languageCode').value) {
                                formGroup.get('emailSubject').setValue(TranslateRes.translatedText);
                            }
                        }

                    }
                }
            });
        }else{
            if(controlName=="emailTemplate"){
                for (let ind = 0; ind < formarray.length; ind++) {
                    const formGroup = formarray.controls[ind] as FormGroup;
                    if(formGroup.value.isDefault){
                        
                        formGroup.get('emailSubject').updateValueAndValidity();
                        formGroup.get('emailSubject').markAsDirty();
                        formGroup.get('emailSubject').markAsTouched();
                    }
                }
            }
        }
    }

    OnSelectionChangeSMSValidation(formArray:FormArray,value:boolean){
        this.workFlowService.OnSelectionChangeSMSValidation(formArray,value);
    }

    OnSelectionChangeEmailValidation(formArray:FormArray,value:boolean){
        this.workFlowService.OnSelectionChangeEmailValidation(formArray,value);
    }

    findChoices(searchText: string) {
        return this.workFlowService.findChoices(searchText);
    }
    
    resetFormTextArea(index: number) {
        let formGroup = this.workFlowService.SmsAtPositionFormArray.controls[index] as FormGroup;
        formGroup.controls.sendSmsWhenCustomerIsAtLineTemplate.reset();
    }

}