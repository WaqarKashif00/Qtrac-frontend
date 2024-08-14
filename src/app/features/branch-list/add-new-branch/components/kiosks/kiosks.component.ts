import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { DefaultAddNewBranchValues } from 'src/app/models/constants/add-new-branch.constant';
import { Validations } from 'src/app/models/constants/validation.constant';
import { DeviceStatus } from 'src/app/models/enums/device-status.enum';
import { AddNewBranchMessages } from 'src/app/models/validation-message/add-new-branch';
import { Mode } from '../../../../../models/enums/mode.enum';
import { BranchMessages } from '../../../message';
import { IDropdownList } from '../../../models/dropdown-list.interface';
import { ILayoutTemplate } from '../../../models/layout-template.interface';
import { PrinterTemplate } from '../../../models/printer-dropdown-list.interface';
import { ITemplate } from '../../../models/template-request.interface';
import { AddNewBranchService } from '../../add-new-branch.service';

@Component({
  selector: 'lavi-kiosks',
  templateUrl: './kiosks.component.html',
  styleUrls: ['../../add-new-branch.component.scss'],
})
export class KiosksComponent extends AbstractComponent {

  @Input() KioskList: ITemplate[];
  @Input() KioskTemplate: ILayoutTemplate;
  @Input() NumberList: number[];
  @Input() TimeIntervals: IDropdownList[];

  @Output() SaveAddedKiosk = new EventEmitter();
  @Output() SaveUpdatedKiosk = new EventEmitter();
  @Output() SaveDeletedKiosk = new EventEmitter();
  @Output() SaveLinkDevice = new EventEmitter();
  @Output() ShutdownDevice = new EventEmitter();
  @Output() RefreshKiosk = new EventEmitter();
  @Output() StandByDeviceStatus = new EventEmitter();
  @Output() ResumeDeviceStatus = new EventEmitter();
  @Output() DeRegisterDeviceStatus = new EventEmitter();
  @Output() SendMessageToKiosk = new EventEmitter();
  @Output() SendMessageToAllKiosk = new EventEmitter();
  @Output() OnURLCopy: EventEmitter<void> = new EventEmitter<void>();

  DefaultData = DefaultAddNewBranchValues;
  ValidationMessages = AddNewBranchMessages;
  Validation = Validations;
  OpenKioskDialog: boolean;
  OpenKioskMsgDialog: boolean;
  OpenKioskLiveDialog: boolean;
  OpenKioskDeviceLinkDialog: boolean;
  OpenKioskDeviceUnLinkDialog: boolean;
  IsMessageAll: boolean;
  DeviceStatus = DeviceStatus;
  WorkflowName$: Observable<string>;
  KioskLayoutTemplate$: Observable<ILayoutTemplate[]>;
  MobileLayoutTemplate$: Observable<ILayoutTemplate[]>;
  KioskPrinters$: Observable<PrinterTemplate[]>;
  LinkTitle: string;
  UnLinkTitle: string;
  StatusId: number;
  Status: string;
  TemplateId: string;
  BrowserId: string;
  DefaultShutdownTime = 1;

  Mode = Mode.Add;
  CRUDMode = Mode;

  get TemplateForm() {
    return this.addNewBranchService.TemplateForm;
  }

  get LinkDeviceForm() {
    return this.addNewBranchService.LinkDeviceForm;
  }

  get MessageForm() {
    return this.addNewBranchService.MessageForm;
  }

  get LiveForm() {
    return this.addNewBranchService.LiveForm;
  }

  get DeviceRegistrationURL() {
    return `${window.location.origin}/device-registration?c-id=${this.CompanyId}`;
  }

  get ModalTitle() {
    return this.Mode === Mode.Add ? 'Add Kiosk' : 'Update Kiosk';
  }

  get CompanyId() {
    return this.addNewBranchService.browserStorageService.CurrentSelectedCompanyId;
  };

  constructor(private addNewBranchService: AddNewBranchService, private clipboardService: ClipboardService) {
    super();
  }

  Init() {
    this.addNewBranchService.SetKioskList();
    this.SetInitialValues();
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }

  private SetInitialValues() {
    this.WorkflowName$ = this.addNewBranchService.WorkflowName$;
    this.KioskLayoutTemplate$ = this.addNewBranchService.KioskLayoutTemplate$;
    this.MobileLayoutTemplate$ = this.addNewBranchService.MobileInterfacesByKioskWorkflowId$;
    this.KioskPrinters$ = this.addNewBranchService.KioskPrinters$;
    this.subs.sink = this.addNewBranchService.IsShutdownSuccessFully$.subscribe(IsShutdown => {
      if (IsShutdown) {
        this.ModalClose();
      }
    });
    this.addNewBranchService.InitializeTemplateForm();
    this.addNewBranchService.InitializeLinkDeviceForm();
    this.addNewBranchService.InitializeMessageForm();
    this.addNewBranchService.InitializeLiveForm();
  }

  public OpenAddKiosk() {
    this.Mode = Mode.Add;
    this.addNewBranchService.SetKioskTemplate(null);
    this.OpenKioskDialog = true;
    this.addNewBranchService.deviceIdFormControl.enable();
    this.addNewBranchService.ResetWorkFlowName();
    this.addNewBranchService.ResetMobileInterfacesOfKiosk();

  }

