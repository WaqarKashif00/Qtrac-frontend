import { Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { DefaultCompanyConfigValues } from 'src/app/models/constants/company-configuration.constants';
import { FormGroup } from '@angular/forms';
import { CompanyConfigurationMessages } from 'src/app/models/validation-message/company-configuration';
import { IDropdown } from '../../models/dropdownlist.interface';

@Component({
  selector: 'lavi-company-advance-configuration',
  templateUrl: './company-advance-configuration.component.html',
  styleUrls: ['./company-advance-configuration.component.scss']
})
export class CompanyAdvanceConfigurationComponent extends AbstractComponent {

  @Input() TimeIntervalList: IDropdown[];
  @Input() LoginModeList: IDropdown[];
  @Input() CompanyAdvanceConfigForm: FormGroup;

  DefaultValue = DefaultCompanyConfigValues;
  ValidationMessage = CompanyConfigurationMessages;

  get IsPurgeSensitiveInfoControl(){
    return this.CompanyAdvanceConfigForm.get('isPurgeSensitiveInfo');
  }

  Init(){}

  Destroy(){}

}
