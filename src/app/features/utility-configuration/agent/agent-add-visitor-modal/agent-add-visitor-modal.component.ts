import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { Validations } from 'src/app/models/constants/validation.constant';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { DefaultAgentDropdownValue } from '../../../../models/constants/agent-default-data.constant';
import { IKioskPanelItemsData } from '../../kiosk/kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';
import { ISupportedLanguage } from '../../kiosk/kiosk-add/kiosk-layout/Models/supported-language.interface';
import { IAgentCustomersListItem, Question, VisitorRequest } from '../models/agent-models';
import { AgentAddVisitorModalService } from './agent-add-visitor-modal.service';

@Component({
  selector: 'lavi-agent-add-visitor-modal',
  templateUrl: './agent-add-visitor-modal.component.html',
  styleUrls: ['./agent-add-visitor-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentAddVisitorModalComponent extends AbstractComponent {
  @Input() OpenDialog: boolean;
  @Input() CanAddGroups: boolean;
  @Input() IsTransferService: boolean;
  @Input() IsEditMode: boolean;
  @Input() Customer: IAgentCustomersListItem;

  @Output() OnClose: EventEmitter<void>;

  PreServiceQuestions: IKioskPanelItemsData[];
  ServiceQuestions: IKioskPanelItemsData[];
  Services$: Observable<IDropdown[]>;
  Groups$: Observable<IDropdown[]>;
  SelectedService: IDropdown;
  SelectedGroups: IDropdown[];
  CurrentRequest: VisitorRequest;
  DefaultAgentDropdownValue = DefaultAgentDropdownValue;
  IsServiceQuestionShow$: Observable<boolean>;
  showEstimateWaitTime$: Observable<boolean>;
  NextButtonText$: Observable<string>;
  BranchCountryCode$: Observable<string>;
  DefaultLanguage$: Observable<ISupportedLanguage>;
  LanguageList$: Observable<ISupportedLanguage[]>;

  SelectedLanguage: ISupportedLanguage;
  headerBackground: string;
  title: string;
  EstimateWaitTime$: Observable<String>;
  DisplayTicketNumber$: Observable<String>;

  PreviouslyAskedServiceQuestions: IKioskPanelItemsData[] = [];

  ModalBodyStyle: any;
  ModalFooterStyle: any;
  Styles$: Observable<any>;
  QuestionValidations: {
    Type: any;
    Regex: any;
  }[];

  constructor(
    private addVisitorService: AgentAddVisitorModalService,
  ) {
    super();
    this.SelectedGroups = [];
    this.OnClose = new EventEmitter();
    this.InitializeValidators();
    this.CurrentRequest = this.GetDefaultRequest();
    this.NextButtonText$ = this.addVisitorService.NextButtonText$;
    this.Services$ = this.addVisitorService.Services$;
    this.EstimateWaitTime$ = this.addVisitorService.EstimateWaitTime$;
    this.DisplayTicketNumber$ = this.addVisitorService.DisplayTicketNumber$;
    this.LanguageList$ = this.addVisitorService.LanguageList$;
    this.DefaultLanguage$ = this.addVisitorService.DefaultLanguage$;

    this.showEstimateWaitTime$ = this.addVisitorService.ShowEstimateWaitTime$;
    this.BranchCountryCode$ = this.addVisitorService.BranchCountryCode$

    this.Groups$ = this.addVisitorService.Groups$;
    this.subs.sink = this.addVisitorService.PreServiceQuestions$.subscribe(questions => {
      this.SetIsValidPropertyOfPhoneNumberQuestion(questions);
      this.PreServiceQuestions = questions;
    });
    this.subs.sink = this.addVisitorService.ServiceQuestions$.subscribe(questions => {
      this.SetIsValidPropertyOfPhoneNumberQuestion(questions);
      this.ServiceQuestions = questions;
    });
    this.IsServiceQuestionShow$ = this.addVisitorService.ServiceQuestions$.pipe(map(x => x.length > 0));

    this.subs.sink = this.addVisitorService.VisitorAdded$.subscribe(visitor => {
      this.OnClose.emit();
    });

    this.subs.sink = this.DefaultLanguage$.subscribe(DefaultLanguage => {
       this.SelectedLanguage = DefaultLanguage;
    });



    this.subs.sink = this.addVisitorService.PreviouslyAskedQuestions$.subscribe(questions => {
      this.PreviouslyAskedServiceQuestions = questions;
    });
  }

  private SetIsValidPropertyOfPhoneNumberQuestion(questions: IKioskPanelItemsData[]) {
    questions.forEach(x => {
      if (x.itemType === QuestionType.PhoneNumber.value || QuestionType.SMSPhoneNumber.value) {
        x.isValid = (x.required && x.answer) ? true : false;
      }
    });
  }

  Init() {

    this.addVisitorService.IsEditMode = this.IsEditMode;
    this.UpdateCustomerInformationDialog();
    this.addVisitorService.IsTransferMode = this.IsTransferService;
    this.TransferServiceDialog();
    this.SetTitle();
    this.addVisitorService.Initialize();
    this.InitializeStyles();
  }

  InitializeValidators() {
    this.QuestionValidations = [
      {
        Type: QuestionType.Email.value,
        Regex: Validations.EmailRegX
      }
    ];
  }



  Close(): void {
    this.IsTransferService = false;
    this.OnClose.emit();
    this.addVisitorService.EmptyQuestions();
  }

  // Submit(): void {
  //   let allServiceQuestions = this.ServiceQuestions.concat(this.PreviouslyAskedServiceQuestions)
  //   debugger
  //   if (this.IsTransferService || this.IsEditMode){
  //   if (!this.IsValidated()) {
  //     this.addVisitorService.NotifyError(CommonMessages.PleaseAnswerAllQuestionAddVisitor);
  //     return;
  //   }


  //   this.UpdateCurrentRequest();
  //   this.CurrentRequest.transferId = this.Customer.id;
  //   this.CurrentRequest.transferBy = this.addVisitorService.authService.UserId;
  //   this.addVisitorService.Submit(this.CurrentRequest,allServiceQuestions);
  // }else{
  //   if (!this.IsValidated()) {
  //     this.addVisitorService.NotifyError(CommonMessages.PleaseAnswerAllQuestionAddVisitor);
  //     return;
  //   }
  //   this.UpdateCurrentRequest();
  //  let previouslyAskedQuestions =  this.MappedQuestions(this.ServiceQuestions)
  //   this.CurrentRequest.serviceQuestions = previouslyAskedQuestions
  //   this.CurrentRequest.preServiceQuestions.push(previouslyAskedQuestions[0])
  
  //   this.addVisitorService.Submit(this.CurrentRequest, allServiceQuestions);
  // }
  // }

  Submit(): void {
    if (this.IsTransferService || this.IsEditMode){
    if (!this.IsValidated()) {
      this.addVisitorService.NotifyError(CommonMessages.PleaseAnswerAllQuestionAddVisitor);
      return;
    }


    this.UpdateCurrentRequest();
    this.CurrentRequest.transferId = this.Customer.id;
    this.CurrentRequest.transferBy = this.addVisitorService.authService.UserId;
    this.addVisitorService.Submit(this.CurrentRequest, this.ServiceQuestions);
  }else{
    if (!this.IsValidated()) {
      this.addVisitorService.NotifyError(CommonMessages.PleaseAnswerAllQuestionAddVisitor);
      return;
    }
    this.UpdateCurrentRequest();
    this.addVisitorService.Submit(this.CurrentRequest, this.ServiceQuestions);
  }
  }

  UpdateCurrentRequest() {
    const MappedServiceQuestions: Question[] = this.MappedQuestions(this.ServiceQuestions);
    const MappedPreServiceQuestions: Question[] = this.MappedQuestions(this.PreServiceQuestions);
    if(MappedServiceQuestions){
      const ids = MappedServiceQuestions.map(x => x.questionId);
      if (this.CurrentRequest.serviceQuestions.filter(x => ids.includes(x.questionId))){
        this.CurrentRequest.serviceQuestions = MappedServiceQuestions;
      }
    }else{
      this.CurrentRequest.serviceQuestions =
      this.CurrentRequest.serviceQuestions.concat(MappedServiceQuestions);
    }
    this.CurrentRequest.preServiceQuestions = MappedPreServiceQuestions;
    this.CurrentRequest.isTransfer = this.IsTransferService;
    this.CurrentRequest.isEdit = this.IsEditMode;
    this.CurrentRequest.serviceId = this.SelectedService.value;
    this.CurrentRequest.languageCode = this.SelectedLanguage.languageCode;
    if (this.CanAddGroups) {
      this.CurrentRequest.groups = this.SelectedGroups?.map(x => x.value);
    }

  }


  UpdateCustomerInformationDialog(){
    if (this.IsEditMode){
      this.addVisitorService.Customer = this.Customer;
      this.SelectedService = {
        text: this.Customer.serviceName,
        value: this.Customer.serviceId
      };
    }
  }

  MappedQuestions(ServiceQuestions: IKioskPanelItemsData[]): Question[] {
    if (ServiceQuestions) {
      return ServiceQuestions.map(x => {
        return {
          answer: x.answer,
          questionId: x.itemId,
          questionType: x.itemType,
          questionText: x.itemText
        };
      });
    } else {
      return [];
    }
  }

  IsValidated(): boolean {
    const PreServiceRequiredQuestions = this.PreServiceQuestions.filter(p => p.required || p.answer);
    const ServiceRequiredQuestions = this.ServiceQuestions.filter(p => p.required || p.answer);
    const PreServiceValidated = this.ValidateQuestions(PreServiceRequiredQuestions);
    const ServiceValidated = this.ValidateQuestions(ServiceRequiredQuestions);
    return PreServiceValidated && ServiceValidated;
  }

  ValidateQuestions(Questions: IKioskPanelItemsData[]): boolean {
    if (!Questions) { return true; }
    if (Questions.length === 0) { return true; }
    return Questions.every(question => question.answer && this.ValidateAnswer(question));
  }

  ValidateAnswer(question: IKioskPanelItemsData): boolean {
    if ( question.itemType == QuestionType.PhoneNumber.value || question.itemType == QuestionType.SMSPhoneNumber.value ){
      return question.isValid;
    }
    const Regex = this.QuestionValidations?.find(x => x.Type == question.itemType)?.Regex;
    return !Regex || (question.answer).match(Regex);
  }

  SetTitle(){
    if (this.IsTransferService){
      this.title = 'TRANSFER SERVICE';
    }else if (this.IsEditMode){
      this.title = this.GetDisplayField(this.Customer);
    }else{
      this.title = 'ADD NEW VISITOR';
    }
  }

  GetDisplayField(customer: IAgentCustomersListItem): string {
    if (customer.displayFields
      && customer.displayFields.length > 0) {
      return customer.displayFields
        ?.sort(x => x.displayFieldPriority)[0]
        ?.answer;
    }
    else {
      return customer.ticketNumber;
    }
  }

  GetDialogClassName(): string{
    if (this.IsTransferService){
      return 'transfer-service-modal';
    }else if (this.IsEditMode){
      return 'edit-visitor-modal';
    }else{
      return 'add-visitor-modal';
    }
  }

  TransferServiceDialog(){
    if (this.IsTransferService){
          this.addVisitorService.RemoveServices();
       }else{
        this.addVisitorService.UpdateServices();
      }
    this.addVisitorService.ServiceChanged(this.SelectedService?.value);
  }


  ServiceChanged(): void {
    this.addVisitorService.ServiceChanged(this.SelectedService?.value);
  }

  InitializeStyles() {
    this.Styles$ = this.addVisitorService.ServiceQuestions$.pipe(map(x => {
      if (x.length > 0) {
        return {
          ModalBodyHeight: '700px'
        };
      }
      else {
        return {
          ModalBodyHeight: '450px'
        };
      }
    }));

    this.ModalFooterStyle = {
      height: '100px',
    };
    this.ModalBodyStyle = {
      height: 'calc(100% - 100px)',
    };
  }

  GetDefaultRequest(): VisitorRequest {
    const kioskRequest = new VisitorRequest();
    kioskRequest.preServiceQuestions = [];
    kioskRequest.serviceQuestions = [];
    return kioskRequest;
  }

  ControlChange(){
    if (this.IsTransferService || this.IsEditMode){
      if (!this.IsValidated()) {
        this.addVisitorService.NotifyError(CommonMessages.PleaseAnswerAllQuestionAddVisitor);
        return;
      }
      this.UpdateCurrentRequest();
      this.CurrentRequest.transferId = this.Customer.id;
      this.CurrentRequest.transferBy = this.addVisitorService.authService.UserId;
      this.addVisitorService.ControlChange(this.CurrentRequest, this.ServiceQuestions);
    }else{
      if (!this.IsValidated()) {
        this.addVisitorService.NotifyError(CommonMessages.PleaseAnswerAllQuestionAddVisitor);
        return;
      }
      this.UpdateCurrentRequest();
      this.addVisitorService.ControlChange(this.CurrentRequest, this.ServiceQuestions);
    }
  }

}


export const DefaultStyles = {
  Styles: {
    ModalBodyHeight: '500px'
  },
  ModalFooterStyle: {
    height: '100px',
  }, ModalBodyStyle: {
    height: 'calc(100% - 100px)',
  }
};
