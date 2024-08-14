import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractService } from 'src/app/base/abstract-service';
import { IWorkFlowRequest } from 'src/app/features/work-flow/models/work-flow-request.interface';
import { DocumentType, VariablePurpose, VariableRequest, VariableRequestDocument } from 'src/app/models/enums/variables-related';
import { DynamicVariable } from '../../features/work-flow/models/conditional-events';
import { DynamicVariablesApiService } from '../../shared/api-services/dyanamic-variables-api.service';

@Injectable({ providedIn: 'root' })
export class DynamicVariableService extends AbstractService {

  DynamicVariablesSubject: BehaviorSubject<DynamicVariable[]>;
  DynamicVariables$: Observable<DynamicVariable[]>;

  constructor(
    private readonly dynamicVariablesService: DynamicVariablesApiService
  ) {
    super();
    this.InitializeObservables();
  }

  InitializeObservables(){
    this.DynamicVariablesSubject = new BehaviorSubject<DynamicVariable[]>([]);
    this.DynamicVariables$ = this.DynamicVariablesSubject.asObservable();
  }

  GetDynamicVariables(WorkFlow, isDoc?: boolean, isAppointment?: boolean, includeQuestions = true) {
    const documents = this.GetRequestDocument(WorkFlow, isDoc, isAppointment);

    return this.dynamicVariablesService.GetVariables<VariableRequest, DynamicVariable[]>(
      {
        purpose: VariablePurpose.Dynamic,
        documents
      },
      includeQuestions, false);
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
    return documents;
  }

  GetEventVariables(WorkFlow, QuestionSetId?: string, isDoc?: boolean) {
    return this.dynamicVariablesService.GetVariables<VariableRequest, DynamicVariable[]>(
      {
        purpose: VariablePurpose.Events,
        documents: [
          this.GetWorkFlowDocument(WorkFlow, isDoc),
          {
            documentType: DocumentType.CustomerRequest,
            document: {}
          }
        ]
      },
      QuestionSetId ? QuestionSetId : true , false);
  }

  GetConditionalVariables(WorkFlow, QuestionSetId?: string, isDoc?: boolean) {
    return this.dynamicVariablesService.GetVariables<VariableRequest, DynamicVariable[]>(
      {
        purpose: VariablePurpose.Conditional,
        documents: [
          this.GetWorkFlowDocument(WorkFlow, isDoc),
          {
            documentType: DocumentType.CustomerRequest,
            document: {}
          }
        ]
      },
      QuestionSetId ? QuestionSetId : true , false);
  }

  GetAlertVariables(WorkFlow, isDoc?: boolean) {
    return this.dynamicVariablesService.GetVariables<VariableRequest, DynamicVariable[]>(
      {
        purpose: VariablePurpose.Alerts,
        documents: [
          this.GetWorkFlowDocument(WorkFlow, isDoc),
          {
            documentType: DocumentType.CustomerRequest,
            document: {}
          }
        ]
      },
      true, true);
  }

  GetDynamicVariablesReplacedStrings(StringsToReplace, WorkFlow, customerRequest, isDoc?: boolean) {
    return this.dynamicVariablesService.ReplaceDynamicVariables<VariableRequest, DynamicVariable[]>(
      {
        purpose: '',
        stringsToReplace: StringsToReplace,
        documents: [
          this.GetWorkFlowDocument(WorkFlow, isDoc),
          {
            documentType: DocumentType.CustomerRequest,
            document: customerRequest
          }
        ]
      });
  }



  GetDynamicVariablesReplacedStringsWithId(StringsToReplace, WorkFlow, customerRequest, isDoc?: boolean) {
    return this.dynamicVariablesService.ReplaceDynamicVariables<VariableRequest, DynamicVariable[]>(
      {
        purpose: '',
        stringsToReplace: StringsToReplace,
        documents: [
          this.GetWorkFlowDocument(WorkFlow, isDoc),
          this.GetDocuments(customerRequest)
        ]
      });
  }


  private GetWorkFlowDocument(WorkFlow: IWorkFlowRequest , isDoc: boolean, ): VariableRequestDocument {
    return {
      documentType: DocumentType.Workflow,
      id: isDoc ? null : WorkFlow.workFlowId,
      pk: isDoc ? null : WorkFlow.pk,
      document: isDoc ? WorkFlow : null
    };
  }

  private GetDocuments(data) {
   data.documentType = DocumentType.CustomerRequest
   return data
  }

}
