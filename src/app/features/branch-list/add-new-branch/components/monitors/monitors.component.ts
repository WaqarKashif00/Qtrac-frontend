import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { DefaultAddNewBranchValues } from 'src/app/models/constants/add-new-branch.constant';
import { Validations } from 'src/app/models/constants/validation.constant';
import { DeviceStatus } from 'src/app/models/enums/device-status.enum';
import { AddNewBranchMessages } from 'src/app/models/validation-message/add-new-branch';
import { ILanguageDropdownList } from '../../../../../models/common/language-dropdownlist.interface';
import { Mode } from '../../../../../models/enums/mode.enum';
import { BranchMessages } from '../../../message';
import { IDropdownList } from '../../../models/dropdown-list.interface';
import { ILayoutTemplate } from '../../../models/layout-template.interface';
import { ITemplate } from '../../../models/template-request.interface';
import { AddNewBranchService } from '../../add-new-branch.service';

@Component({
  selector: 'lavi-monitors',
  templateUrl: './monitors.component.html',
  styleUrls: ['../../add-new-branch.component.scss'],
})
export class MonitorsComponent extends AbstractComponent {

  @Input() MonitorList: ITemplate[];
  @Input() MonitorTemplate: ILayoutTemplate;
  @Input() NumberList: string[];
  @Input() TimeIntervals: IDropdownList[];
  @Input() Languages: ILanguageDropdownList[];

  @Output() SaveAddedMonitor = new EventEmitter();
  @Output() SaveUpdatedMonitor = new EventEmitter();
  @Output() SaveDeletedMonitor = new EventEmitter();
  @Output() SaveLinkDevice = new EventEmitter();
  @Output() ShutdownDevice = new EventEmitter();
  @Output() RefreshADevice = new EventEmitter();
  @Output() RefreshMonitor = new EventEmitter();
  @Output() StandByDeviceStatus = new EventEmitter();
  @Output() ResumeDeviceStatus = new EventEmitter();
  @Output() DeRegisterDeviceStatus = new EventEmitter();
  @Output() SendMessageToMonitor = new EventEmitter();
  @Output() SendMessageToAllMonitor = new EventEmitter();
  @Output() OnURLCopy: EventEmitter<void> = new EventEmitter<void>();

  DefaultData = DefaultAddNewBranchValues;
  ValidationMessages = AddNewBranchMessages;
  Validation = Validations;
  OpenMonitorDialog: boolean;
  OpenMonitorMsgDialog: boolean;
  OpenMonitorLiveDialog: boolean;
  OpenMonitorDeviceLinkDialog: boolean;
  OpenMonitorDeviceUnLinkDialog: boolean;
  IsMessageAll: boolean;
  DeviceStatus = DeviceStatus;
  WorkflowName$: Observable<string>;
  MonitorLayoutTemplate$: Observable<ILayoutTemplate[]>;
  LinkTitle: string;
  UnLinkTitle: string;
  StatusId: number;
  Status: string;
  TemplateId: string;
  BrowserId: string;

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

  get CompanyId() {
    return this.addNewBranchService.browserStorageService.CurrentSelectedCompanyId;
  };

  get ModalTitle() {
    return this.Mode === Mode.Add ? 'Add Monitor' : 'Update Monitor';
  }

  constructor(private addNewBranchService: AddNewBranchService ,private clipboardService: ClipboardService) {
    super();
    this.addNewBranchService.SetMonitorList();
    this.SetInitialValues();
  }

  Init() {
    // Inherited from AbstractComponent to initialize component life cycle
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }

  private SetInitialValues() {
    this.WorkflowName$ = this.addNewBranchService.WorkflowName$;
    this.MonitorLayoutTemplate$ = this.addNewBranchService.MonitorLayoutTemplate$;
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

  public OpenAddMonitor() {
    this.Mode = Mode.Add;
    this.addNewBranchService.SetMonitorTemplate(null);
    this.OpenMonitorDialog = true;
    this.addNewBranchService.deviceIdFormControl.enable();
    this.addNewBranchService.ResetWorkFlowName();
  }

  public OpenMonitorMessageModal(messageAll: boolean, kioskId?: string, browserId?: string) {
    this.IsMessageAll = messageAll;
    this.OpenMonitorMsgDialog = true;
    if (kioskId) {
      this.TemplateId = kioskId;
    }
    if (browserId) {
      this.BrowserId = browserId;
    }
  }

  public OpenMonitorLiveModal(id: string) {
    this.addNewBranchService.InitializeLiveForm();
    this.TemplateId = id;
    this.OpenMonitorLiveDialog = true;
  }

  public OpenMonitorLinkDialog(title: string, id: string) {
    this.LinkTitle = title;
    this.LinkDeviceForm.get('id').setValue(id);
    this.OpenMonitorDeviceLinkDialog = true;
  }

  public OpenMonitorUnLinkDialog(title: string, statusId: number, id: string, browserId: string = null) {
    this.UnLinkTitle = title;
    this.StatusId = statusId;
    if (statusId === (DeviceStatus.Live)) {
      this.Status = 'Live';
    }
    else if (statusId === (DeviceStatus.Standby)) {
      this.Status = 'Stand by';
    }
    else if (statusId === (DeviceStatus.Offline)) {
      this.Status = 'Offline';
    }
    else {
      this.Status = 'Not Registered';
    }
    this.TemplateId = id;
    this.BrowserId = browserId;
    this.OpenMonitorDeviceUnLinkDialog = true;
  }

  public OpenMonitorUpdateModal(event: ITemplate) {
    this.Mode = Mode.Edit;
    this.addNewBranchService.SetMonitorTemplate(event);
    this.OpenMonitorDialog = true;
  }

  public SaveMonitor() {
    if (this.Mode === Mode.Add) {
      this.SaveAddedMonitor.emit(this.TemplateForm);
    } else {
      this.SaveUpdatedMonitor.emit(this.TemplateForm);
    }
    if (this.TemplateForm.valid) {
      this.OpenMonitorDialog = false;
      this.TemplateForm.reset();
    }
  }

  public DeleteMonitor(id: string, status: string) {
    this.SaveDeletedMonitor.emit({ id, status });
  }

  public LinkDevice(template: string) {
    this.SaveLinkDevice.emit({ template, form: this.LinkDeviceForm });
    if (this.LinkDeviceForm.valid) {
      this.LinkDeviceForm.reset();
      this.OpenMonitorDeviceLinkDialog = false;
    }
  }

  public ShutDownDevice(template: string, id: string) {
    this.ShutdownDevice.emit({ template, id, browserId: this.BrowserId, form: this.LiveForm });
    if (this.LiveForm.valid) {
      this.OpenMonitorLiveDialog = false;
    }
  }

  public RefreshGrid(template: string) {
    this.RefreshMonitor.emit(template);
  }

  public StandByDevice(template: string, id: string) {
    this.StandByDeviceStatus.emit({ template, id, browserId: this.BrowserId });
    this.OpenMonitorDeviceUnLinkDialog = false;
  }

  public ResumeDevice(template: string, id: string) {
    this.ResumeDeviceStatus.emit({ template, id, browserId: this.BrowserId });
    this.OpenMonitorDeviceUnLinkDialog = false;
  }

  public DeRegisterDevice(template: string, id: string) {
    if (confirm(BranchMessages.MonitorDeRegisterConfirmationMessage)) {
      this.DeRegisterDeviceStatus.emit({ template, id, browserId: this.BrowserId });
      this.OpenMonitorDeviceUnLinkDialog = false;
    }
  }

  public SendMessage() {
    this.MessageForm.get('browserId').setValue(this.BrowserId);
    this.MessageForm.get('kioskId').setValue(this.TemplateId);
    if (this.MessageForm.valid) {
      if (this.IsMessageAll) {
        this.SendMessageToAllMonitor.emit({ form: this.MessageForm })
      } else {
        this.SendMessageToMonitor.emit({ form: this.MessageForm })
      }
      this.MessageForm.reset();
      this.OpenMonitorMsgDialog = false;
    }
  }

  public SendMessageToDevice() {
    this.addNewBranchService.SendMsgToMonitorDevice();
  }

  public RefreshDevice() {
    this.addNewBranchService.RefreshDevice(this.TemplateId, this.BrowserId);
    this.OpenMonitorDeviceUnLinkDialog = false;
  }

  public SetWorkflow(event: ILayoutTemplate) {
    this.addNewBranchService.GetWorkflowName(event?.workFlowId);
  }

  public ModalClose() {
    this.OpenMonitorDialog = false;
    this.OpenMonitorMsgDialog = false;
    this.OpenMonitorLiveDialog = false;
    this.OpenMonitorDeviceLinkDialog = false;
    this.OpenMonitorDeviceUnLinkDialog = false;
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