  public OpenKioskMessageModal(messageAll: boolean, kioskId?: string, browserId?: string) {
    this.IsMessageAll = messageAll;
    this.OpenKioskMsgDialog = true;
    if (kioskId) {
      this.TemplateId = kioskId;
    }
    if (browserId) {
      this.BrowserId = browserId;
    }
  }

  public OpenKioskLiveModal(id: string) {
    this.addNewBranchService.InitializeLiveForm();
    this.TemplateId = id;
    this.OpenKioskLiveDialog = true;
  }

  public OpenKioskLinkDialog(title: string, id: string) {
    this.LinkTitle = title;
    this.LinkDeviceForm.get('id').setValue(id);
    this.OpenKioskDeviceLinkDialog = true;
  }

  public OpenKioskUnLinkDialog(title: string, statusId: number, id: string, browserId: string = null) {
    this.UnLinkTitle = title;
    this.StatusId = statusId;
    if (statusId === DeviceStatus.Live) {
      this.Status = 'Live';
    } else if (statusId === DeviceStatus.Standby) {
      this.Status = 'Stand by';
    } else if (statusId === DeviceStatus.Offline) {
      this.Status = 'Offline';
    } else {
      this.Status = 'Not Registered';
    }
    this.TemplateId = id;
    this.BrowserId = browserId;
    this.OpenKioskDeviceUnLinkDialog = true;
  }

  public OpenKioskUpdateModal(event: ITemplate) {

    this.addNewBranchService.SetKioskTemplate(event);
    this.Mode = Mode.Edit;
    this.OpenKioskDialog = true;
  }

  public SaveKiosk() {
    if (this.Mode === Mode.Add) {
      this.SaveAddedKiosk.emit(this.TemplateForm);
    } else {
      this.SaveUpdatedKiosk.emit(this.TemplateForm);
    }
    if (this.TemplateForm.valid) {
      this.OpenKioskDialog = false;
      this.TemplateForm.reset();
    }
  }

  public DeleteKiosk(id: string, status: string) {
    this.SaveDeletedKiosk.emit({ id, status });
  }

  public LinkDevice(template: string) {
    this.SaveLinkDevice.emit({ template, form: this.LinkDeviceForm });
    if (this.LinkDeviceForm.valid) {
      this.LinkDeviceForm.reset();
      this.OpenKioskDeviceLinkDialog = false;
    }
  }

  public ShutDownDevice(template: string, id: string) {
    this.ShutdownDevice.emit({ template, id, browserId: this.BrowserId, form: this.LiveForm });
    if (this.LiveForm.valid) {
      this.LiveForm.reset();
      this.OpenKioskLiveDialog = false;
    }
  }

  public RefreshGrid(template: string) {
    this.RefreshKiosk.emit(template);
  }

  public StandByDevice(template: string, id: string) {
    const browserId = this.BrowserId;
    this.StandByDeviceStatus.emit({ template, id, browserId });
    this.OpenKioskDeviceUnLinkDialog = false;
  }

  public ResumeDevice(template: string, id: string) {
    const browserId = this.BrowserId;
    this.ResumeDeviceStatus.emit({ template, id, browserId });
    this.OpenKioskDeviceUnLinkDialog = false;
  }

  public DeRegisterDevice(template: string, id: string) {
    if (confirm(BranchMessages.KioskDeRegisterConfirmationMessage)) {
      const browserId = this.BrowserId;
      this.DeRegisterDeviceStatus.emit({ template, id, browserId });
      this.OpenKioskDeviceUnLinkDialog = false;
    }
  }

  public SendMessage() {
    this.MessageForm.get('browserId').setValue(this.BrowserId);
    this.MessageForm.get('kioskId').setValue(this.TemplateId);
    if (this.MessageForm.valid) {
      if (this.IsMessageAll) {
        this.SendMessageToAllKiosk.emit({ form: this.MessageForm });
      } else {
        this.SendMessageToKiosk.emit({ form: this.MessageForm });
      }
      this.MessageForm.reset();
      this.OpenKioskMsgDialog = false;
    }
  }

  public SendMessageToDevice() {
    this.addNewBranchService.SendMsgToKioskDevice();
  }

  public RefreshDevice() {
    this.addNewBranchService.RefreshDevice(this.TemplateId, this.BrowserId);
    this.OpenKioskDeviceUnLinkDialog = false;
  }

  public SetWorkflowAndMobileInterfaces(event: ILayoutTemplate) {
    this.addNewBranchService.GetWorkflowName(event?.workFlowId);
    this.addNewBranchService.GetMobileInterfaceByKioskWorkflowId(event?.workFlowId);
  }

  public ModalClose() {
    this.OpenKioskDialog = false;
    this.OpenKioskMsgDialog = false;
    this.OpenKioskLiveDialog = false;
    this.OpenKioskDeviceLinkDialog = false;
    this.OpenKioskDeviceUnLinkDialog = false;
    this.TemplateForm.reset();
    this.LinkDeviceForm.reset();
    this.MessageForm.reset();
    this.LiveForm.reset();
  }

  get deviceIdFormControl(){
    return this.addNewBranchService.deviceIdFormControl;
  }

  get LinkDeviceIdFormControl(){
    return this.addNewBranchService.LinkDeviceIdFormControl;
  }

  CopyURLAndShowCopiedDialog() {
    this.clipboardService.copy(this.DeviceRegistrationURL);
    this.OnURLCopy.emit();
  }
}
