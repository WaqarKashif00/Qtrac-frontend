import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { DefaultAddNewBranchValues } from 'src/app/models/constants/add-new-branch.constant';
import { Validations } from 'src/app/models/constants/validation.constant';
import { DeviceStatus } from 'src/app/models/enums/device-status.enum';
import { AddNewBranchMessages } from 'src/app/models/validation-message/add-new-branch';
import { IDropdownList } from '../../../models/dropdown-list.interface';
import { AddNewBranchService } from '../../add-new-branch.service';

@Component({
  selector: 'lavi-desks',
  templateUrl: './desks.component.html',
  styleUrls: ['../../add-new-branch.component.scss'],
})
export class DesksComponent extends AbstractComponent {

  @Input() DeskList: IDropdownList[];

  @Output() SaveNewDesk = new EventEmitter();
  @Output() SaveUpdatedDesk = new EventEmitter();
  @Output() DeleteSavedDesk = new EventEmitter();

  DefaultData = DefaultAddNewBranchValues;
  ValidationMessages = AddNewBranchMessages;
  Validation = Validations;
  OpenDeskDialog: boolean;
  OpenDeskUpdateDialog: boolean;
  IsMessageAll: boolean;
  DeviceStatus = DeviceStatus;

  get DeskForm(){
    return this.addNewBranchService.DeskForm;
  }

  constructor(private addNewBranchService: AddNewBranchService){
    super();
    this.addNewBranchService.GetDesks();
    this.addNewBranchService.InitializeDeskForm();
  }

  Init() {
    // Inherited from AbstractComponent to initialize component life cycle
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }

  public OpenDeskModal(){
    this.DeskForm.reset();
    this.OpenDeskDialog = true;
  }

  public AddDesk(){
    this.SaveNewDesk.emit(this.DeskForm);
    if (this.DeskForm.valid){
    this.OpenDeskDialog = false;
    }
  }
  public OpenDeskUpdateModal(event: IDropdownList){
    this.addNewBranchService.DeskDeskFormData(event);
    this.OpenDeskUpdateDialog = true;
  }

  public SaveEditedDesk(){
    this.SaveUpdatedDesk.emit(this.DeskForm);
    if (this.DeskForm.valid)
    {
      this.OpenDeskUpdateDialog = false;
      this.DeskForm.reset();
    }
  }

  public DeleteDesk(id: string){
    this.DeleteSavedDesk.emit(id);
  }

  public ModalClose(){
    this.OpenDeskDialog = false;
    this.OpenDeskUpdateDialog = false;
    this.DeskForm.reset();
    }

}
