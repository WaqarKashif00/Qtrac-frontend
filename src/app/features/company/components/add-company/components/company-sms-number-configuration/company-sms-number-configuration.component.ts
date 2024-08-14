import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IBranchDropdownDetails } from 'src/app/models/common/branch-dropdown-interface';
import { CompanyAssignNumberFilter } from 'src/app/models/enums/company-assign-number-filter.enum';
import { PhoneNumber } from '../../models/company-phone-number.interface';

@Component({
  selector: 'lavi-company-sms-number-configuration',
  templateUrl: './company-sms-number-configuration.component.html',
  styleUrls: ['./company-sms-number-configuration.component.scss']
})
export class CompanySmsNumberConfigurationComponent extends AbstractComponent {

  @Input() TotalSMSNumbers: number;
  @Input() AssignedNumbers: number;
  @Input() BranchList: IBranchDropdownDetails[];
  @Input() AllTwilioActiveNumbers: PhoneNumber[];
  @Input() AllAssignedToBranchNumbers: PhoneNumber[];
  @Input() AllUnAssignedNumbers: PhoneNumber[];
  @Input() IsSMSAccountLinked: boolean;

  @Output() OnDelete: EventEmitter<PhoneNumber>;
  @Output() OnUpdate: EventEmitter<PhoneNumber>;
  @Output() OnInit: EventEmitter<void>;
  @Output() OnUpdateAll: EventEmitter<PhoneNumber[]>;

  get InActiveNumberCount(): number {
    if (this.AllAssignedToBranchNumbers && this.AllAssignedToBranchNumbers.length > 0) {
      if (this.AllTwilioActiveNumbers && this.AllTwilioActiveNumbers.length > 0) {
        const InactiveCount = this.AllAssignedToBranchNumbers.filter(number => {
          return !(this.AllTwilioActiveNumbers.find(y => y.phone_number == number.phone_number));
        }).length;
        return InactiveCount;
      } else {
        return this.AllAssignedToBranchNumbers.length;
      }
    }
    return 0;
  }

  AssignNumberDialogState: boolean;
  FilterId:number=1;

  constructor() {
    super();
    this.InitializeValues();
  }

  Init() {
    this.OnInit.emit();
  }

  private InitializeValues() {
    this.IsSMSAccountLinked = true;
    this.AssignNumberDialogState = false;
    this.BranchList = [];
    this.OnUpdate = new EventEmitter<PhoneNumber>();
    this.OnDelete = new EventEmitter<PhoneNumber>();
    this.OnInit = new EventEmitter<void>();
    this.OnUpdateAll=new EventEmitter<PhoneNumber[]>();
  }

  DeleteNumber(phoneNumber: PhoneNumber) {
    this.OnDelete.emit(phoneNumber);
  }

  Update(phoneNumber: PhoneNumber) {
    this.OnUpdate.emit(phoneNumber);
  }

  TotalNumbersClicked(): void {
    this.FilterId=CompanyAssignNumberFilter.All;
    this.OpenAssignNumbersDialog();
  }

  AssignedNumbersClicked(): void {
    this.FilterId=CompanyAssignNumberFilter.Assigned;
    this.OpenAssignNumbersDialog();
  }

  NotAssignedNumbersClicked(): void {
    this.FilterId=CompanyAssignNumberFilter.UnAssigned;
    this.OpenAssignNumbersDialog();
  }

  OpenAssignNumbersDialog(): void {
    this.AssignNumberDialogState = true;
  }

  CloseAssignNumbersDialog(): void {
    this.AssignNumberDialogState = false;
  }

  ToggleAssignNumbersDialog(): void {
    this.AssignNumberDialogState = !this.AssignNumberDialogState;
  }

  UpdateAll(phoneNumber: PhoneNumber[]) {
    this.OnUpdateAll.emit(phoneNumber);
    this.AssignNumberDialogState = false;
  }
  FilterChanged(filterId:number){
    this.FilterId=filterId;
  }

}
