import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { DefaultAddNewBranchValues } from 'src/app/models/constants/add-new-branch.constant';
import { Validations } from 'src/app/models/constants/validation.constant';
import { DeviceStatus } from 'src/app/models/enums/device-status.enum';
import { AddNewBranchMessages } from 'src/app/models/validation-message/add-new-branch';
import { ORIGIN } from '../../../../../core/tokens/origin.token';
import { ILayoutTemplate } from '../../../models/layout-template.interface';
import { IMobileInterface } from '../../../models/mobile-interface.interface';
import { ITemplate } from '../../../models/template-request.interface';
import { AddNewBranchService } from '../../add-new-branch.service';

@Component({
  selector: 'lavi-mobile-interface',
  templateUrl: './mobile-interface.component.html',
  styleUrls: ['../../add-new-branch.component.scss'],
})
export class MobileInterfaceComponent extends AbstractComponent {

  @Input() MobileList: ITemplate[];

  @Output() SaveNewMobile = new EventEmitter();
  @Output() SaveUpdatedMobile = new EventEmitter();
  @Output() DeleteSaveMobile = new EventEmitter();

  DefaultData = DefaultAddNewBranchValues;
  ValidationMessages = AddNewBranchMessages;
  Validation = Validations;
  OpenMobileDialog: boolean;
  OpenMobileUpdateDialog: boolean;
  IsMessageAll: boolean;
  DeviceStatus = DeviceStatus;
  WorkflowName$: Observable<string>;
  MobileLayoutTemplate$: Observable<ILayoutTemplate[]>;
  LinkTitle: string;
  UnLinkTitle: string;
  StatusId: string;
  Status: string;
  TemplateId: string;

  get MobileForm() {
    return this.addNewBranchService.MobileForm;
  }

  constructor(
    private addNewBranchService: AddNewBranchService,
    @Inject(ORIGIN) private readonly origin: string
    ) {
    super();
    this.addNewBranchService.GetMobiles();
    this.WorkflowName$ = this.addNewBranchService.WorkflowName$;
    this.MobileLayoutTemplate$ = this.addNewBranchService.MobileInterfaceLayoutTemplate$;
    this.addNewBranchService.InitializeMobileForm();
  }

  Init() {
    // Inherited from AbstractComponent to initialize component life cycle
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }

  public OpenAddMobile() {
    this.addNewBranchService.SetMobileInterfaceTemplate(null);
    this.addNewBranchService.ResetWorkFlowName();
    this.OpenMobileDialog = true;
  }

  public OpenMobileUpdateModal(event: IMobileInterface) {
    this.addNewBranchService.SetMobileInterfaceTemplate(event);
    this.SetWorkflow(event.name);
    this.OpenMobileUpdateDialog = true;
  }

  public SetWorkflow(event: ILayoutTemplate) {
    this.addNewBranchService.GetWorkflowName(event?.workFlowId);
  }

  public AddMobileInterface() {
    this.SaveNewMobile.emit(this.MobileForm);
    if (this.MobileForm.valid) {
      this.OpenMobileDialog = false;
      this.MobileForm.reset();
    }
  }

  public SaveEditedMobile() {
    this.SaveUpdatedMobile.emit(this.MobileForm);
    if (this.MobileForm.valid) {
      this.OpenMobileUpdateDialog = false;
      this.MobileForm.reset();
    }
  }

  public DeleteMobileInterface(id: string) {
    this.DeleteSaveMobile.emit(id);
  }

  public DisableSmsTextbox() {
    this.addNewBranchService.DisableTextBox();
  }

  public ModalClose() {
    this.OpenMobileDialog = false;
    this.OpenMobileUpdateDialog = false;
    this.MobileForm.reset();
  }

  public PrintDiv(id: string, printAll: boolean) {
    this.addNewBranchService.PrintQRCode(id, printAll);
  }

  GetMobileExecutionUrl(id: string) {
    const CompanyId = this.addNewBranchService.authService.CompanyId;
    const branchId = this.addNewBranchService.BranchId;
    const URL = `${this.origin}/mobile-execution/${CompanyId}/${branchId}/${id}`;
    return URL;
  }

}
