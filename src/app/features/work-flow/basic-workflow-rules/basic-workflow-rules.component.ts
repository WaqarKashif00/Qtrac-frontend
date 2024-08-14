import { ChangeDetectionStrategy, Component, SecurityContext } from '@angular/core';
import { FormArray } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { DompurifySanitizer } from 'src/app/core/services/dompurify.service';
import { WorkflowConstants } from 'src/app/models/constants/basic-workflow-rules-constants';
import { EditorConfig } from 'src/app/models/constants/editor-config.constant';
import { DocumentType, VariablePurpose, VariableRequestDocument } from 'src/app/models/enums/variables-related';
import { WorkflowValidationMessage } from 'src/app/models/validation-message/workflow-message';
import { IWorkFlowRequest } from '../models/work-flow-request.interface';
import { BasicWorkflowRuleService } from './basic-workflow-service';


@Component({
  selector: 'lavi-basic-workflow-rules',
  templateUrl: './basic-workflow-rules.component.html',
  styleUrls: ['./basic-workflow-rules.component.scss', '../work-flow-configuration/work-flow-configuration.component.scss'],
  providers: [BasicWorkflowRuleService],
  changeDetection: ChangeDetectionStrategy.Default
})
export class BasicWorkflowRulesComponent extends AbstractComponent {

  listItems = WorkflowConstants.PositionConstants;
  WorkflowMessage = WorkflowValidationMessage;
  EditorConfig = EditorConfig;
  skipKeys: string[] = ['%'];

  constructor(private basicWorkflowService: BasicWorkflowRuleService, private dompurifySanitizer: DompurifySanitizer) {
    super();
  }

  get ConditionsName() {
    return this.basicWorkflowService.DynamicVariablesList;
  }

  findChoices = (searchText: string) => {
    return this.basicWorkflowService.findChoices(searchText);
  };

  getChoiceLabel = (choice: string) => {
    let displayText = (this.ConditionsName as any)?.find((variable: any) => variable.shortName == choice)?.fieldName;
    return `%${displayText}%`;
  }

  ngOnInit() {
    this.basicWorkflowService.BasicWorkFlowData$.subscribe(x => {
      if (x && x.supportedLanguages) {
        this.basicWorkflowService.supportedLanguages = x.supportedLanguages;

        this.basicWorkflowService.SetBasicWorkFlowRules();
      }
    });
  }

  get BasicWorkflowRulesForm() {
    return this.basicWorkflowService.BasicWorkflowRulesForm;
  }

  get SmsAtPositionFormArray() {
    return this.basicWorkflowService.SmsAtPositionFormArray;
  }

  get EmailAtPositionFormArray() {
    return this.basicWorkflowService.EmailAtPositionFormArray;
  }

  get SendSMSRegistrationTemplateArray() {
    return this.basicWorkflowService.SendSMSRegistrationTemplateArray;
  }

  get SendSMSToJoinQueueTemplateArray() {
    return this.basicWorkflowService.SendSMSToJoinQueueTemplateArray;
  }

  get SendSMSAutoReplyTemplateArray() {
    return this.basicWorkflowService.SendSMSAutoReplyTemplateArray;
  }

  get SendSMSAtYourTurnTemplateArray() {
    return this.basicWorkflowService.SendSMSAtYourTurnTemplateArray;
  }

  get SendSMSWhenCancelledTemplateArray() {
    return this.basicWorkflowService.SendSMSWhenCancelledTemplateArray;
  }

  get SendEmailRegistrationTemplateArray() {
    return this.basicWorkflowService.SendEmailRegistrationTemplateArray;
  }

  get SendEmailAtYourTurnTemplateArray() {
    return this.basicWorkflowService.SendEmailAtYourTurnTemplateArray;
  }

  get SendEmailWhenCancelledTemplateArray() {
    return this.basicWorkflowService.SendEmailWhenCancelledTemplateArray;
  }

  get SendSmsUponTransferTemplateArray() {
    return this.basicWorkflowService.SendSmsUponTransferTemplateArray;
  }

  get SendEmailUponTransferTemplateArray() {
    return this.basicWorkflowService.SendEmailUponTransferTemplateArray;
  }

  get SendSmsWhenRequeuedTemplateArray() {
    return this.basicWorkflowService.SendSmsWhenRequeuedTemplateArray;
  }

  get SendEmailWhenRequeuedTemplateArray() {
    return this.basicWorkflowService.SendEmailWhenRequeuedTemplateArray;
  }

  get SendSmsForSurveyTemplateArray() {
    return this.basicWorkflowService.SendSmsForSurveyTemplateArray;
  }

  get SendEmailForSurveyTemplateArray() {
    return this.basicWorkflowService.SendEmailForSurveyTemplateArray;
  }

  get IsAdditionalLanguageAvailable() {
    return this.basicWorkflowService.IsAdditionalLanguageAvailable;
  }

  addNewRule(ruleType: string) {
    this.basicWorkflowService.addSMSAndEmailAtPositionForm(ruleType);
  }

  deleteRule(ruleType: string, index: number) {
    this.basicWorkflowService.removeSMSAtPositionForm(ruleType, index);
  }

  resetSMSRulesFormTextArea(index: number) {
    this.basicWorkflowService.resetFormTextArea(index);
  }

  resetTextAreaForm(controlName: string) {
    this.BasicWorkflowRulesForm.controls[controlName].reset();
  }

  translate(text: string, formarray: FormArray, controlName?: string, emailSubject?: string) {
    this.basicWorkflowService.translate(text, formarray, controlName, emailSubject, this.GetRequestDocument(this.basicWorkflowService.workflow,true));
  }

  OnSelectionChangeSMSValidation(formArray: FormArray, value: boolean) {
    this.basicWorkflowService.OnSelectionChangeSMSValidation(formArray, value);
  }

  OnSelectionChangeEmailValidation(formArray: FormArray, value: boolean) {
    this.basicWorkflowService.OnSelectionChangeEmailValidation(formArray, value);
  }

  UpdateEmailTemplateFormArray(index: number, value: string,EmailTemplateFormArray:FormArray) {
    if(value && value.includes('<angular-editor-toolbar') && value.includes('angular-editor-toolbar-set')) {
      return;
    }

    const santizedHTMLvalue = this.dompurifySanitizer.sanitize(SecurityContext.HTML,value);
    EmailTemplateFormArray.controls[index].get('emailTemplate').setValue(santizedHTMLvalue);
  }

  private GetRequestDocument(WorkFlow: IWorkFlowRequest, isDoc?: boolean, isAppointment?: boolean) {
    const documents = [
      this.GetWorkFlowDocument(WorkFlow, isDoc),
      {
        documentType: DocumentType.CustomerRequest,
        document: {}
      }
    ];

    if (isAppointment) {
      documents.push({
        documentType: DocumentType.Appointment,
        document: {}
      });
    }

    return {
      purpose: VariablePurpose.Dynamic,
      documents
    }
  }

  private GetWorkFlowDocument(WorkFlow: IWorkFlowRequest , isDoc: boolean ): VariableRequestDocument {
    return {
      documentType: DocumentType.Workflow,
      id: isDoc ? null : WorkFlow.workFlowId,
      pk: isDoc ? null : WorkFlow.pk,
      document: isDoc ? WorkFlow : null
    };
  }
}
