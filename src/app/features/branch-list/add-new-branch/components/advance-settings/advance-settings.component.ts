import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IHoursOfOperationDropdown } from 'src/app/models/common/hours-of-operation-dropdown.interface';
import { DefaultAddNewBranchValues } from 'src/app/models/constants/add-new-branch.constant';
import { AddNewBranchMessages } from 'src/app/models/validation-message/add-new-branch';
import { ILayoutTemplate } from '../../../models/layout-template.interface';
import { UserType } from 'src/app/models/enums/user-type.enum';
import { AddNewBranchService } from '../../add-new-branch.service';

@Component({
  selector: 'lavi-branch-advance-settings',
  templateUrl: './advance-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvanceSettingsComponent extends AbstractComponent {
  @Input() HoursOfOperationException: IHoursOfOperationDropdown[] = [];
  @Input() MobileTemplates: ILayoutTemplate[] = [];
  @Input() AdvanceSettingsForm: FormGroup;

  DefaultData = DefaultAddNewBranchValues;
  ValidationMessages = AddNewBranchMessages;

  constructor(private addNewBranchService: AddNewBranchService) {
    super();
    
  }

  get IsLaviUserType() {
    return this.addNewBranchService.authService.UserType === UserType.Lavi;
  }
  Init() {
    // Inherited from AbstractComponent to initialize component life cycle
  
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }
 
}
