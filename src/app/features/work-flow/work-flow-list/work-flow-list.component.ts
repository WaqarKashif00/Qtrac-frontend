import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LaviListComponent } from 'src/app/base/lavi-list-component';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { MenuOperationEnum } from 'src/app/models/enums/menu-operation.enum';
import { Menus, ShowMenuItem } from 'src/app/shared/utility-functions/menu-utility-functions';
import { GetDeleteSuccessfulMessage } from '../../../core/utilities/core-utilities';
import { IService } from '../../utility-configuration/agent/utility-services/models/workflow-models/workflow-interface';
import { WorkflowMessages } from '../message-constant';
import { IWorkflowDropDown } from '../models/worflow-dropdown.interface';
import { IWorkFlowResponse } from '../models/work-flow-response.interface';
import { WorkFlowService } from '../work-flow.service';

@Component({
  selector: 'lavi-work-flow-list',
  templateUrl: 'work-flow-list.component.html',
  styleUrls: ['work-flow-list.component.scss'],
  providers: [WorkFlowService],
})
export class WorkFlowListComponent extends LaviListComponent {
  workflowList$: Observable<IWorkFlowResponse[]>;
  List: IWorkflowDropDown[] = [];
  serviceNames: string;
  items: any[] = Menus();

  constructor(
    private workFlowService: WorkFlowService,
    private authStateService: AuthStateService
  ) {
    super();
    this.Init();
  }

  Init() {
    this.SetObservables();
  }

  OnSelect({ item }, dataItem: IWorkflowDropDown) {
    if (item.text == MenuOperationEnum.Edit) {
      this.NavigateToEditPage(dataItem.workFlowId);
    }

    if (item.text == MenuOperationEnum.Duplicate) {
      this.createCopyOfWorkflow(dataItem);
    }

    if (item.text == MenuOperationEnum.Delete) {
      this.deleteWorkflow(dataItem);
    }
  }

  ShowMenuItem(item): boolean {
    return ShowMenuItem(item, this.authStateService.AuthorizationDetails, this.roleActions.WorkflowTemplates);
  }

  SetObservables() {
    this.workflowList$ = this.workFlowService.workflowList$;
  }

  generateServiceNameCSV(service: IService[]) {
    let services = '';
    if (service && Array.isArray(service) && service[0]) {
      for (let i = 0; i < service.length; i++) {
        if (!service[i].isDeleted &&
          service[i].serviceNames &&
          Array.isArray(service[0].serviceNames) &&
          service[0].serviceNames[0]
        ) {
          if ((i != service.length ) && services) {
            services += ', ';
          }
          services += service[i].serviceNames.find(
            (x) => x.isDefault
          ).serviceName;
        }
      }
    }
    return services;
  }

  NavigateToAddPage() {
    this.workFlowService.RemoveWorkFlowIdAndNavigateToAddPage();
  }

  createCopyOfWorkflow(workflow: IWorkflowDropDown) {
    if (confirm(WorkflowMessages.ConfirmCopyMessage)) {
      this.subs.sink = this.workFlowService
        .createCopyOfWorkflow(workflow)
        .subscribe((x) => {
          this.workFlowService.getWorkflowList();
        });
    }
  }

  deleteWorkflow(workflow: IWorkflowDropDown) {
    if (confirm(WorkflowMessages.ConfirmDeleteMessage)) {
      this.subs.sink = this.workFlowService
        .deleteWorkflow(workflow)
        .subscribe((x) => {
          this.workFlowService.AppNotificationService.Notify(GetDeleteSuccessfulMessage('Workflow'));
          this.workFlowService.getWorkflowList();
        });
    }
  }
  
  NavigateToEditPage(Id: string) {
    this.workFlowService.browserStorageService.SetWorkFlowId(Id);
    this.workFlowService.NavigateToEditPage();
  }
}
