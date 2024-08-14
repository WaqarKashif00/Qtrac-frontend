import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AppNotificationService } from 'src/app/core/services/notification.service';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { Mode } from 'src/app/models/enums/mode.enum';
import { NoOfDigitToTicketNumberingFormatPipe } from 'src/app/shared/pipes/no-of-digit-to-no-of-zero.pipe';
import { Queue } from '../../../models/common/work-flow-detail.interface';
import { NoQueue } from '../enums/request-document-type';
import { Queue as RequestQueue } from '../models/work-flow-request.interface';
import { WorkFlowService } from '../work-flow.service';

@Injectable()
export class QueuesService extends AbstractComponentService {

  get EndTicketNo() {
    return this.workFlowService.SettingForm?.get('ticketEnd').value;
  }

  constructor(
    private workFlowService: WorkFlowService,
    private noOfDigitToTicketNumberingFormatPipe: NoOfDigitToTicketNumberingFormatPipe,
    private appNotificationService: AppNotificationService
  ) {
    super();
    this.InitFormGroup();
    this.SetFormGroup(this.GetDefaultQueue());
    this.InitSubjectAndObservables();
  }

  get QueuesSubject(){
    return this.workFlowService.QueuesSubject;
  }

  AddQueueForm: FormGroup;
  public queuesList$: Observable<Queue[]>;
  public OpenQueueDialog$: Observable<boolean>;
  public subjectOpenQueueDialog: BehaviorSubject<boolean>;
  SingleNumberingFormatEnabled$: Observable<boolean>;
  NoQueueName = 'noqueue';

  Mode: string;
  changeListData(data: any) {
    this.workFlowService.QueuesSubject.next(data);
  }

  public InitFormGroup() {
    this.AddQueueForm = this.formBuilder.group({
      id: [],
      name: [null],
      numberingRule: this.formBuilder.group({
        prefix: [null, Validators.required],
        middlefix: [],
        postfix: [null],
      }),
    });
  }

  public SetFormGroup(queue: RequestQueue) {

    this.AddQueueForm.patchValue({
      id: queue.id,
      name: queue.name,
      numberingRule: {
        prefix: queue.numberingRule.prefix,
        postfix: queue.numberingRule.postfix,
        middlefix: queue.numberingRule.middlefix,
      },
    });
  }

  private InitSubjectAndObservables() {
    this.queuesList$ = this.workFlowService.Queues$;
    this.subjectOpenQueueDialog = new BehaviorSubject<boolean>(false);
    this.OpenQueueDialog$ = this.subjectOpenQueueDialog.asObservable();
    this.SingleNumberingFormatEnabled$ = this.workFlowService.SingleNumberingFormatEnabled$;
  }

  public GetDefaultQueue() {
    return {
      id: null,
      name: null,
      numberingRule: {
        prefix: null,
        middlefix: this.GetMiddleFix(),
        postfix: null
      },
    };
  }

  public GetDefaultQueueForSingleQueueConfiguration() {
    return {
      id: this.uuid,
      name: 'Default Queue',
      numberingRule: {
        prefix: 'AOO',
        middlefix: '{00}',
        postfix: 'OOZ'
      },
    };
  }

  private GetMiddleFix() {

    const endTicket = this.noOfDigitToTicketNumberingFormatPipe.transform(Number(this.EndTicketNo));
    return endTicket;
  }

  OpenModal() {
    if ( this.Mode === Mode.Edit){
      this.AddQueueForm.get('numberingRule.middlefix').setValue(this.GetMiddleFix());
    }
    if (this.Mode === Mode.Add) {
      this.AddQueueForm.get('name').clearValidators();
      this.AddQueueForm.get('name').updateValueAndValidity();
    }
    this.subjectOpenQueueDialog.next(true);
  }

  CloseModalAndResetForm() {
    this.subjectOpenQueueDialog.next(false);
    this.AddQueueForm.reset();
  }

  SetEditData(queue: Queue) {
    this.SetFormGroup(queue);
  }

  Add(request: FormGroup): void {
    request.get('name').setValidators(Validators.required);
    request.get('name').updateValueAndValidity();
    if (request.get('name').invalid){
      return;
    }
    let queueName = request.get('name').value;
    queueName = queueName ? queueName.toLowerCase().trim() : '';
    if (queueName && (queueName === NoQueue.toLowerCase() || queueName === this.NoQueueName)){
      this.appNotificationService.NotifyError(CommonMessages.NameIsNotAllowedMessage);
      return;
    }
    const queueNameAlreadyExist = this.workFlowService.GetQueues()
      .some(queue => queue.name.toLowerCase().trim() === queueName && !queue.isDeleted);

    if (queueNameAlreadyExist) {
      request.get('name').setErrors({isExists: true});
      return;
    }

    this.formService.CallFormMethod<RequestQueue>(request).then((response) => {
      response.id = this.uuid;
      this.workFlowService.AddQueue(response);
      this.CloseModalAndResetForm();
    });
  }

  Edit(request: FormGroup): void {
    request.get('name').setValidators(Validators.required);
    request.get('name').updateValueAndValidity();

    if (request.get('name').invalid){
      return;
    }

    const id = request.get('id').value;
    let queueName = request.get('name').value;

    queueName = queueName ? queueName.toLowerCase().trim() : '';
    if (queueName === NoQueue.toLowerCase() || queueName === this.NoQueueName){
      this.appNotificationService.NotifyError(CommonMessages.NameIsNotAllowedMessage);
      return;
    }
    const queueNameAlreadyExist = this.workFlowService.GetQueues()
      .some(queue => queue.name.toLowerCase().trim() === queueName && queue.id !== id && !queue.isDeleted);

    if (queueNameAlreadyExist) {
      request.get('name').setErrors({isExists: true});
      return;
    }

    this.formService.CallFormMethod<RequestQueue>(request).then((response) => {
      this.workFlowService.EditQueue(response);
      this.CloseModalAndResetForm();
    });
  }

  Delete(id: string): void {
    this.workFlowService.CheckConditionsAndDeleteQueue(id);
  }

}
