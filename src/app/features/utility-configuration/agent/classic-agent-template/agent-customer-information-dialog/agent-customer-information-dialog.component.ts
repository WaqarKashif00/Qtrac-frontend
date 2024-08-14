import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { IAgentCustomersListItem } from '../../models/agent-models';

@Component({
  selector: 'lavi-agent-customer-information-dialog',
  styleUrls: ['agent-customer-information-dialog.component.scss'],
  templateUrl: './agent-customer-information-dialog.component.html',
})
export class AgentCustomerInformationDialogBoxComponent extends AbstractComponent {

  @Input() Customer: any;
  @Input() AllowEditingCustomerInformation: boolean;
  @Output() OnClose: EventEmitter<boolean>;

  QuestionTypes = QuestionType;
  EditMode: boolean = false;
  IsHyperLink: boolean;


  constructor() {
    super();

    this.OnClose = new EventEmitter();


  }
  EditVisitorInformation() {
    this.EditMode = true;
    this.OnClose.emit(this.EditMode);
  }



  Close(): void {
    this.OnClose.emit(this.EditMode);
  }

  GetDisplayField(customer: IAgentCustomersListItem): string {
    if (customer) {
      const displayFields = customer?.displayFields[0]?.answer;
      return (displayFields) ? displayFields : customer?.ticketNumber;
    }
    return '';
  }


  CheckUrl(data, index) {
    const isValidUrl = data => {
      var urlPattern = new RegExp('^(http(s?):\\/\\/)' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
      return !!urlPattern.test(data);
    }
    if (isValidUrl(data)) {
      this.Customer.agentQuestions[index].IsHyperLink = true;

    }

  }


  Init(): void {
    for (let i = 0; i < this.Customer.agentQuestions?.length; i++) {
      this.Customer.agentQuestions[i].IsHyperLink = false;
      this.CheckUrl(this.Customer.agentQuestions[i].answer, i);

    }
  }

}
