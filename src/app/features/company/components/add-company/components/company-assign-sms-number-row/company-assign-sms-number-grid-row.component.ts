import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { cloneObject } from 'src/app/core/utilities/core-utilities';
import { IBranchDropdownDetails } from 'src/app/models/common/branch-dropdown-interface';
import { PhoneNumber } from '../../models/company-phone-number.interface';

@Component({
  selector: 'lavi-company-assign-sms-number-grid-row',
  templateUrl: './company-assign-sms-number-grid-row.component.html',
})
export class AssignSmsNumberGridRowComponent extends AbstractComponent {

  @Input() Number: string;
  @Input() BranchId: string;
  @Input() BranchList: IBranchDropdownDetails[];
  @Input() IsActive: boolean;
  @Input()  DefaultValues: PhoneNumber[] = [];

  @Output() OnUpdate: EventEmitter<PhoneNumber>;
  @Output() OnDelete: EventEmitter<PhoneNumber>;
  @Output() OnBranchChange: EventEmitter<PhoneNumber>;
  @Output() OnEdit: EventEmitter<boolean>;

  DefaultData: IBranchDropdownDetails;
  SelectedBranch: IBranchDropdownDetails;
  IsEditMode: boolean;
  IsOtherEditModeOn = false;
  CopyBranchList: IBranchDropdownDetails[] = [];

  constructor() {
    super();
    this.SetInitialValues();
  }

  Init() {
    if (this.BranchId) {
      this.SelectedBranch = this.BranchList?.find(x => x.branchId == this.BranchId);
    }
  }

  private SetInitialValues() {
    this.BranchList = [];
    this.DefaultData = {
      branchId: null,
      branchName: 'Unassign Location'
    };
    this.OnUpdate = new EventEmitter<PhoneNumber>();
    this.OnDelete = new EventEmitter<PhoneNumber>();
    this.OnBranchChange = new EventEmitter<PhoneNumber>();
    this.OnEdit = new EventEmitter<boolean>();
    this.IsEditMode = false;
    this.SelectedBranch = null;
    this.IsActive = false;
  }

  Edit(): void {
    this.IsEditMode = !this.IsEditMode;
    if (!this.IsEditMode){
    this.SetDefaultOption();
    }
    this.OnEdit.emit(this.IsEditMode);
  }

  CloseEdit(): void {
    this.IsEditMode = false;
    this.OnEdit.emit(this.IsEditMode);
  }

  SetDefaultOption(){
    const phoneDetails = {
      branchId: this.BranchId
    };
    if (this.BranchId) {
      this.SelectedBranch = this.BranchList?.find(x => x.branchId == this.BranchId);
    }else{
      this.SelectedBranch = null;
    }
    this.OnOptionsSelected(phoneDetails);
  }

  Delete(): void {
    this.OnDelete.emit({
      phone_number: this.Number,
      lavi_branchId: this.BranchId
    });
  }

  Update(): void {
    this.CloseEdit();
    this.OnUpdate.emit({
      phone_number: this.Number,
      oldLaviBranchId: this.BranchId,
      lavi_branchId: this.SelectedBranch.branchId
    });
  }
  OnOptionsSelected(event): void{
    this.OnBranchChange.emit({
      phone_number: this.Number,
      lavi_branchId: event.branchId
    });
  }

  OnOpenDropDown(event){
    const branchListCopy =  cloneObject(this.BranchList);
    if (this.DefaultValues){
      const BranChIds = this.DefaultValues.filter(x => x.phone_number !== this.Number).map(x => x.lavi_branchId);
      this.CopyBranchList = branchListCopy.filter(x => !BranChIds.includes(x.branchId));
      }
  }
}
