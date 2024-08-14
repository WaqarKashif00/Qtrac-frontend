import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetQueryParamsString } from 'src/app/core/utilities/core-utilities';
import {
  IPostCustomers,
  KioskRequest,
} from 'src/app/features/utility-configuration/agent/models/agent-models';
import { Appointment } from 'src/app/features/utility-configuration/agent/models/appointment/appointment.model';
import { QueueUpdateResponse } from 'src/app/features/utility-configuration/agent/models/back-to-queue/delete-queued-customer.model';
import { MoveToPositionResponse } from 'src/app/features/utility-configuration/agent/models/move-to-position/move-to-position-response.model';
import { IQueue } from 'src/app/features/utility-configuration/agent/utility-services/models/agent-signalr/queue.model';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';

@Injectable({ providedIn: 'root' })
export class AgentAPIService {
  get BaseAPIUrl() {
    return this.appConfigService.config.AgentTemplateBaseAPIUrl;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService
  ) {}

  GetAll<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-templates`
    );
  }

  Create<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-templates`,
      data
    );
  }

  Get<T>(companyId: string, templateId: string): Observable<T> {
    return this.formService.GetAPICall<T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-templates/${templateId}`
    );
  }

  Update<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PutAPICall<P, T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-templates`,
      data
    );
  }

  GetDropdownList<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-templates/lookup/list`
    );
  }

  GetViewTypes<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-templates/view-type/list`,
      false
    );
  }

  GetTimeFormats<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-templates/time-format/list`,
      false
    );
  }

  GetTimeDisplayInQueues<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-templates/time-display-in-queue/list`,
      false
    );
  }

  AlreadyExists(
    companyId: string,
    templateId: string,
    templateName: string
  ): Observable<boolean> {
    return this.formService.GetAPICall<boolean>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-templates/${templateId}/exists?templateName=${templateName}`,
      false
    );
  }

  Delete<T>(companyId: string, templateId: string): Observable<T> {
    return this.formService.DeleteAPICall<T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-templates/${templateId}`
    );
  }

  // Execution APIs
  CallCustomers<P, T>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-execution/call-customers`,
      data
    );
  }

  ServeCustomers<P, T>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-execution/serve-customers`,
      data
    );
  }

  ServeCustomersAsDirectCompleteServing(
    companyId: string,
    data: IPostCustomers
  ): Observable<QueueUpdateResponse> {
    return this.formService.PostAPICall<QueueUpdateResponse, IPostCustomers>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-execution/serve-customers?isDirectServe=true`,
      data
    );
  }

  DeleteQueuedCustomers<T>(companyId: string, data: T): Observable<QueueUpdateResponse> {
    return this.formService.PostAPICall<QueueUpdateResponse, T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-execution/delete-queued-customers`,
      data
    );
  }

  CreateGroup<T, P>(
    companyId: string,
    agentId: string,
    data: T
  ): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-execution/agents/${agentId}/groups`,
      data
    );
  }

  UpdateGroup<P, T>(
    companyId: string,
    agentId: string,
    data: T
  ): Observable<P> {
    const URL =
      this.appConfigService.config.AgentTemplateBaseAPIUrl +
      `/api/companies/${companyId}/agent-execution/agents/${agentId}/groups`;
    return this.formService.PutAPICall<P, T>(URL, data);
  }

  DeleteGroup<T>(
    companyId: string,
    agentId: string,
    groupId: string
  ): Observable<T> {
    return this.formService.DeleteAPICall<T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-execution/agents/${agentId}/groups/${groupId}`
    );
  }

  GetGroup<T>(
    companyId: string,
    agentId: string,
    groupId: string
  ): Observable<T> {
    return this.formService.GetAPICall<T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-execution/agents/${agentId}/groups/${groupId}`
    );
  }

  GetAllGroups<T>(companyId: string, agentId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-execution/agents/${agentId}/groups`
    );
  }

  AddCustomersToGroup<T, P>(
    companyId: string,
    agentId: string,
    groupId: string,
    data: T
  ): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-execution/agents/${agentId}/groups/${groupId}/customers`,
      data
    );
  }

  CompleteServing<P, T>(
    companyId: string,
    templateId: string,
    agentId: string,
    data: T
  ): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-execution/templates/${templateId}/agents/${agentId}/served-customers`,
      data
    );
  }

  UpdateMultipleGroups<P, T>(
    companyId: string,
    agentId: string,
    data: T
  ): Observable<P> {
    const URL =
      this.appConfigService.config.AgentTemplateBaseAPIUrl +
      `/api/companies/${companyId}/agent-execution/agents/${agentId}/assign-multiple-groups`;
    return this.formService.PutAPICall<P, T>(URL, data);
  }

  ChangeCustomerPosition<T>(
    companyId: string,
    agentId: string,
    branchId: string,
    templateId: string,
    data: T
  ): Observable<MoveToPositionResponse> {
    return this.formService.PutAPICall<MoveToPositionResponse, T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-execution/agents/${agentId}/branches/${branchId}/templates/${templateId}/waiting-customers?isMoveToPosition=true`,
      data
    );
  }

  CustomerBackToQueue<T>(
    companyId: string,
    agentId: string,
    branchId: string,
    templateId: string,
    data: T
  ): Observable<MoveToPositionResponse> {
    return this.formService.PostAPICall<MoveToPositionResponse, T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-execution/agents/${agentId}/branches/${branchId}/templates/${templateId}/waiting-customers?isSendBackToQueue=true`,
      data
    );
  }

  GetWaitingCustomers<T>(
    companyId: string,
    agentId: string,
    branchId: string,
    templateId: string,
    queueIds: string[]
  ): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(
      `${
        this.BaseAPIUrl
      }/api/companies/${companyId}/agent-execution/agents/${agentId}/branches/${branchId}/templates/${templateId}/waiting-customers?${GetQueryParamsString(
        queueIds,
        (x) => x,
        'queueIds'
      )}`
    );
  }

  DeleteQueuedCustomersExternal<T, P>(
    companyId: string,
    data: T
  ): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/external/companies/${companyId}/agent-execution/mobile-delete-queued-customers`,
      data
    );
  }

  RunningLateMobileExternal<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/external/companies/${companyId}/agent-execution/mobile-running-late-customers`,
      data
    );
  }

  // Messaging APIs
  GetSMSListByRequestId<T>(RequestId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(
      `${this.BaseAPIUrl}/api/agent-messaging/${RequestId}/sms-conversations`
    );
  }

  SendSMSToCustomer<T, P>(RequestId: string, smsBody: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/agent-messaging/${RequestId}/sms-conversations`,
      smsBody
    );
  }

  SendNoteToCustomer<T, P>(RequestId: string, noteBody: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/agent-messaging/${RequestId}/notes`,
      noteBody,
      false
    );
  }

  GetNotesByRequestId<T>(RequestId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(
      `${this.BaseAPIUrl}/api/agent-messaging/${RequestId}/notes`
    );
  }

  GetLastReadNoteByRequestId<T>(
    AgentId: string,
    RequestId: string
  ): Observable<T> {
    return this.formService.GetAPICall<T>(
      `${this.BaseAPIUrl}/api/agent-messaging/${RequestId}/read-notes?agentId=${AgentId}`
    );
  }

  UpdateLastReadNoteByRequestId<T, P>(
    AgentId: string,
    RequestId: string,
    body: P
  ): Observable<T> {
    return this.formService.PostAPICall<T, P>(
      `${this.BaseAPIUrl}/api/agent-messaging/${RequestId}/read-notes?agentId=${AgentId}`,
      body,
      false
    );
  }

  GetAppointmentsByWorkflow(
    companyId: string,
    agentId: string,
    branchId: string,
    workflowId: string
  ): Observable<Appointment[]> {
    return this.formService.GetAPICall<Appointment[]>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-execution/agents/${agentId}/branches/${branchId}/workflows/${workflowId}/appointments`
    );
  }

  CallNextFromBranch(
    companyId: string,
    agentDetails: {
      agentId: string;
      templateId: string;
      branchId: string;
      deskId: string;
      workflowId: string;
      queueId: string;
      groupId: string;
    }
  ): Observable<KioskRequest[]> {
    return this.formService.PostAPICall<KioskRequest[], any>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/agent-execution/agents/${agentDetails.agentId}/branches/${agentDetails.branchId}/templates/${agentDetails.templateId}/desks/${agentDetails.deskId}/waiting-customers/call-next?workflowId=${agentDetails.workflowId}&queueId=${agentDetails.queueId}&groupId=${agentDetails.groupId}`,
      {}
    );
  }

  GetQueue(branchId: string, workflowId: string): Observable<IQueue> {
    return this.formService.GetAPICall<IQueue>(
      `${this.BaseAPIUrl}/api/external/companies/null/agent-execution/queues?branchId=${branchId}&workflowId=${workflowId}`
    );
  }

  GetTextToSpeech(branchId: string, workflowId: string): Observable<any> {
    return this.formService.GetAPICall<any>(
      `${this.BaseAPIUrl}/api/external/companies/null/agent-execution/queues?branchId=${branchId}&workflowId=${workflowId}`
    );
  }
}
