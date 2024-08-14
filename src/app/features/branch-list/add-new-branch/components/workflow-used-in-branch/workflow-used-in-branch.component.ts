import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AppNotificationService } from 'src/app/core/services/notification.service';
import { IServiceDropdown } from 'src/app/models/common/service.dropdown.interface';
import { IWorkFlowDropdown } from 'src/app/models/common/workflow-dropdown.interface';
import { DefaultAddNewBranchValues } from 'src/app/models/constants/add-new-branch.constant';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { Validations } from 'src/app/models/constants/validation.constant';
import { AddNewBranchMessages } from 'src/app/models/validation-message/add-new-branch';
import { BranchMessages } from '../../../message';
import { IWorkFlowUsedInBranchList } from '../../../models/workflow-used-in-branch-list.interface';
import { AddNewBranchService } from '../../add-new-branch.service';

@Component({
  selector: 'lavi-workflow-used-in-branch',
  templateUrl: './workflow-used-in-branch.component.html',
  styleUrls: ['../../add-new-branch.component.scss'],
})
export class WorkflowUsedInBranchComponent extends AbstractComponent {

  DefaultData = DefaultAddNewBranchValues;
  ValidationMessages = AddNewBranchMessages;
  Validation = Validations;
  OpenWorkFlowUsedInBranchDialog$: Observable<boolean>;
  WorkFlows$: Observable<IWorkFlowDropdown[]>;
  Services$: Observable<IServiceDropdown[]>;
  WorkFlowUsedInBranchList$: Observable<IWorkFlowUsedInBranchList[]>;
  isEditMode: boolean;
  Title: string;

  get WorkFlowUsedInBranchForm() {
    return this.addNewBranchService.WorkflowUsedInBranchForm;
  }

  constructor(private addNewBranchService: AddNewBranchService, private AppNotificationService : AppNotificationService) {
    super();
  }

  Init() {
    this.addNewBranchService.SetWorkflowList();
    this.SetInitialValues();
    // Inherited from AbstractComponent to initialize component life cycle
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }

  private SetInitialValues() {
    this.WorkFlows$ = this.addNewBranchService.Workflows$;
    this.Services$ = this.addNewBranchService.Services$;
    this.OpenWorkFlowUsedInBranchDialog$ = this.addNewBranchService.OpenWorkFlowUsedInBranchDialog$;
    this.WorkFlowUsedInBranchList$ = this.addNewBranchService.WorkflowUsedInBranchList$;
    this.addNewBranchService.InitializeWorkflowUsedInBranchForm();
  }

  public OpenWorkflowUsedInBranchModal(
    isEdit: boolean,
    event?: IWorkFlowUsedInBranchList
  ) {
    this.addNewBranchService.IsWorkflowEditMode = this.isEditMode = isEdit;
    this.addNewBranchService.OpenWorkFlowUsedInBranchModal(true);
    this.Title = BranchMessages.WorkflowAddTitle;
    this.onEditMode(isEdit, event);
    this.DisableServiceDropDown();
  }

  private onEditMode(isEdit: boolean, event: IWorkFlowUsedInBranchList) {
    if (isEdit) {
      this.Title = BranchMessages.WorkflowUpdateTitle;
      this.addNewBranchService.SetServices(event?.workFlowId);
      this.addNewBranchService.SetWorkflowUsedInBranchForm(event);
    }else{
      this.addNewBranchService.SetServices(null);
    }
  }

  public AddOrEditWorkflowUsedInBranch() {
    if (!this.isEditMode) {
      this.addNewBranchService.AddWorkflowUsedInBranch(
        this.WorkFlowUsedInBranchForm
      );
    } else {
      this.addNewBranchService.UpdateWorkflowUsedInBranch(
        this.WorkFlowUsedInBranchForm
      );
    }
  }

  public DeleteWorkFlowUsedInBranch(id: string) {
    let workflowId = this.addNewBranchService.getWorkflowIdFromListIfMatched(id);
    let isWorkflowAlreadyInuse = this.addNewBranchService.CheckWorkflowIsInUse(workflowId);

    if(!isWorkflowAlreadyInuse.byKiosk && !isWorkflowAlreadyInuse.byMobileInterface && !isWorkflowAlreadyInuse.byMonitor){
      if (confirm(CommonMessages.ConfirmDeleteMessage)) {
        this.addNewBranchService.DeleteWorkflowUsedInBranch(id);
      }
    }else{
      let message = isWorkflowAlreadyInuse.byKiosk ? "kiosk " : "";
      message += isWorkflowAlreadyInuse.byMonitor && isWorkflowAlreadyInuse.byKiosk ? " / Monitor" : isWorkflowAlreadyInuse.byMonitor ? "Monitor" : "";
      message += (isWorkflowAlreadyInuse.byMonitor || isWorkflowAlreadyInuse.byKiosk ) && isWorkflowAlreadyInuse.byMobileInterface ? " / Mobile Interface" : isWorkflowAlreadyInuse.byMobileInterface ? "Mobile Interface" : "";

      this.AppNotificationService.NotifyError("workflow already in use by "+ message);
    }

  }

  public GetServicesForList(workFlowId: string, servicesId: string[]) {
    const services = this.addNewBranchService.GetServices(workFlowId);
    if (services && services.length > 0) {
      return this.GenerateCSVStringForService(
        services.filter((x) => servicesId.includes(x.id))
      );
    }
    return '';
  }

  public SetServices(event: IWorkFlowDropdown) {
    this.addNewBranchService.SetServices(event.workFlowId);
  }

  public DisableServiceDropDown() {
    this.addNewBranchService.DisableServiceDropDown();
  }

  public GenerateCSVStringForService(
    services: Array<IServiceDropdown>
  ): string {
    return services.map((x) => x.serviceName).join(', ');
  }

  public ModalClose() {
    this.addNewBranchService.ResetAndCloseWorkFlowModal(
      this.WorkFlowUsedInBranchForm
    );
  }

}
