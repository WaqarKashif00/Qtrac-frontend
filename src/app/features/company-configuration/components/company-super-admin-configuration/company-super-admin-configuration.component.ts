import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { CompanyConfigurationMessages } from '../../../../models/validation-message/company-configuration';

@Component({
  selector: 'lavi-company-super-admin-configuration',
  templateUrl: './company-super-admin-configuration.component.html',
  styleUrls: ['./company-super-admin-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanySuperAdminConfigurationComponent extends AbstractComponent implements OnChanges {

  @Input() CompanySuperAdminConfigForm: FormGroup;
  @Input() IsMultiQueueError: boolean;
  @Input() ShowRetentionYear: boolean;
  @Input() IsEditMode: boolean;
  @Input() IsSMSAccountLinked: boolean;
  @Output() OnLinkAccount: EventEmitter<void>;

  smsList = ["twilio","messangi","whatsapp"];

  DefaultValues = {};
  IsFormValueChanges = false;


  private IsSMTPConfigurationDialogOpenSubject: BehaviorSubject<boolean>;
  IsSMTPConfigurationDialogOpen$: Observable<boolean>;

  ValidationMessage = CompanyConfigurationMessages;

  get DataRetentionPolicyControl(){
    return this.CompanySuperAdminConfigForm.get('isDataRetentionPolicy');
  }

  constructor() {
    super();
    this.OnLinkAccount = new EventEmitter();
    this.IsSMTPConfigurationDialogOpenSubject = new BehaviorSubject<boolean>(false);
    this.IsSMTPConfigurationDialogOpen$ = this.IsSMTPConfigurationDialogOpenSubject.asObservable();
  }

  ngOnChanges() {
    if (Object.keys(this.DefaultValues).length == 0 &&
    this.CompanySuperAdminConfigForm.value.twilioAuthKey !== ''){
      this.DefaultValues = this.CompanySuperAdminConfigForm.value;
    }
  }
  Init() {
    this.CompanySuperAdminConfigForm.valueChanges.subscribe((value) => {
      this.IsFormValueChanges = Object.keys(this.DefaultValues).length !== 0 &&
                              (this.DefaultValues['twilioAccountSID'] !== value.twilioAccountSID ||
                              this.DefaultValues['twilioAuthKey'] !== value.twilioAuthKey ||
                              this.DefaultValues['twilioServiceId'] !== value.twilioServiceId) ? true : false;
   });
}

  Destroy() { }

  LinkAccount() {
    this.OnLinkAccount.emit();
  }

  OpenConfigurationDialog(){
    this.IsSMTPConfigurationDialogOpenSubject.next(true);
  }

  CloseConfigurationDialog() {
    this.IsSMTPConfigurationDialogOpenSubject.next(false);
  }

}
