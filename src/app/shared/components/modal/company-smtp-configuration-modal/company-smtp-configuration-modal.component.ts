import {
  ChangeDetectionStrategy, Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ConvertObjectToArray } from 'src/app/core/utilities/core-utilities';
import {
  DefaultCompanyConfigValues,
  Encryptions,
  SMTPServiceProvider
} from 'src/app/models/constants/company-configuration.constants';
import { CompanyConfigurationMessages } from 'src/app/models/validation-message/company-configuration';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';
import { SharedCompanyConfigurationService } from 'src/app/shared/services/shared-company-configuration.service';
import { CompanySMTPConfigurationModalService } from './company-smtp-configuration-modal.service';

@Component({
  selector: 'lavi-company-smtp-configuration-modal',
  templateUrl: './company-smtp-configuration-modal.component.html',
  styleUrls: ['./company-smtp-configuration-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CompanySMTPConfigurationModalService,
    SharedCompanyConfigurationService,
  ],
})
export class CompanySMTPConfigurationModalComponent extends AbstractComponent {
  @OnChange('ModalOpen')
  @Input()
  OpenDialog: boolean;
  @Output() OnCloseConfiguration: EventEmitter<void> = new EventEmitter<void>();

  CompanySMTPConfigForm: FormGroup;
  SMTPServiceProviders = [];
  DefaultValue = DefaultCompanyConfigValues;
  CompanyMessages = CompanyConfigurationMessages;
  EncryptionList = Encryptions;
  SelectedSMTPServiceProvider$: Observable<string>;
  CloseModal$: Observable<boolean>;
  VerificationDisplayText$: Observable<string>;
  SMTPServiceProvider = SMTPServiceProvider;

  constructor(
    private readonly companySMTPConfigurationModalService: CompanySMTPConfigurationModalService,
  ) {
    super();
    this.InitProperties();
    this.SubscribeObservables();
  }

  private InitProperties() {
    this.SMTPServiceProviders = ConvertObjectToArray(SMTPServiceProvider);
    this.CompanySMTPConfigForm =
      this.companySMTPConfigurationModalService.CompanySMTPConfigForm;
    this.SelectedSMTPServiceProvider$ =
      this.companySMTPConfigurationModalService.SelectedSMTPServiceProvider$;
    this.CloseModal$ = this.companySMTPConfigurationModalService.CloseModal$;
    this.VerificationDisplayText$ = this.companySMTPConfigurationModalService.VerificationDisplayText$;
  }

  private SubscribeObservables() {
    this.subs.sink = this.CloseModal$.subscribe((value) => {
      if (value) {
        this.companySMTPConfigurationModalService.ResetForm();
        this.OnCloseConfiguration.emit();
      }
    });
  }

  ModalOpen(isModelOpen: boolean) {
    if (!isModelOpen) {
      return;
    }

    this.companySMTPConfigurationModalService.GetAndUpdateFormAndProperties();
  }

  Close() {
    this.companySMTPConfigurationModalService.ResetForm();
    this.OnCloseConfiguration.emit();
  }

  Save() {
    this.companySMTPConfigurationModalService.Update(
      this.CompanySMTPConfigForm
    );
  }
}
