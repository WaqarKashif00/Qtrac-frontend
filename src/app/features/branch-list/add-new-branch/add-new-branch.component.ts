import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ChipRemoveEvent } from '@progress/kendo-angular-buttons';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ICityDropDownList } from 'src/app/models/common/city-dropdown-list.interface';
import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { IStateDropdownList } from 'src/app/models/common/state-dropdown-list.interface';
import { DefaultAddNewBranchValues } from 'src/app/models/constants/add-new-branch.constant';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { Validations } from 'src/app/models/constants/validation.constant';
import { DeviceStatus } from 'src/app/models/enums/device-status.enum';
import { AddNewBranchMessages } from 'src/app/models/validation-message/add-new-branch';
import { ILaviAddress } from 'src/app/shared/api-models/google-models/lavi-address.interface';
import { IDropdownList } from '../models/dropdown-list.interface';
import { ILayoutTemplate } from '../models/layout-template.interface';
import { IMobileInterface } from '../models/mobile-interface.interface';
import { INewBranchDropdownList } from '../models/new-branch-dropdown-list.interface';
import { ITemplate } from '../models/template-request.interface';
import { IWorkFlowUsedInBranchList } from '../models/workflow-used-in-branch-list.interface';
import { AddNewBranchService } from './add-new-branch.service';

@Component({
  selector: 'lavi-add-new-branch',
  templateUrl: './add-new-branch.component.html',
  styleUrls: ['./add-new-branch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AddNewBranchService,
  ],
})
export class AddNewBranchComponent extends AbstractComponent {

  DefaultData = DefaultAddNewBranchValues;
  ValidationMessages = AddNewBranchMessages;
  Validation = Validations;
  IsEditedMode$: Observable<boolean>;
  NewBranchDropdownData$: Observable<INewBranchDropdownList>;
  StateList$: Observable<IStateDropdownList[]>;
  CityList$: Observable<ICityDropDownList[]>;
  KioskList$: Observable<ITemplate[]>;
  MonitorList$: Observable<ITemplate[]>;
  MobileInterfaceList$: Observable<IMobileInterface[]>;
  SelectedMobileTemplates$: Observable<ILayoutTemplate[]>;
  DefaultLanguageList$: Observable<ILanguageDropdownList[]>;
  DeskList$: Observable<IDropdownList[]>;
  WorkFlowUsedInBranchList$: Observable<IWorkFlowUsedInBranchList[]>;
  WorkflowName$: Observable<string>;
  Tags$: Observable<string[]>;
  LinkTitle: string;
  UnLinkTitle: string;
  StatusId: string;
  Status: string;
  TemplateId: string;
  IsMessageAll: boolean;
  DeviceStatus = DeviceStatus;

  get BranchForm() {
    return this.addNewBranchService.BranchForm;
  }
  constructor(private addNewBranchService: AddNewBranchService) {
    super();
    this.SetObservables();
    this.SetInitialData();
  }


  public SetObservables() {
    this.NewBranchDropdownData$ = this.addNewBranchService.NewBranchDropdownListData$;
    this.KioskList$ = this.addNewBranchService.KioskList$;
    this.StateList$ = this.addNewBranchService.States$;
    this.CityList$ = this.addNewBranchService.Cities$
    this.MonitorList$ = this.addNewBranchService.MonitorList$;
    this.MobileInterfaceList$ = this.addNewBranchService.MobileInterfaceList$;
    this.DefaultLanguageList$ = this.addNewBranchService.DefaultLanguageList$;
    this.WorkflowName$ = this.addNewBranchService.WorkflowName$;
    this.DeskList$ = this.addNewBranchService.DeskList$;
    this.IsEditedMode$ = this.addNewBranchService.IsEditMode$;
    this.SelectedMobileTemplates$ = this.addNewBranchService.SelectedMobileTemplates$;
    this.Tags$ = this.addNewBranchService.Tags$;
  }

  public SetInitialData() {
    this.addNewBranchService.CallMultipleApi();
    this.addNewBranchService.GetMobileInterfaceDetails(null);
    this.addNewBranchService.GetDeskDetails(null);
  }

  public BindState(id: string) {
    this.addNewBranchService.BindState(id, null);
  }

  public BindCity(locationDetail:any) {
    this.addNewBranchService.BindCity(locationDetail);
  }

  public ResetCity() {
    this.addNewBranchService.ResetZipCity();
  }

  public ResetZip(){
    this.addNewBranchService.ResetZip()
  }
  public RefreshKioskGrid(template: string) {
    this.addNewBranchService.RefreshKioskGrid(template);
  }
  public RefreshMonitorGrid(template: string) {
    this.addNewBranchService.RefreshMonitorGrid(template);
  }
  public AddKiosk(form: FormGroup) {
    this.addNewBranchService.AddKiosk(form);
  }

