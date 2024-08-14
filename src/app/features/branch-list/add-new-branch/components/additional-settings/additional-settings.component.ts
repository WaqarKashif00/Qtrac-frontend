import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IHoursOfOperationDropdown } from 'src/app/models/common/hours-of-operation-dropdown.interface';
import { DefaultAddNewBranchValues } from 'src/app/models/constants/add-new-branch.constant';
import { HoursOfOperationMessage } from 'src/app/models/validation-message/hours-of-operations';
import { IDropdownList } from '../../../models/dropdown-list.interface';

@Component({
  selector: 'lavi-additional-settings',
  templateUrl: './additional-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalSettingsComponent extends AbstractComponent {

  @Input() HoursOfOperation: IHoursOfOperationDropdown[];
  @Input() BranchTimeZone: IDropdownList[];
  @Input() AdditionalSettingsForm: FormGroup;
  timeZoneMessages = HoursOfOperationMessage.timeZoneMessage;


  DefaultData = DefaultAddNewBranchValues;

  constructor(){
    super();
  }

  Init() {
    // Inherited from AbstractComponent to initialize component life cycle
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }

}
