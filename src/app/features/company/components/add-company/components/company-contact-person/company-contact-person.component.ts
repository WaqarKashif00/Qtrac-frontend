import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { CompanyConfigurationMessages } from 'src/app/models/validation-message/company-configuration';
import { FormGroup } from '@angular/forms';
import { Validations } from 'src/app/models/constants/validation.constant';

@Component({
  selector: 'lavi-company-contact-person',
  templateUrl: './company-contact-person.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyContactPersonComponent extends AbstractComponent {

  @Input() CompanyContactPersonForm: FormGroup;

  CompanyMessages = CompanyConfigurationMessages;
  Validation = Validations;

  Init(){}

  Destroy(){}

}
