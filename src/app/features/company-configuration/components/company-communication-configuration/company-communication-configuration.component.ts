import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ConvertObjectToArray } from 'src/app/core/utilities/core-utilities';
import { IBranchDropdownDetails } from 'src/app/models/common/branch-dropdown-interface';
import { DefaultCompanyConfigValues, SMTPServiceProvider } from 'src/app/models/constants/company-configuration.constants';
import { CompanyConfigurationMessages } from 'src/app/models/validation-message/company-configuration';
import { CompanyConfigurationService } from '../../company-configuration.service';
import { PhoneNumber } from '../../models/company-phone-number.interface';
import { IDropdown } from '../../models/dropdownlist.interface';

@Component({
  selector: 'lavi-company-communication-configuration',
  templateUrl: './company-communication-configuration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyCommunicationConfigurationComponent extends AbstractComponent {

  @Input() EncryptionList: IDropdown[];
  @Input() CompanyCommunicationConfigForm: FormGroup;
  @Input() IsInternalAuthentication: boolean;
  @Input() BranchList: IBranchDropdownDetails[];
  @Input() IsSMSAccountLinked: boolean;
  @Input() AllTwilioActiveNumbers: PhoneNumber[];
  @Input() AllAssignedToBranchNumbers: PhoneNumber[];
  @Input() AllUnAssignedNumbers: PhoneNumber[];
  @Input() HideEmailConfigIfLaviSettingsEnable: boolean;
  @Input() IsValidSMTPSettings: boolean;

  @Output() OnDelete: EventEmitter<PhoneNumber>;
  @Output() OnUpdate: EventEmitter<PhoneNumber>;
  @Output() OnBindSMSConfigurations: EventEmitter<void>;
  @Output() OnUpdateAll: EventEmitter<PhoneNumber[]>;

  CompanyMessages = CompanyConfigurationMessages;
  DefaultValue = DefaultCompanyConfigValues;
  SMTPServiceProviders = [];

  SelectedSMTPServiceProvider$: Observable<string>;
  SMTPServiceProvider = SMTPServiceProvider;

  constructor(private companyConfigurationService: CompanyConfigurationService) {
    super();
    this.SetInitialValues();
  }

  Init() { }

  Destroy() { }

  private SetInitialValues() {
    this.IsSMSAccountLinked = false;
    this.BranchList = [];
    this.AllTwilioActiveNumbers = [];
    this.AllAssignedToBranchNumbers = [];
    this.AllUnAssignedNumbers = [];
    this.SMTPServiceProviders = ConvertObjectToArray(SMTPServiceProvider);
    this.OnUpdate = new EventEmitter<PhoneNumber>();
    this.OnDelete = new EventEmitter<PhoneNumber>();
    this.OnBindSMSConfigurations = new EventEmitter<void>();
    this.OnUpdateAll = new EventEmitter<PhoneNumber[]>();
    this.SelectedSMTPServiceProvider$ = this.companyConfigurationService.SelectedSMTPServiceProvider$;
  }

  DeleteNumber(phoneNumber: PhoneNumber) {
    this.OnDelete.emit(phoneNumber);
  }

  Update(phoneNumber: PhoneNumber) {
    this.OnUpdate.emit(phoneNumber);
  }

  BindSMSConfigurations() {
    this.OnBindSMSConfigurations.emit();
  }

  UpdateAll(phoneNumber: PhoneNumber[]) {
    this.OnUpdateAll.emit(phoneNumber);
  }

}