  public SaveEditedKiosk(form: FormGroup) {
    this.addNewBranchService.UpdateKioskData(form);
  }

  public DeleteKiosk(event) {
    if (event.status !== DeviceStatus.NotRegistered) {
      this.addNewBranchService.ShowKioskDeleteMessage();
    } else {
      if (confirm(CommonMessages.ConfirmDeleteMessage)) {
        this.addNewBranchService.DeleteKiosk(event.id);
      }
    }
  }

  public AddMonitor(form: FormGroup) {
    this.addNewBranchService.AddMonitor(form);
  }

  public SaveEditedMonitor(form: FormGroup) {
    this.addNewBranchService.UpdateMonitorData(form);
  }

  public DeleteMonitor(event) {
    if (
      event.status !== DeviceStatus.NotRegistered
    ) {
      this.addNewBranchService.ShowMonitorDeleteMessage();
    } else {
      if (confirm(CommonMessages.ConfirmDeleteMessage)) {
        this.addNewBranchService.DeleteMonitor(event.id);
      }
    }
  }

  public AddMobileInterface(form: FormGroup) {
    this.addNewBranchService.AddMobileInterface(form);
  }

  public SaveEditedMobile(form: FormGroup) {
    this.addNewBranchService.UpdateMobileData(form);
  }

  public DeleteMobileInterface(id: string) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.addNewBranchService.DeleteMobile(id);
    }
  }

  public AddDefaultLanguage(event: ILanguageDropdownList[]) {
    this.addNewBranchService.AddLanguage(event);
  }

  public AddressChange(address:ILaviAddress){
    this.addNewBranchService.AddressChanged(address);
  }

  public StandByKioskDevice(event) {
    this.addNewBranchService.StandByKioskDevice(event.id, event.browserId);
  }

  public ResumeKioskDevice(event) {
    this.addNewBranchService.ResumeKioskDevice(event.template, event.id, event.browserId);
  }

  public SendMessageToKioskDevice(event) {
    this.addNewBranchService.SendMessageKioskDevice(event.form);
  }

  public SendMessageToAllKioskDevice(event) {
    this.addNewBranchService.SendMessageToAllKioskDevice(event.form);
  }

  public DeRegisterKioskDevice(event) {
    this.addNewBranchService.DeRegisterKioskDevice(event.template, event.id, event.browserId);
  }

  public LinkKioskDevice(event) {
    this.addNewBranchService.LinkKioskDevice(event.template, event.form);
  }

  public ShutDownKioskDevice({ template, id, browserId, form }) {
    this.addNewBranchService.ShutDownKioskDevice(template, id, browserId, form);
  }

  public StandByMonitorDevice(event) {
    this.addNewBranchService.StandByMonitorDevice(event.template, event.id);
  }

  public DeRegisterMonitorDevice(event) {
    this.addNewBranchService.DeRegisterMonitorDevice(event.template, event.id, event.browserId);
  }

  public LinkMonitorDevice(event) {
    this.addNewBranchService.LinkMonitorDevice(event.template, event.form);
  }

  public ShutDownMonitorDevice({ template, id, browserId, form }) {
    this.addNewBranchService.ShutDownMonitorDevice(template, id, browserId, form);
  }

  public ResumeMonitorDevice(event) {
    this.addNewBranchService.ResumeMonitorDevice(event.template, event.id, event.browserId);
  }

  public SendMessageToAllMonitorDevice(event) {
    this.addNewBranchService.SendMessageToAllMonitorDevice(event.form);
  }

  public AddDesk(form: FormGroup) {
    this.addNewBranchService.AddDesk(form);
  }

  public SaveEditedDesk(form: FormGroup) {
    this.addNewBranchService.UpdateDeskData(form);
  }

  public DeleteDesk(id: string) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.addNewBranchService.DeleteDesk(id);
    }
  }

  public Save() {
    this.addNewBranchService.SaveOrUpdateBranch(this.BranchForm);
  }

  public Cancel() {
    this.addNewBranchService.RedirectToBranchList();
  }

  public GetCompanyGeneralSettingsInfo(event) {
    this.addNewBranchService.GetCompanyGeneralSettingsInfo(event);
  }


  public AddTagOnEnter() {
    this.addNewBranchService.EnterTag();
  }

  public RemoveTag(e: ChipRemoveEvent) {
    this.addNewBranchService.RemoveTags(e);
  }

  public SetDefaultLanguage(data){
    this.addNewBranchService.SetDefaultLanguage(data);
  }

  ShowURLCopied() {
    this.addNewBranchService.ShowURLCopied();
  }
}
