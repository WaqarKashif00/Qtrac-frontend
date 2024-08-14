import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IBranchDropdownDetails } from 'src/app/models/common/branch-dropdown-interface';
import { cloneObject } from '../../../../core/utilities/core-utilities';
import { CompanyAssignNumberFilter } from '../../../../models/enums/company-assign-number-filter.enum';
import { OnChange } from '../../../../shared/decorators/onchange.decorator';
import { PhoneNumber } from '../../models/company-phone-number.interface';
import { AssignSmsNumberGridRowComponent } from '../company-assign-sms-number-row/company-assign-sms-number-grid-row.component';

@Component({
  selector: 'lavi-company-assign-sms-number-dialog',
  templateUrl: './company-assign-sms-number-dialog.component.html',
  styleUrls: ['./company-assign-sms-number-dialog.component.scss']
})
export class AssignSmsNumberDialogComponent extends AbstractComponent {
  @Input() OpenDialog: boolean;
  @Input() AllTwilioActiveNumbers: PhoneNumber[];

  @OnChange('UpdateDefaultValues')
  @Input() AllAssignedToBranchNumbers: PhoneNumber[];

  @OnChange('UpdateDefaultValues')
  @Input() AllUnAssignedNumbers: PhoneNumber[];
  @Input() InActiveNumberCount: number;
  @Input() BranchList: IBranchDropdownDetails[];
  @Input() FilterId: number = CompanyAssignNumberFilter.All;

  @Output() OnClose: EventEmitter<void>;
  @Output() OnDelete: EventEmitter<PhoneNumber>;
  @Output() OnUpdate: EventEmitter<PhoneNumber>;
  @Output() OnUpdateAll: EventEmitter<PhoneNumber[]>;
  @Output() FilterChange: EventEmitter<number>;
  @ViewChildren('PhoneNumberRow') PhoneNumberRows: QueryList<AssignSmsNumberGridRowComponent>;

  CurrentFilter: string;
  DefaultValues: PhoneNumber[] = [];
  CompanyAssignNumberFilter = CompanyAssignNumberFilter;

  constructor() {
    super();
    this.SetInitialValues();
  }

  Init() {
    this.CurrentFilter = '';
  }

  private SetInitialValues() {
    this.CurrentFilter = '';
    this.OnClose = new EventEmitter();
    this.OnUpdate = new EventEmitter<PhoneNumber>();
    this.OnDelete = new EventEmitter<PhoneNumber>();
    this.OnUpdateAll = new EventEmitter<PhoneNumber[]>();
    this.FilterChange = new EventEmitter<number>();
    this.AllTwilioActiveNumbers = [];
    this.AllAssignedToBranchNumbers = [];
    this.AllUnAssignedNumbers = [];
  }

  Close(): void {

    this.PhoneNumberRows.forEach(element => {
      if (element.IsEditMode) {
        element.IsEditMode = false;
        element.SetDefaultOption();
      }
      element.IsOtherEditModeOn = false;
    });
    this.OnClose.emit();
  }

  SavePhoneNumbers(): void {
    const phoneNumberList: PhoneNumber[] = [];
    this.PhoneNumberRows.forEach(element => {
      if (element.SelectedBranch != null &&
        element.BranchId != element.SelectedBranch.branchId) {
        phoneNumberList.push({
          phone_number: element.Number,
          oldLaviBranchId: element.BranchId,
          lavi_branchId: element.SelectedBranch.branchId
        }

        );
      }
    });
    this.OnUpdateAll.emit(phoneNumberList);
  }

  UpdateOptionDetails(phoneDetails: PhoneNumber) {
    const oldIndex = this.DefaultValues.findIndex(obj =>
      obj.phone_number == phoneDetails.phone_number
    );
    if (oldIndex > -1) {
      this.DefaultValues[oldIndex].lavi_branchId = phoneDetails.lavi_branchId;
    }

  }

  UpdateDefaultValues(): void {
    if (this.AllUnAssignedNumbers) {
      this.AllUnAssignedNumbers.forEach(element => {
        const phoneNumber: PhoneNumber = this.DefaultValues.find(x => x.phone_number == element.phone_number);
        if (phoneNumber == null) {
          this.DefaultValues.push(cloneObject(element));
        }
      });
    }
    if (this.AllAssignedToBranchNumbers) {
      this.AllAssignedToBranchNumbers.forEach(element => {
        const phoneNumber: PhoneNumber = this.DefaultValues.find(x => x.phone_number == element.phone_number);
        if (phoneNumber == null) {
          this.DefaultValues.push(cloneObject(element));
        }
      });
    }
  }

  OnEditBranch(isEdit: boolean) {
    this.PhoneNumberRows.forEach(e => {
      if (isEdit && (!e.IsEditMode)) {
        e.IsOtherEditModeOn = true;
      } else {
        e.IsOtherEditModeOn = false;
      }
    });
  }
  ShowAllDetails() {
    this.FilterChange.emit(CompanyAssignNumberFilter.All);
  }
  ShowOnlyUnassignedDetails() {
    this.FilterChange.emit(CompanyAssignNumberFilter.UnAssigned);
  }

  IdentifyChange(index, item) {
    return item.phone_number;
  }

  DeleteNumber(phoneNumber: PhoneNumber) {
    this.OnDelete.emit(phoneNumber);
  }

  Update(phoneNumber: PhoneNumber) {
    this.OnUpdate.emit(phoneNumber);
  }

  IsActive(phoneNumber: PhoneNumber): boolean {
    if (this.AllTwilioActiveNumbers.find(x => x.phone_number == phoneNumber.phone_number)) {
      return true;
    }
    else {
      return false;
    }
  }
}
