import { Injectable } from '@angular/core';
import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChipRemoveEvent } from '@progress/kendo-angular-buttons';
import { BehaviorSubject, Observable, of, Subject, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { ICityDropDownList } from 'src/app/models/common/city-dropdown-list.interface';
import { ICountryDropdownList } from 'src/app/models/common/country-dropdown-list.interface';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { IStateDropdownList } from 'src/app/models/common/state-dropdown-list.interface';
import {
  DefaultCompanyConfigValues,
  Encryptions,
  GMAIL_SMTP_SERVER,
  SMTPServiceProvider
} from 'src/app/models/constants/company-configuration.constants';
import { Validations } from 'src/app/models/constants/validation.constant';
import { LoginMode } from 'src/app/models/enums/login-mode.enum';
import { UserType } from 'src/app/models/enums/user-type.enum';
import { ILaviAddress } from 'src/app/shared/api-models/google-models/lavi-address.interface';
import { SharedCompanyConfigurationService } from 'src/app/shared/services/shared-company-configuration.service';
import {
  AddressValidate,
  CustomRequiredDropDownValidator,
  requiredFileType
} from 'src/app/shared/validators/common.validator';
import { BranchAPIService } from '../../shared/api-services/branch-api.service';
import { CompanyAPIService } from '../../shared/api-services/company-api.service';
import { MessagingAPIService } from '../../shared/api-services/messenging-api.service';
import { WorkflowAPIService } from '../../shared/api-services/workflow-api.service';
import { CompanyValidatorService } from '../../shared/validators/company.validator';
import { ITime } from '../scheduler/hours-of-operations/hours-of-operation.interface';
import { IWorkflowDropDown } from '../work-flow/models/worflow-dropdown.interface';
import { ICompanyConfigDropdownListData } from './models/company-configuration-dropdownlist-data.interface';
import { IRequest } from './models/company-configuration-request.interface';
import { ITwilioCredentials } from './models/company-configuration-twilio-creadentials.interface';
import { ICompanyConfiguration } from './models/company-configuration.interface';
import { PhoneNumber } from './models/company-phone-number.interface';
const cityTimezones = require('city-timezones');

@Injectable()
export class CompanyConfigurationService extends AbstractComponentService {
  private SubjectCompanyConfigDetails: Subject<ICompanyConfiguration>;
  public CompanyConfigDetails$: Observable<ICompanyConfiguration>;
  private SubjectCompanyConfigDropdownListData: BehaviorSubject<ICompanyConfigDropdownListData>;
  public CompanyConfigDropdownListData$: Observable<ICompanyConfigDropdownListData>;
  private SubjectStateList: Subject<IStateDropdownList[]>;
  public StateList$: Observable<IStateDropdownList[]>;
  private SubjectCityList: Subject<ICityDropDownList[]>;
  public CityList$: Observable<ICityDropDownList[]>;
  public CompanyConfigForm: FormGroup;
  public SubjectDefaultLanguageList: Subject<ILanguageDropdownList[]>;
  public DefaultLanguageList$: Observable<ILanguageDropdownList[]>;
  private CompanyConfigDropdownListData: ICompanyConfigDropdownListData = {
    countryList: [],
    languageList: [],
    encryptionList: [],
    timeIntervalList: [],
    loginModeList: [],
    tagList: [],
    branchList: [],
  };
  public StateList: IStateDropdownList[];
  public Workflows: IWorkflowDropDown[];
  public SubjectIsEditMode: BehaviorSubject<boolean>;
  public SubjectIsMultiQueueError: BehaviorSubject<boolean>;
  public SubjectShowRetentionYears: BehaviorSubject<boolean>;
  public ShowRetentionYears$: Observable<boolean>;
  private IsInternalAuthenticationSubject: BehaviorSubject<boolean>;
  public IsInternalAuthentication$: Observable<boolean>;
  public IsEditMode$: Observable<boolean>;
  public IsMultiQueueError$: Observable<boolean>;
  private SubjectTagList: BehaviorSubject<string[]>;
  public TagList$: Observable<string[]>;
  private isValidSMTPSettingsSubject: BehaviorSubject<boolean>;
  public isValidSMTPSettings$: Observable<boolean>;
  public IsEditedMode: boolean;
  public CompanyId = this.authStateService.CompanyId;
  private locationBaseAPIUrl =
    this.appConfigService.config.locationBaseAPIUrl + '/api';
  private LanguageBaseAPIUrl =
    this.appConfigService.config.LanguageBaseAPIUrl + '/api';
  public CompanyApiUrl = '/api/company';
  public ImageUrl: string;
  private TypeAsData = 'company_data';
  private DefaultLanguage;
  public BranchId = this.browserStorageService.BranchId;
  public AllTwilioActiveNumbersSubject: BehaviorSubject<PhoneNumber[]>;
  public AllTwilioActiveNumbers$: Observable<PhoneNumber[]>;

  public AllAssignedToBranchNumbersSubject: BehaviorSubject<PhoneNumber[]>;
  public AllAssignedToBranchNumbers$: Observable<PhoneNumber[]>;

  public AllUnAssignedNumbersSubject: BehaviorSubject<PhoneNumber[]>;
  public AllUnAssignedNumbers$: Observable<PhoneNumber[]>;

  private IsSMSConfigAccountLinkedSubject: BehaviorSubject<boolean>;
  public IsSMSConfigAccountLinked$: Observable<boolean>;
  WorldCityList: any;

  private SelectedSMTPServiceProviderSubject: BehaviorSubject<string>;
  SelectedSMTPServiceProvider$: Observable<string>;

  get DefaultLanguageControl() {
    return this.CompanyConfigForm.get(
      'companyConfigurationInfo.defaultLanguage'
    );
  }

  get LiteAgentControl() {
    return this.CompanyConfigForm.get('companySuperAdminInfo.isLiteAgent');
  }

  get ClassicAgentControl() {
    return this.CompanyConfigForm.get('companySuperAdminInfo.isClassicAgent');
  }

  get TagControl() {
    return this.CompanyConfigForm.get('companyConfigurationInfo.tags');
  }

  get CompanyNameFormControl() {
    return this.CompanyConfigForm.get('companyConfigurationInfo.companyName');
  }

  get SMTPServiceProviderControl() {
    return this.CompanyConfigForm.get(
      'companyCommunicationInfo.serviceProvider'
    );
  }

  get SMTPServerControl() {
    return this.CompanyConfigForm.get('companyCommunicationInfo.smtpServer');
  }
  get PortNumberControl() {
    return this.CompanyConfigForm.get('companyCommunicationInfo.port');
  }
  get SendGridAPIKeyControl() {
    return this.CompanyConfigForm.get('companyCommunicationInfo.sendGridAPIKey');
  }

  constructor(
    private route: ActivatedRoute,
    private authStateService: AuthStateService,
    private readonly companyAPIService: CompanyAPIService,
    private readonly branchAPIService: BranchAPIService,
    private readonly messagingAPIService: MessagingAPIService,
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly companyValidatorService: CompanyValidatorService,
    private readonly sharedCompanyConfigurationService: SharedCompanyConfigurationService,
  ) {
    super();
    this.SetObservables();
    this.SubscribeControlOnValueChange();
    this.WorldCityList = cityTimezones.cityMapping;
  }

  public SetObservables() {
    this.SubjectCompanyConfigDetails = new Subject<ICompanyConfiguration>();
    this.CompanyConfigDetails$ =
      this.SubjectCompanyConfigDetails.asObservable();
    this.SubjectCompanyConfigDropdownListData =
      new BehaviorSubject<ICompanyConfigDropdownListData>(
        this.CompanyConfigDropdownListData
      );
    this.CompanyConfigDropdownListData$ =
      this.SubjectCompanyConfigDropdownListData.asObservable();
    this.SubjectStateList = new Subject<Array<IStateDropdownList>>();
    this.StateList$ = this.SubjectStateList.asObservable();
    this.SubjectCityList = new Subject<Array<ICityDropDownList>>();
    this.CityList$ = this.SubjectCityList.asObservable();
    this.SubjectDefaultLanguageList = new Subject<ILanguageDropdownList[]>();
    this.DefaultLanguageList$ = this.SubjectDefaultLanguageList.asObservable();
    this.SubjectIsEditMode = new BehaviorSubject<boolean>(false);
    this.IsEditMode$ = this.SubjectIsEditMode.asObservable();
    this.SubjectIsMultiQueueError = new BehaviorSubject<boolean>(false);
    this.IsMultiQueueError$ = this.SubjectIsMultiQueueError.asObservable();
    this.SubjectShowRetentionYears = new BehaviorSubject<boolean>(false);
    this.ShowRetentionYears$ = this.SubjectShowRetentionYears.asObservable();
    this.IsInternalAuthenticationSubject = new BehaviorSubject<boolean>(true);
    this.IsInternalAuthentication$ =
      this.IsInternalAuthenticationSubject.asObservable();
    this.SubjectTagList = new BehaviorSubject<string[]>([]);
    this.TagList$ = this.SubjectTagList.asObservable();
    this.isValidSMTPSettingsSubject = new BehaviorSubject<boolean>(false);
    this.isValidSMTPSettings$ = this.isValidSMTPSettingsSubject.asObservable();

    this.AllTwilioActiveNumbersSubject = new BehaviorSubject<PhoneNumber[]>([]);
    this.AllTwilioActiveNumbers$ =
      this.AllTwilioActiveNumbersSubject.asObservable();

    this.AllAssignedToBranchNumbersSubject = new BehaviorSubject<PhoneNumber[]>(
      []
    );
    this.AllAssignedToBranchNumbers$ =
      this.AllAssignedToBranchNumbersSubject.asObservable();

    this.AllUnAssignedNumbersSubject = new BehaviorSubject<PhoneNumber[]>([]);
    this.AllUnAssignedNumbers$ =
      this.AllUnAssignedNumbersSubject.asObservable();

    this.IsSMSConfigAccountLinkedSubject = new BehaviorSubject<boolean>(false);
    this.IsSMSConfigAccountLinked$ =
      this.IsSMSConfigAccountLinkedSubject.asObservable();

    this.SelectedSMTPServiceProviderSubject =
      new BehaviorSubject<string>(null);
    this.SelectedSMTPServiceProvider$ =
      this.SelectedSMTPServiceProviderSubject.asObservable();

    this.SetCompanyFormGroup(this.GetDefaultCompanyDetails());
  }

  public SetCompanyFormGroup(companyDetailsData: ICompanyConfiguration) {
    this.CompanyConfigForm = this.formBuilder.group({
      companySuperAdminInfo: this.formBuilder.group({
        dataRetentionYears: [
          companyDetailsData.companySuperAdminInfo.dataRetentionYears,
        ],
        isDataRetentionPolicy: [
          companyDetailsData.companySuperAdminInfo.isDataRetentionPolicy,
        ],
        isLiteAgent: [companyDetailsData.companySuperAdminInfo.isLiteAgent],
        isClassicAgent: [
          companyDetailsData.companySuperAdminInfo.isClassicAgent,
        ],
        twilioAccountSID: [
          companyDetailsData.companySuperAdminInfo.twilioAccountSID,
        ],
        twilioAuthKey: [companyDetailsData.companySuperAdminInfo.twilioAuthKey],
        twilioServiceId: [
          companyDetailsData.companySuperAdminInfo.twilioServiceId,
        ],
        messangiBearerToken: [
          companyDetailsData.companySuperAdminInfo.messangiBearerToken,
        ],
        smsGatewayName: [
          companyDetailsData.companySuperAdminInfo.smsGatewayName,
        ],
        isAccountLinked: [
          companyDetailsData.companySuperAdminInfo.isAccountLinked,
        ],
        useLaviSMTPSettings: [
          true, // TODO : Disabled this section discussed in this task QTVR-1310
        ],
      }),
      companyConfigurationInfo: this.formBuilder.group({
        companyName: [
          companyDetailsData.companyConfigurationInfo.companyName,
          {
            updateOn: 'change',
            validators: [Validators.required],
            asyncValidators: [
              this.companyValidatorService.NameAlreadyExistValidator(
                this.CompanyId,
                companyDetailsData.companyConfigurationInfo.companyName
              ),
            ],
          },
        ],
        billingAddress: [
          companyDetailsData.companyConfigurationInfo.billingAddress,
        ],
        address: [
          companyDetailsData.companyConfigurationInfo.address,
        ],
        laviAddress: [
          companyDetailsData.companyConfigurationInfo.laviAddress,
          [AddressValidate()],
        ],
        companyImg: [
          companyDetailsData.companyConfigurationInfo.companyImg,
          [requiredFileType(['png', 'jpg', 'jpeg'], 4000000)],
        ],
        country: [
          companyDetailsData.companyConfigurationInfo.country,
          CustomRequiredDropDownValidator('countryCode'),
        ],
        phoneNumber: [
          companyDetailsData.companyConfigurationInfo.phoneNumber,
          [Validators.pattern(Validations.PhoneNoRegx2),Validators.maxLength(16)],
        ],
        city: [
          companyDetailsData.companyConfigurationInfo.city,
        ],
        state: [
          companyDetailsData.companyConfigurationInfo.state,
        ],
        zip: [companyDetailsData.companyConfigurationInfo.zip],
        defaultLanguage: [
          companyDetailsData.companyConfigurationInfo.defaultLanguage,
        ],
        supportedLanguage: [
          companyDetailsData.companyConfigurationInfo.supportedLanguage,
          Validators.required,
        ],
        tags: [companyDetailsData.companyConfigurationInfo.tags],
      }),
      companyContactPersonInfo: this.formBuilder.group({
        firstName: [companyDetailsData.companyContactPersonInfo.firstName],
        lastName: [companyDetailsData.companyContactPersonInfo.lastName],
        officeNumber: [
          companyDetailsData.companyContactPersonInfo.officeNumber,
          [Validators.pattern(Validations.PhoneNoRegx)],
        ],
        extension: [companyDetailsData.companyContactPersonInfo.extension],
        roleInCompany: [
          companyDetailsData.companyContactPersonInfo.roleInCompany,
        ],
        cellPhoneNumber: [
          companyDetailsData.companyContactPersonInfo.cellPhoneNumber,
          [Validators.pattern(Validations.PhoneNoRegx)],
        ],
        emailAddress: [
          companyDetailsData.companyContactPersonInfo.emailAddress,
          [Validators.pattern(Validations.EmailRegX)],
        ],
      }),
      companyCommunicationInfo: this.formBuilder.group({
        serviceProvider: [
          companyDetailsData.companyCommunicationInfo.serviceProvider,
        ],
        smtpServer: [
          companyDetailsData.companyCommunicationInfo.smtpServer,
          Validators.pattern(Validations.SMTPRegx),
        ],
        port: [
          companyDetailsData.companyCommunicationInfo.port,
          Validators.pattern(Validations.PortRegx),
        ],
        encryption: [companyDetailsData.companyCommunicationInfo.encryption],
        userName: [
          companyDetailsData.companyCommunicationInfo.userName,
          Validators.pattern(Validations.EmailRegX),
        ],
        password: [companyDetailsData.companyCommunicationInfo.password],
        clientId: [companyDetailsData.companyCommunicationInfo.clientId],
        clientSecret: [
          companyDetailsData.companyCommunicationInfo.clientSecret,
        ],
        refreshToken: [
          companyDetailsData.companyCommunicationInfo.refreshToken,
        ],
        sendGridAPIKey: [
          companyDetailsData.companyCommunicationInfo.sendGridAPIKey
        ],
        smsTotalNumber: [
          companyDetailsData.companyCommunicationInfo.smsTotalNumber,
        ],
        smsAssignedNumber: [
          companyDetailsData.companyCommunicationInfo.smsAssignedNumber,
        ],
        smsUnassignedNumber: [
          companyDetailsData.companyCommunicationInfo.smsUnassignedNumber,
        ],
      }),
      companyAdvanceSettingInfo: this.formBuilder.group({
        isPurgeSensitiveInfo: [
          companyDetailsData.companyAdvanceSettingInfo.isPurgeSensitiveInfo,
        ],
        purgeTime: [companyDetailsData.companyAdvanceSettingInfo.purgeTime],
        purgeTimeInterval: [
          companyDetailsData.companyAdvanceSettingInfo.purgeTimeInterval,
        ],
        applicationTimeout: [
          companyDetailsData.companyAdvanceSettingInfo.applicationTimeout,
        ],
        applicationTimeInterval: [
          companyDetailsData.companyAdvanceSettingInfo.applicationTimeInterval,
        ],
        adminTimeout: [
          companyDetailsData.companyAdvanceSettingInfo.adminTimeout,
        ],
        adminTimeInterval: [
          companyDetailsData.companyAdvanceSettingInfo.adminTimeInterval,
        ],
        logoutUrl: [
          companyDetailsData.companyAdvanceSettingInfo.logoutUrl,
          [Validators.pattern(Validations.UrlRegX)],
        ],
        endOfDayTimeFormControl: [
          companyDetailsData.companyAdvanceSettingInfo.endOfDayTimeFormControl,{
           updateOn: 'submit',

          }
        ],
        loginMode: [companyDetailsData.companyAdvanceSettingInfo.loginMode],
        isEnforceReCaptcha: [
          companyDetailsData.companyAdvanceSettingInfo.isEnforceReCaptcha
        ]
      }),
    });
  }

  public GetDefaultCompanyDetails() {
    const defaultNulldata: ICompanyConfiguration = {
      companySuperAdminInfo: {
        dataRetentionYears: 0,
        isDataRetentionPolicy: false,
        isLiteAgent: false,
        isClassicAgent: false,
        twilioAccountSID: '',
        twilioAuthKey: '',
        twilioServiceId: '',
        isAccountLinked: false,
        useLaviSMTPSettings: true,
      },
      companyConfigurationInfo: {
        id: '',
        companyName: '',
        billingAddress: '',
        companyImg: '',
        country: null,
        phoneNumber: null,
        city: null,
        state: null,
        zip: '',
        defaultLanguage: DefaultCompanyConfigValues.DefaultLanguageValue,
        supportedLanguage: [],
        tags: null,
        isActive: true,
        isDeleted: false,
        isValidSMTPSettings: false,
        address:'',
        laviAddress:null
      },
      companyContactPersonInfo: {
        firstName: null,
        lastName: null,
        roleInCompany: null,
        cellPhoneNumber: null,
        emailAddress: null,
        extension: null,
        officeNumber: null,
      },
      companyCommunicationInfo: {
        serviceProvider:
          DefaultCompanyConfigValues.SMTPServiceProviderDefaultValue,
        smtpServer: '',
        port: 0,
        encryption: DefaultCompanyConfigValues.EncryptionListDefaultValue,
        userName: '',
        password: '',
        clientId: null,
        clientSecret: null,
        refreshToken: null,
        sendGridAPIKey: null,
        displayName: '',
        smsTotalNumber: 0,
        smsAssignedNumber: 0,
        smsUnassignedNumber: 0,
      },
      companyAdvanceSettingInfo: {
        isPurgeSensitiveInfo: false,
        purgeTime: '',
        purgeTimeInterval: DefaultCompanyConfigValues.TimeIntervalDefaultValue,
        applicationTimeout: '',
        applicationTimeInterval:
          DefaultCompanyConfigValues.TimeIntervalDefaultValue,
        adminTimeout: '',
        adminTimeInterval: DefaultCompanyConfigValues.TimeIntervalDefaultValue,
        logoutUrl: '',
        endOfDayTimeFormControl:null,
        loginMode: DefaultCompanyConfigValues.LoginModeDefaultValue,
        isEnforceReCaptcha: true
      },
    };
    return defaultNulldata;
  }

  private SubscribeControlOnValueChange() {
    this.subs.sink = this.CompanyConfigForm.get(
      'companySuperAdminInfo.isDataRetentionPolicy'
    ).valueChanges.subscribe((value) => {
      const formControl = this.CompanyConfigForm.get(
        'companySuperAdminInfo.dataRetentionYears'
      );
      if (value) {
        this.SetAndUpdateValidationsOnControl(formControl);
      } else {
        this.ClearAndUpdateValidationsOnControl(formControl);
      }
    });

    this.subs.sink = this.CompanyConfigForm.get(
      'companyAdvanceSettingInfo.isPurgeSensitiveInfo'
    ).valueChanges.subscribe((value) => {
      const formControl = this.CompanyConfigForm.get(
        'companyAdvanceSettingInfo.purgeTime'
      );
      if (value) {
        this.SetAndUpdateValidationsOnControl(formControl);
      } else {
        this.ClearAndUpdateValidationsOnControl(formControl);
      }
    });

    this.SMTPServiceProviderControl.valueChanges.subscribe(({ value }) => {
      this.SelectedSMTPServiceProviderSubject.next(value);
      if ([SMTPServiceProvider.Gmail.value,SMTPServiceProvider.GmailOAuth2.value].includes(value)) {
        this.SMTPServerControl.setValue(GMAIL_SMTP_SERVER);
        this.PortNumberControl.setValue(587);
      } else {
        this.SMTPServerControl.setValue(null);
      }
    });
  }

  private SetAndUpdateValidationsOnControl(control) {
    control.setValidators([Validators.required]);
    control.updateValueAndValidity();
  }

  private ClearAndUpdateValidationsOnControl(control) {
    control.reset();
    control.clearValidators();
    control.updateValueAndValidity();
  }

  public SetEditMode() {
    this.subs.sink = this.route.queryParams.subscribe((params) => {
      const edit = params.Add === undefined ? null : params.Add;
      this.IsEditedMode = edit !== null ? true : false;
      this.authStateService.CompanyLoginMode === LoginMode.INTERNAL
        ? this.IsInternalAuthenticationSubject.next(true)
        : this.IsInternalAuthenticationSubject.next(false);
      this.SubjectIsEditMode.next(this.IsEditedMode);
    });
  }

  public GetCompanyConfigurationDetails(companyId: string): void {
    this.subs.sink = this.companyAPIService
      .Get<IRequest>(companyId)
      .subscribe((res: IRequest) => {
        if (res !== undefined && res !== null) {
          this.BindStateList(res.countryCode, () => {
            this.BindCityList(
              res.countryCode,
              this.GetStateObj(res?.stateCode)?.state,
              () => {
                this.SetFormGroupValues(this.GetResponseData(res));
                this.SubjectTagList.next(res.tags ? res.tags : []);
                this.AddTagToSuggestionList(res.tags);
                this.SubjectShowRetentionYears.next(
                  res.superAdminConfig.isDataRetentionPolicy
                );
                this.isValidSMTPSettingsSubject.next(res.isValidSMTPSettings);
                this.IsSMSConfigAccountLinkedSubject.next(
                  res.superAdminConfig.isAccountLinked
                );
              }
            );
          });
          this.AddLanguage(res.supportedLanguages);
        }
      });
  }

  BindSMSConfigurations() {
    if (this.IsAccountLinked()) {
      this.BindPhoneNumbers(this.authService.CompanyId);
    }
  }

  BindPhoneNumbers(companyId: string) {
    this.subs.sink = this.formService
      .CombineAPICall(
        this.messagingAPIService.GetNumbers(companyId,this.BranchId),
        this.messagingAPIService.GetAssignedNumbers(companyId),
        this.messagingAPIService.GetUnAssignedNumbers(companyId, this.BranchId)
      )
      .subscribe(([active, assigned, unassigned]) => {
        this.AllTwilioActiveNumbersSubject.next(active.concat([]));
        this.AllAssignedToBranchNumbersSubject.next(assigned.concat([]));
        this.AllUnAssignedNumbersSubject.next(unassigned.concat([]));
      });
  }

  IsAccountLinked(): boolean {
    try {
      const IsAccountLinked = this.CompanyConfigForm.get(
        'companySuperAdminInfo.isAccountLinked'
      ).value;
      if (IsAccountLinked) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  IsCredentialsEntered(company: IRequest): boolean {
    if (
      company?.superAdminConfig?.twilioAccountSID &&
      company?.superAdminConfig?.twilioAuthKey &&
      company?.superAdminConfig?.twilioServiceId
    ) {
      return true;
    } else {
      return false;
    }
  }

  // TODO: Remove after implementation in cosmos db
  public AddTagToSuggestionList(tags: string[]) {
    const notFoundIndex = -1;
    if (tags && this.SubjectCompanyConfigDropdownListData.value) {
      for (const tag of tags) {
        if (
          this.SubjectCompanyConfigDropdownListData.value.tagList.indexOf(
            tag
          ) === notFoundIndex
        ) {
          this.SubjectCompanyConfigDropdownListData.value.tagList.push(tag);
        }
      }
    }
  }

  public SetFormGroupValues(formData: ICompanyConfiguration) {
    this.CompanyConfigForm.get(
      'companySuperAdminInfo.dataRetentionYears'
    ).setValue(formData.companySuperAdminInfo.dataRetentionYears);
    this.CompanyConfigForm.get(
      'companySuperAdminInfo.isDataRetentionPolicy'
    ).setValue(formData.companySuperAdminInfo.dataRetentionYears);
    this.CompanyConfigForm.get('companySuperAdminInfo.isLiteAgent').setValue(
      formData.companySuperAdminInfo.isLiteAgent
    );
    this.CompanyConfigForm.get('companySuperAdminInfo.isClassicAgent').setValue(
      formData.companySuperAdminInfo.isClassicAgent
    );

    this.CompanyConfigForm.get(
      'companySuperAdminInfo.twilioAccountSID'
    ).setValue(formData.companySuperAdminInfo.twilioAccountSID);

    this.CompanyConfigForm.get('companySuperAdminInfo.twilioAuthKey').setValue(
      formData.companySuperAdminInfo.twilioAuthKey
    );

    this.CompanyConfigForm.get('companySuperAdminInfo.messangiBearerToken').setValue(
      formData.companySuperAdminInfo.messangiBearerToken
    );

    this.CompanyConfigForm.get('companySuperAdminInfo.smsGatewayName').setValue(
      formData.companySuperAdminInfo.smsGatewayName
    );

    this.CompanyConfigForm.get(
      'companySuperAdminInfo.twilioServiceId'
    ).setValue(formData.companySuperAdminInfo.twilioServiceId);
    this.CompanyConfigForm.get(
      'companySuperAdminInfo.isAccountLinked'
    ).setValue(formData.companySuperAdminInfo.isAccountLinked);
    this.CompanyConfigForm.get(
      'companySuperAdminInfo.useLaviSMTPSettings'
    ).setValue(true); // TODO : Disabled this section discussed in this task QTVR-1310

    this.CompanyNameFormControl.clearAsyncValidators();
    this.CompanyNameFormControl.setValue(
      formData.companyConfigurationInfo.companyName
    );
    this.CompanyNameFormControl.setAsyncValidators(
      this.companyValidatorService.NameAlreadyExistValidator(
        this.CompanyId,
        formData.companyConfigurationInfo.companyName
      )
    );

    this.CompanyConfigForm.get('companyConfigurationInfo.city').setValue(
      formData.companyConfigurationInfo.city
    );
    this.CompanyConfigForm.get('companyConfigurationInfo.country').setValue(
      formData.companyConfigurationInfo.country
    );
    this.CompanyConfigForm.get('companyConfigurationInfo.state').setValue(
      formData.companyConfigurationInfo.state
    );
    this.CompanyConfigForm.get('companyConfigurationInfo.phoneNumber').setValue(
      formData.companyConfigurationInfo.phoneNumber
    );
    this.CompanyConfigForm.get(
      'companyConfigurationInfo.supportedLanguage'
    ).setValue(formData.companyConfigurationInfo.supportedLanguage);
    this.DefaultLanguageControl.setValue(
      formData.companyConfigurationInfo.defaultLanguage
    );
    this.CompanyConfigForm.get(
      'companyConfigurationInfo.billingAddress'
    ).setValue(formData.companyConfigurationInfo.billingAddress);
    this.CompanyConfigForm.get(
      'companyConfigurationInfo.address'
    ).setValue(formData.companyConfigurationInfo.address);
    this.CompanyConfigForm.get(
      'companyConfigurationInfo.laviAddress'
    ).setValue(formData.companyConfigurationInfo.laviAddress);
    this.CompanyConfigForm.get('companyConfigurationInfo.companyImg').setValue(
      formData.companyConfigurationInfo.companyImg
    );
    this.CompanyConfigForm.get('companyConfigurationInfo.zip').setValue(
      formData.companyConfigurationInfo.zip
    );
    this.CompanyConfigForm.get('companyContactPersonInfo.firstName').setValue(
      formData.companyContactPersonInfo.firstName
    );
    this.CompanyConfigForm.get('companyContactPersonInfo.lastName').setValue(
      formData.companyContactPersonInfo.lastName
    );
    this.CompanyConfigForm.get(
      'companyContactPersonInfo.roleInCompany'
    ).setValue(formData.companyContactPersonInfo.roleInCompany);
    this.CompanyConfigForm.get(
      'companyContactPersonInfo.cellPhoneNumber'
    ).setValue(formData.companyContactPersonInfo.cellPhoneNumber);
    this.CompanyConfigForm.get(
      'companyContactPersonInfo.officeNumber'
    ).setValue(formData.companyContactPersonInfo.officeNumber);
    this.CompanyConfigForm.get('companyContactPersonInfo.extension').setValue(
      formData.companyContactPersonInfo.extension
    );
    this.CompanyConfigForm.get(
      'companyContactPersonInfo.emailAddress'
    ).setValue(formData.companyContactPersonInfo.emailAddress);
    this.SMTPServiceProviderControl.setValue(
      this.sharedCompanyConfigurationService.GetSMTPServiceProviderObject(formData.companyCommunicationInfo)
    );

    this.SMTPServerControl.setValue(
      formData.companyCommunicationInfo.smtpServer
    );
    this.CompanyConfigForm.get('companyCommunicationInfo.port').setValue(
      formData.companyCommunicationInfo.port
    );
    this.CompanyConfigForm.get('companyCommunicationInfo.userName').setValue(
      formData.companyCommunicationInfo.userName
    );
    this.CompanyConfigForm.get('companyCommunicationInfo.password').setValue(
      ''
    );
    this.CompanyConfigForm.get('companyCommunicationInfo.clientId').setValue(
      formData.companyCommunicationInfo.clientId
    );
    this.CompanyConfigForm.get(
      'companyCommunicationInfo.clientSecret'
    ).setValue(formData.companyCommunicationInfo.clientSecret);
    this.CompanyConfigForm.get(
      'companyCommunicationInfo.refreshToken'
    ).setValue(formData.companyCommunicationInfo.refreshToken);
    this.SendGridAPIKeyControl.setValue(formData.companyCommunicationInfo.sendGridAPIKey);
    this.CompanyConfigForm.get(
      'companyCommunicationInfo.smsAssignedNumber'
    ).setValue(formData.companyCommunicationInfo.smsAssignedNumber);
    this.CompanyConfigForm.get(
      'companyCommunicationInfo.smsUnassignedNumber'
    ).setValue(formData.companyCommunicationInfo.smsUnassignedNumber);
    this.CompanyConfigForm.get(
      'companyCommunicationInfo.smsTotalNumber'
    ).setValue(formData.companyCommunicationInfo.smsTotalNumber);
    this.CompanyConfigForm.get('companyCommunicationInfo.encryption').setValue(
      formData.companyCommunicationInfo.encryption
    );
    this.CompanyConfigForm.get(
      'companyAdvanceSettingInfo.isPurgeSensitiveInfo'
    ).setValue(formData.companyAdvanceSettingInfo.isPurgeSensitiveInfo);
    this.CompanyConfigForm.get(
      'companyAdvanceSettingInfo.isEnforceReCaptcha'
    ).setValue(formData.companyAdvanceSettingInfo.isEnforceReCaptcha);
    this.CompanyConfigForm.get('companyAdvanceSettingInfo.purgeTime').setValue(
      formData.companyAdvanceSettingInfo.purgeTime
    );
    this.CompanyConfigForm.get(
      'companyAdvanceSettingInfo.purgeTimeInterval'
    ).setValue(formData.companyAdvanceSettingInfo.purgeTimeInterval);
    this.CompanyConfigForm.get(
      'companyAdvanceSettingInfo.applicationTimeout'
    ).setValue(formData.companyAdvanceSettingInfo.applicationTimeout);
    this.CompanyConfigForm.get(
      'companyAdvanceSettingInfo.applicationTimeInterval'
    ).setValue(formData.companyAdvanceSettingInfo.applicationTimeInterval);
    this.CompanyConfigForm.get(
      'companyAdvanceSettingInfo.adminTimeout'
    ).setValue(formData.companyAdvanceSettingInfo.adminTimeout);
    this.CompanyConfigForm.get(
      'companyAdvanceSettingInfo.adminTimeInterval'
    ).setValue(formData.companyAdvanceSettingInfo.adminTimeInterval);
    this.CompanyConfigForm.get('companyAdvanceSettingInfo.loginMode').setValue(
      formData.companyAdvanceSettingInfo.loginMode
    );
    this.CompanyConfigForm.get('companyAdvanceSettingInfo.logoutUrl').setValue(
      formData.companyAdvanceSettingInfo.logoutUrl
    );
    this.CompanyConfigForm.get('companyAdvanceSettingInfo.endOfDayTimeFormControl').setValue(
      formData.companyAdvanceSettingInfo.endOfDayTimeFormControl
    );
    this.DefaultLanguage = formData.companyConfigurationInfo.defaultLanguage;
    this.BindSMSConfigurations();
  }

  public GetResponseData(res: IRequest): ICompanyConfiguration {
    const getResponseData: ICompanyConfiguration = {
      companySuperAdminInfo: {
        dataRetentionYears: res.superAdminConfig.dataRetentionYears,
        isLiteAgent: res.superAdminConfig.isLiteAgent,
        isClassicAgent: res.superAdminConfig.isClassicAgent,
        twilioAuthKey: res.superAdminConfig.twilioAuthKey,
        twilioAccountSID: res.superAdminConfig.twilioAccountSID,
        twilioServiceId: res.superAdminConfig.twilioServiceId,
        isAccountLinked: res.superAdminConfig.isAccountLinked,
        useLaviSMTPSettings: res.superAdminConfig.useLaviSMTPSettings,
        messangiBearerToken: res.superAdminConfig.messangiBearerToken,
        smsGatewayName: res.superAdminConfig.smsGatewayName,
      },
      companyConfigurationInfo: {
        id: this.SetDefaultIfUndefined(res.companyId),
        companyName: this.SetDefaultIfUndefined(res.companyName),
        city: null,
        country: res.countryCode
          ? this.GetCountryObj(res.countryCode)
          : DefaultCompanyConfigValues.CountryListDefaultValue,
        state: null,
        phoneNumber: this.SetDefaultIfUndefined(res.phoneNumber),
        zip: this.SetDefaultIfUndefined(res.zip),
        supportedLanguage: this.SetDefaultIfUndefined(res.supportedLanguages),
        billingAddress: this.SetDefaultIfUndefined(res.billingAddress),
        companyImg: this.SetDefaultIfUndefined(res?.logoUrlPath),
        tags: null,
        defaultLanguage: this.SetDefaultIfUndefined(res.defaultLanguage),
        isActive: res.isActive,
        isDeleted: res.isDeleted,
        isValidSMTPSettings: res.isValidSMTPSettings,
        address:res.address,
        laviAddress: res.laviAddress
      },
      companyContactPersonInfo: {
        firstName: this.SetDefaultIfUndefined(res.contactPerson.firstName),
        lastName: this.SetDefaultIfUndefined(res.contactPerson.lastName),
        roleInCompany: this.SetDefaultIfUndefined(
          res.contactPerson.roleInCompany
        ),
        cellPhoneNumber: this.SetDefaultIfUndefined(
          res.contactPerson.cellPhoneNumber
        ),
        emailAddress: this.SetDefaultIfUndefined(
          res.contactPerson.emailAddress
        ),
        extension: this.SetDefaultIfUndefined(res.contactPerson.extension),
        officeNumber: this.SetDefaultIfUndefined(
          res.contactPerson.officeNumber
        ),
      },
      companyCommunicationInfo: {
        serviceProvider: res.smtpSetting.serviceProvider,
        smtpServer: this.SetDefaultIfUndefined(res.smtpSetting.smtpServer),
        port: this.SetDefaultIfUndefined(res.smtpSetting.portNumber),
        userName: this.SetDefaultIfUndefined(res.smtpSetting.username),
        password: this.SetDefaultIfUndefined(res.smtpSetting.password),
        clientId: res.smtpSetting.clientId,
        clientSecret: res.smtpSetting.clientSecret,
        refreshToken: res.smtpSetting.refreshToken,
        sendGridAPIKey: res.smtpSetting.sendGridAPIKey,
        displayName: this.SetDefaultIfUndefined(res.smtpSetting.displayName),
        smsAssignedNumber: res.smsConfigs.filter(
          (x) => x.assignedBranchId !== null
        ).length,
        smsUnassignedNumber: res.smsConfigs.filter(
          (x) => x.assignedBranchId === null
        ).length,
        smsTotalNumber: res.smsConfigs.length,
        encryption: this.SetDefaultIfUndefined(
          this.GetEncryptionObj(res.smtpSetting.encryption)
        ),
      },
      companyAdvanceSettingInfo: {
        isPurgeSensitiveInfo: res.purgeSettings.isPurgeSensitiveInfo,
        purgeTime: this.SetDefaultIfUndefined(res.purgeSettings.duration.value),
        purgeTimeInterval: this.SetDefaultIfUndefined(
          this.GetTimeIntervalObj(res.purgeSettings.duration.unit)
        ),
        applicationTimeout: this.SetDefaultIfUndefined(
          res.siteSettings.appTimeout.value
        ),
        applicationTimeInterval: this.SetDefaultIfUndefined(
          this.GetTimeIntervalObj(res.siteSettings.appTimeout.unit)
        ),
        adminTimeout: this.SetDefaultIfUndefined(
          res.siteSettings.adminTimeout.value
        ),
        adminTimeInterval: this.SetDefaultIfUndefined(
          this.GetTimeIntervalObj(res.siteSettings.adminTimeout.unit)
        ),
        loginMode: this.SetDefaultIfUndefined(
          this.GetLoginModeObj(res.siteSettings.loginMode)
        ),
        logoutUrl: this.SetDefaultIfUndefined(res.siteSettings.logoutUrl),
        endOfDayTimeFormControl: this.GetEndOfDayTimeInDateTime(res),
        isEnforceReCaptcha: res?.securitySettings?.isEnforceReCaptcha ?? true
      },
    };
    return getResponseData;
  }

  private GetEndOfDayTimeInDateTime(res: IRequest): Date {
    const hours = res.siteSettings.endOfDayTime?.hours;
    const minutes = res.siteSettings.endOfDayTime?.minutes;
    return (hours !== null && hours !== undefined &&
      minutes !== null && minutes !== undefined) ?
      new Date(0, 0, 0, res.siteSettings.endOfDayTime.hours, res.siteSettings.endOfDayTime.minutes) :
      null;
  }

  public SetDefaultIfUndefined(result) {
    return result === undefined ? (result = null) : result;
  }

  public GetCountryObj(countryCode: string): ICountryDropdownList {
    return (this.SubjectCompanyConfigDropdownListData.value === undefined
      ? null
      : this.SubjectCompanyConfigDropdownListData.value.countryList.find(
          (x) => x.countryCode === countryCode
        ))

      ||(countryCode?{
        country:countryCode,
        countryCode:countryCode
      }:null);
  }

  public GetStateObj(stateCode: string): IStateDropdownList {
    return this.StateList.find((x) => x.stateCode === stateCode);
  }

  public GetCityObj(
    countryCode: string,
    stateCode: string,
    cityCode
  ): ICityDropDownList {
    const city = this.WorldCityList.find(
      (x) =>
        x.iso3 == countryCode && x.province == stateCode && x.city == cityCode
    );
    return city
      ? {
          cityCode: city?.city,
          city: city?.city,
          timeZone: city?.timezone,
        }
      : null;
  }

  public GetTimeIntervalObj(id: string): IDropdown {
    return this.SubjectCompanyConfigDropdownListData.value === undefined
      ? null
      : this.SubjectCompanyConfigDropdownListData.value.timeIntervalList.find(
          (x) => x.value === id
        );
  }

  public GetLoginModeObj(id: string): IDropdown {
    return this.SubjectCompanyConfigDropdownListData.value === undefined
      ? null
      : this.SubjectCompanyConfigDropdownListData.value.loginModeList.find(
          (x) => x.value === id
        );
  }

  public GetEncryptionObj(id: string): IDropdown {
    return this.SubjectCompanyConfigDropdownListData.value === undefined
      ? null
      : this.SubjectCompanyConfigDropdownListData.value.encryptionList.find(
          (x) => x.value === id
        );
  }

  public CallMultipleApi(): any {
    this.subs.sink = this.formService
      .CombineAPICall(
        this.GetCountryList(),
        this.GetLanguageList(),
        this.GetEncryptionList(),
        this.GetTimeIntervalList(),
        this.GetLoginModeList(),
        this.GetTagList(),
        this.GetBranchList()
      )
      .subscribe(
        ([
          countries,
          languages,
          encryptions,
          timeIntervals,
          loginmodes,
          tags,
          branches,
        ]) => {
          const DropdownData: ICompanyConfigDropdownListData = {
            countryList: countries,
            languageList: languages,
            encryptionList: encryptions,
            timeIntervalList: timeIntervals,
            loginModeList: loginmodes,
            tagList: tags,
            branchList: branches.concat([]),
          };
          if (!this.IsEditedMode) {
            this.GetCompanyConfigurationDetails(this.CompanyId);
          }
          this.CompanyConfigDropdownListData = DropdownData;
          this.SubjectCompanyConfigDropdownListData.next(DropdownData);
        }
      );
  }

  public async UpdateNumber(phoneNumber: PhoneNumber) {
    if (phoneNumber.oldLaviBranchId) {
      const OldBranch = await this.GetBranch(phoneNumber.oldLaviBranchId);
      OldBranch.smsPhoneNumber = null;
      await this.UpdateBranch(OldBranch);
    }
    if (phoneNumber.lavi_branchId) {
      const NewBranch = await this.GetBranch(phoneNumber.lavi_branchId);
      NewBranch.smsPhoneNumber = {
        phoneNumber: phoneNumber.phone_number.split('+1').pop(),
        id: phoneNumber.phone_number,
      };
      await this.UpdateBranch(NewBranch);
    }
    this.BindPhoneNumbers(this.authService.CompanyId);
  }

  public async GetBranch(branchId: string): Promise<any> {
    return this.branchAPIService.Get(this.CompanyId, branchId).toPromise();
  }

  public async UpdateBranch(data) {
    await this.branchAPIService.Update(this.CompanyId, data).toPromise();
  }

  public async DeleteNumber(phoneNumber: PhoneNumber) {
    await this.UpdateNumber({
      phone_number: phoneNumber.phone_number,
      oldLaviBranchId: phoneNumber.lavi_branchId,
      lavi_branchId: null,
    });
  }

  public GetCountryList() {
    return this.formService.GetAPICall<ICountryDropdownList[]>(
      this.locationBaseAPIUrl + '/countries'
    );
  }

  public GetBranchList() {
    return this.branchAPIService.GetDropdownList(this.CompanyId);
  }

  public GetLanguageList() {
    return this.formService.GetAPICall<ILanguageDropdownList>(
      this.LanguageBaseAPIUrl + '/languages'
    );
  }

  public GetEncryptionList() {
    return of(Encryptions);
  }

  public GetTimeIntervalList() {
    return of([
      { value: 'HR', text: 'Hours' },
      { value: 'MIN', text: 'Minutes' },
      { value: 'SEC', text: 'Seconds' },
    ]);
  }

  public GetLoginModeList() {
    return of([{ value: 'INTERNAL', text: 'Internal Authentication' }]);
  }

  public SetLoginModeList() {
    return of([{ value: LoginMode.INTERNAL, text: 'Internal Authentication' }]);
  }

  public GetTagList() {
    return this.companyAPIService.GetTags();
  }

  public AddLanguage(dropdownData: ILanguageDropdownList[]) {
    if (
      !dropdownData.some(
        (x) =>
          x.languageCode === this.DefaultLanguageControl.value?.languageCode
      )
    ) {
      this.SetDefaultLanguageIfOneValue(dropdownData);
    }
    this.DefaultLanguage = this.DefaultLanguageControl.value;
    this.SubjectDefaultLanguageList.next(dropdownData);
  }

  private SetDefaultLanguageIfOneValue(dropdownData: ILanguageDropdownList[]) {
    if (dropdownData.length > 1) {
      this.DefaultLanguageControl.setValue(null);
    } else {
      this.DefaultLanguageControl.setValue(dropdownData[0]);
    }
  }

  public SetDefaultLanguage(defaultLanguage: ILanguageDropdownList) {
    if (this.DefaultLanguage?.languageCode) {
      this.SetAndShowConfirmDefaultLanguageMsg(defaultLanguage);
    } else {
      this.DefaultLanguage = defaultLanguage;
    }
  }

  private SetAndShowConfirmDefaultLanguageMsg(
    defaultLanguage: ILanguageDropdownList
  ) {
    if (
      !confirm(
        'This change will be impacted on workflow, kiosk, mobile. Are you sure you want to change it ?'
      )
    ) {
      this.DefaultLanguageControl.setValue(this.DefaultLanguage);
    } else {
      this.DefaultLanguage = defaultLanguage;
    }
  }

  public BindStateList(countryId: string, fn): void {
    if (countryId === '0') {
      this.CompanyConfigForm.get('companyConfigurationInfo.country').setValue(
        DefaultCompanyConfigValues.CountryListDefaultValue
      );
    }
    this.CompanyConfigForm.get('companyConfigurationInfo.state').setValue(
      DefaultCompanyConfigValues.StateListDefaultValue
    );
    this.CompanyConfigForm.get('companyConfigurationInfo.city').setValue(
      DefaultCompanyConfigValues.CityListDefaultValue
    );
    this.CompanyConfigForm.get('companyConfigurationInfo.zip').setValue('');
    this.subs.sink = this.formService
      .GetAPICall<IStateDropdownList[]>(
        this.locationBaseAPIUrl + '/states?countryCode=' + countryId
      )
      .subscribe((res) => {
        this.StateList = res;
        this.SubjectStateList.next(res);
        this.SubjectCityList.next([]);
        if (fn) {
          fn();
        }
      });
  }

  public BindCityList(countryId: string, stateId: string, fn?: Function) {
    const cities = this.WorldCityList.filter(
      (x) => x.iso3 == countryId && x.province == stateId
    )?.map((x) => {
      return {
        cityCode: x?.city,
        city: x?.city,
        timeZone: x?.timezone,
      };
    });
    this.SubjectCityList.next(cities);
    if (fn) {
      fn();
    }
  }

  public ResetZipCity(locationDetail: any) {
    const State: IStateDropdownList = this.CompanyConfigForm.get(
      'companyConfigurationInfo.state'
    ).value;
    if (State.stateCode === '0') {
      this.CompanyConfigForm.get('companyConfigurationInfo.state').setValue(
        DefaultCompanyConfigValues.StateListDefaultValue
      );
    }
    this.CompanyConfigForm.get('companyConfigurationInfo.city').setValue(null);
    this.CompanyConfigForm.get('companyConfigurationInfo.zip').setValue('');
    this.BindCityList(locationDetail.countryId, locationDetail.stateId);
  }

  public ResetZipCode() {
    this.CompanyConfigForm.get('companyConfigurationInfo.zip').setValue('');
  }

  public SaveCompanyConfiguration(req: FormGroup) {
    if (
      this.authStateService.UserType === UserType.Lavi &&
      !(this.LiteAgentControl.value || this.ClassicAgentControl.value) &&
      req.valid
    ) {
      this.AppNotificationService.NotifyError(
        'Please select at least one Agent Layout Designer.'
      );
    } else if (!this.IsEditedMode) {
      this.formService
        .CallFormMethod<ICompanyConfiguration>(req)
        .then((response) => {
          const companyImg: any = response.companyConfigurationInfo.companyImg;
          if (companyImg) {
            if (companyImg.name !== undefined) {
              this.formService
                .GetImageUrl(response.companyConfigurationInfo.companyImg)
                .subscribe((x) => {
                  this.ImageUrl = x;
                  this.PutCompanyConfigurationDetails(response);
                });
            } else {
              this.ImageUrl = response.companyConfigurationInfo.companyImg;
              this.PutCompanyConfigurationDetails(response);
            }
          } else {
            this.PutCompanyConfigurationDetails(response);
          }
        });
    } else {
      this.formService
        .CallFormMethod<ICompanyConfiguration>(req)
        .then((response) => {
          if (response.companyConfigurationInfo.companyImg) {
            this.subs.sink = this.formService
              .GetImageUrl(response.companyConfigurationInfo.companyImg)
              .subscribe((x) => {
                this.ImageUrl = x;
                this.PostCompanyConfigurationDetails(response);
              });
          } else {
            this.PostCompanyConfigurationDetails(response);
          }
        });
    }
  }

  private PostCompanyConfigurationDetails(response: ICompanyConfiguration) {
    const data: IRequest = this.GetRequest(response);
    this.subs.sink = this.companyAPIService
      .Create(data)
      .subscribe((result: any) => {
        if (result) {
          this.browserStorageService.SetCompanyId(result.companyId); // Dipesh: remove these after list screen created
          this.mediatorService.CompanyGetChanged();
          this.AppNotificationService.Notify('Company created.');
          this.Cancel();
        } else {
          this.AppNotificationService.NotifyError('Something went wrong.');
        }
      });
  }

  private async CheckTwilioServiceCredentials(
    credentials: ITwilioCredentials
  ): Promise<boolean> {
    const CredentialCheck = await this.messagingAPIService
      .ValidateCredentials<ITwilioCredentials, boolean>(null, credentials)
      .toPromise();
    return Promise.resolve(CredentialCheck);
  }

  private async PutCompanyConfigurationDetails(
    response: ICompanyConfiguration
  ) {
    const req: IRequest = this.GetRequest(response);
    const credentials = {
      AccountSID: response.companySuperAdminInfo.twilioAccountSID,
      AuthKey: response.companySuperAdminInfo.twilioAuthKey,
      ServiceID: response.companySuperAdminInfo.twilioServiceId,
    };
    const validation = await this.CheckTwilioServiceCredentials(credentials);
    req.superAdminConfig.isAccountLinked = validation;
    this.subs.sink = this.companyAPIService
      .Update<any, IRequest>(req)
      .subscribe((result) => {
        if (result) {
          this.mediatorService.CompanyGetChanged();
          this.browserStorageService.SetCurrentSelectedCompanyName(
            result.companyName
          );
          this.AppNotificationService.Notify('Company updated.');
          this.Cancel();
        } else {
          this.AppNotificationService.NotifyError('Something went wrong.');
        }
      });
  }

  async UpdateTwilioConfigurations(): Promise<void> {
    const twilioAccountSID = this.CompanyConfigForm.get(
      'companySuperAdminInfo.twilioAccountSID'
    ).value;
    const twilioAuthKey = this.CompanyConfigForm.get(
      'companySuperAdminInfo.twilioAuthKey'
    ).value;
    const twilioServiceId = this.CompanyConfigForm.get(
      'companySuperAdminInfo.twilioServiceId'
    ).value;
    if (twilioAccountSID && twilioAuthKey && twilioServiceId) {
      const twilioCredentials: ITwilioCredentials = {
        AccountSID: twilioAccountSID,
        AuthKey: twilioAuthKey,
        ServiceID: twilioServiceId,
      };
      const IsAccountLinked = await this.CheckTwilioServiceCredentials(
        twilioCredentials
      );
      if (!IsAccountLinked) {
        this.AppNotificationService.NotifyError(
          'SMS configuration credentials is invalid.'
        );
        this.IsSMSConfigAccountLinkedSubject.next(false);
        return;
      }else{
        this.BindPhoneNumbers(this.authService.CompanyId);
      }
      twilioCredentials.IsAccountLinked = IsAccountLinked;
      const response = await this.companyAPIService
        .UpdateSMSCredentials<IRequest, ITwilioCredentials>(
          this.CompanyId,
          twilioCredentials
        )
        .toPromise();

      this.CompanyConfigForm.get(
        'companySuperAdminInfo.twilioAccountSID'
      ).setValue(response?.superAdminConfig?.twilioAccountSID);
      this.CompanyConfigForm.get(
        'companySuperAdminInfo.twilioAuthKey'
      ).setValue(response?.superAdminConfig?.twilioAuthKey);
      this.CompanyConfigForm.get(
        'companySuperAdminInfo.twilioServiceId'
      ).setValue(response?.superAdminConfig?.twilioServiceId);
      this.IsSMSConfigAccountLinkedSubject.next(true);
    } else {
      this.AppNotificationService.NotifyError(
        'Please enter SMS configuration credentials.'
      );
      this.IsSMSConfigAccountLinkedSubject.next(false);
    }
  }

  public GetRequest(result: ICompanyConfiguration): IRequest {
    let id: string;
    if (this.IsEditedMode) {
      id = this.uuid;
    }

    const smtpServiceProvider: any =
      result.companyCommunicationInfo.serviceProvider;
    const data: IRequest = {
      pk: this.IsEditedMode ? id : this.CompanyId,
      type: this.TypeAsData,
      companyId: this.IsEditedMode ? id : this.CompanyId,
      companyName: result.companyConfigurationInfo.companyName,
      billingAddress: result.companyConfigurationInfo.billingAddress,
      address: result.companyConfigurationInfo.address,
      laviAddress: result.companyConfigurationInfo.laviAddress,
      city: result.companyConfigurationInfo.city?.cityCode,
      stateCode: result.companyConfigurationInfo.state?.stateCode,
      zip: result.companyConfigurationInfo.zip,
      countryCode: result.companyConfigurationInfo.country?.countryCode,
      phoneNumber: result.companyConfigurationInfo.phoneNumber
        ? result.companyConfigurationInfo.phoneNumber
        : null,
      logoUrlPath: this.ImageUrl,
      supportedLanguages: this.SetSupportedLanguageResponseObj(
        result.companyConfigurationInfo.supportedLanguage
      ),
      defaultLanguage: result.companyConfigurationInfo.defaultLanguage,
      isActive: result.companyConfigurationInfo.isActive,
      isDeleted: result.companyConfigurationInfo.isDeleted,
      isValidSMTPSettings: result.companyConfigurationInfo.isValidSMTPSettings,
      tags: this.SubjectTagList.value,
      smtpSetting: {
        serviceProvider: smtpServiceProvider.value,
        smtpServer: result.companyCommunicationInfo.smtpServer,
        portNumber: result.companyCommunicationInfo.port,
        username: result.companyCommunicationInfo.userName,
        password: result.companyCommunicationInfo.password,
        clientId: result.companyCommunicationInfo.clientId,
        clientSecret: result.companyCommunicationInfo.clientSecret,
        refreshToken: result.companyCommunicationInfo.refreshToken,
        sendGridAPIKey: result.companyCommunicationInfo.sendGridAPIKey,
        displayName: result.companyCommunicationInfo.displayName,
        encryption:
          result.companyCommunicationInfo.encryption === null
            ? null
            : result.companyCommunicationInfo.encryption.value,
      },
      smsConfigs: [
        {
          phoneNumber: '',
          assignedBranchId: null,
        },
      ],
      purgeSettings: {
        isPurgeSensitiveInfo:
          result.companyAdvanceSettingInfo.isPurgeSensitiveInfo,
        duration: {
          value: result.companyAdvanceSettingInfo.purgeTime,
          unit: result.companyAdvanceSettingInfo.purgeTimeInterval.value,
        },
      },
      securitySettings: {
        isEnforceReCaptcha: result.companyAdvanceSettingInfo.isEnforceReCaptcha
      },
      superAdminConfig: {
        dataRetentionYears: Number(
          result.companySuperAdminInfo.dataRetentionYears
        ),
        isLiteAgent: result.companySuperAdminInfo.isLiteAgent,
        isClassicAgent: result.companySuperAdminInfo.isClassicAgent,
        twilioAccountSID: result.companySuperAdminInfo.twilioAccountSID,
        twilioAuthKey: result.companySuperAdminInfo.twilioAuthKey,
        twilioServiceId: result.companySuperAdminInfo.twilioServiceId,
        isAccountLinked: this.IsSMSConfigAccountLinkedSubject.value,
        useLaviSMTPSettings: result.companySuperAdminInfo.useLaviSMTPSettings,
        messangiBearerToken: result.companySuperAdminInfo.messangiBearerToken,
        smsGatewayName: result.companySuperAdminInfo.smsGatewayName,
      },
      siteSettings: {
        appTimeout: {
          value: result.companyAdvanceSettingInfo.applicationTimeout,
          unit: result.companyAdvanceSettingInfo.applicationTimeInterval.value,
        },
        adminTimeout: {
          value: result.companyAdvanceSettingInfo.adminTimeout,
          unit: result.companyAdvanceSettingInfo.adminTimeInterval.value,
        },
        logoutUrl: result.companyAdvanceSettingInfo.logoutUrl,
        endOfDayTime: this.GetEndOfDayTime(result),
        loginMode:
          result.companyAdvanceSettingInfo.loginMode === null
            ? null
            : result.companyAdvanceSettingInfo.loginMode.value,
      },
      contactPerson: {
        firstName: result.companyContactPersonInfo.firstName,
        lastName: result.companyContactPersonInfo.lastName,
        roleInCompany: result.companyContactPersonInfo.roleInCompany,
        cellPhoneNumber: result.companyContactPersonInfo.cellPhoneNumber,
        emailAddress: result.companyContactPersonInfo.emailAddress,
        extension: result.companyContactPersonInfo.extension,
        officeNumber: result.companyContactPersonInfo.officeNumber,
      },
    };
    return data;
  }

  private GetEndOfDayTime(result: ICompanyConfiguration): ITime {
    return {
      hours: result.companyAdvanceSettingInfo.endOfDayTimeFormControl ?
      Number(result.companyAdvanceSettingInfo.endOfDayTimeFormControl.getHours()) :
      null,
      minutes: result.companyAdvanceSettingInfo.endOfDayTimeFormControl?
      Number(result.companyAdvanceSettingInfo.endOfDayTimeFormControl.getMinutes()) :
      null,
    };
  }

  public SetSupportedLanguageResponseObj(
    supportedLanguage: ILanguageDropdownList[]
  ) {
    const defaultLanguage = this.CompanyConfigForm.get(
      'companyConfigurationInfo.defaultLanguage'
    ).value;
    const language = supportedLanguage.find(
      (x) => x.languageCode === defaultLanguage.languageCode
    );
    return supportedLanguage;
  }

  public EnterTag() {
    const notFoundIndex = -1;
    const tag = this.TagControl.value;
    const isValidTag =
      tag !== null &&
      tag.trim() !== '' &&
      !this.SubjectTagList.value.includes(tag.toLowerCase());

    if (isValidTag) {
      this.SubjectTagList.value.push(tag);
      if (
        this.SubjectCompanyConfigDropdownListData.value.tagList.indexOf(tag) ===
        notFoundIndex
      ) {
        this.SubjectCompanyConfigDropdownListData.value.tagList.push(tag);
      }
    }
    this.SubjectTagList.next(this.SubjectTagList.value);
    this.TagControl.reset();
  }

  public RemoveTags(e: ChipRemoveEvent) {
    const tags = this.SubjectTagList.value;
    tags.splice(
      tags.findIndex((c) => c === e.sender.label),
      1
    );
    this.SubjectTagList.next(tags);
  }

  public Cancel() {
    this.routeHandlerService.RedirectToHome();
  }

  public RedirectToAddCompany() {
    this.routeHandlerService.RedirectToAddCompany();
  }

  public ValueAlreadyExist(value: string): Observable<boolean> {
    return this.companyAPIService.AlreadyExists(this.CompanyId, value.trim());
  }

  ValidateName(): AsyncValidatorFn {
    return (input: FormControl) => {
      return timer(1000).pipe(
        switchMap(() => this.ValueAlreadyExist(input.value)),
        map((response) => {
          return response ? { isExists: true } : null;
        })
      );
    };
  }

  AddressChanged(address: ILaviAddress) {
    this.CompanyConfigForm.get('companyConfigurationInfo.address').setValue(
      address.formattedAddress
    );

    this.CompanyConfigForm.get('companyConfigurationInfo.laviAddress').setValue(
      address
    );

    let country = this.GetCountry(address.countryId);
    if(!country){
      country = {
        country: address.countryId,
        countryCode: address.countryId,
      }
    }
    this.CompanyConfigForm.get('companyConfigurationInfo.country').setValue(
      country
    );

    let zip = address.zipCode;
    this.CompanyConfigForm.get('companyConfigurationInfo.zip').setValue(zip);
  }

  GetCountry(countryId: string) {
    let country = this.CompanyConfigDropdownListData.countryList.find(
      (x) => x.countryCode == countryId
    );
    return country??
    {
      country: countryId,
      countryCode: countryId,
    };
  }

}
