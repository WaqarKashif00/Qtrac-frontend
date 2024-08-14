import { ChangeDetectorRef, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChipRemoveEvent } from '@progress/kendo-angular-buttons';
import { timezoneNames } from '@progress/kendo-date-math';
import '@progress/kendo-date-math/tz/all';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, map, switchMap, take } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { cloneObject } from 'src/app/core/utilities/core-utilities';
import { ICityDropDownList } from 'src/app/models/common/city-dropdown-list.interface';
import { ICountryDropdownList } from 'src/app/models/common/country-dropdown-list.interface';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { IHoursOfOperationDropdown } from 'src/app/models/common/hours-of-operation-dropdown.interface';
import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { IServiceDropdown } from 'src/app/models/common/service.dropdown.interface';
import { IStateDropdownList } from 'src/app/models/common/state-dropdown-list.interface';
import { IWorkFlowDropdown } from 'src/app/models/common/workflow-dropdown.interface';
import { DefaultAddNewBranchValues } from 'src/app/models/constants/add-new-branch.constant';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { Validations } from 'src/app/models/constants/validation.constant';
import { DeviceStatus } from 'src/app/models/enums/device-status.enum';
import { ILaviAddress } from 'src/app/shared/api-models/google-models/lavi-address.interface';
import { HoursOfOperationAPIService } from 'src/app/shared/api-services/hoo-api.service';
import { Confirmable } from 'src/app/shared/decorators/confirmable.decorator';
import { BranchValidatorService } from 'src/app/shared/validators/branch.validator';
import {
  AddressValidate, CustomRequiredDropDownValidator,
  requiredFileType
} from 'src/app/shared/validators/common.validator';
import { KioskType } from '../../../models/enums/kiosk-type.enum';
import { BranchAPIService } from '../../../shared/api-services/branch-api.service';
import { CompanyAPIService } from '../../../shared/api-services/company-api.service';
import { KioskAPIService } from '../../../shared/api-services/kiosk-api.service';
import { LocationAPIService } from '../../../shared/api-services/location-api.service';
import { MessagingAPIService } from '../../../shared/api-services/messenging-api.service';
import { MobileAPIService } from '../../../shared/api-services/mobile-api.service';
import { MonitorAPIService } from '../../../shared/api-services/monitor-api.service';
import { WorkflowAPIService } from '../../../shared/api-services/workflow-api.service';
import { BranchMessages } from '../message';
import { IAdditionalSettings } from '../models/additional-settings.interface';
import { IAdvanceSettings } from '../models/advance-settings.interface';
import { IBranch } from '../models/branch.interface';
import { IContactPerson } from '../models/contact-person.interface';
import { IDropdownList } from '../models/dropdown-list.interface';
import { IGeneralSettings } from '../models/general-settings.interface';
import { IKioskList } from '../models/kiosk-list.interface';
import { IKioskSendMessageRequest } from '../models/kiosk-send-message.interface';
import { ILayoutTemplate } from '../models/layout-template.interface';
import { IMobileInterface } from '../models/mobile-interface.interface';
import { INewBranchDropdownList } from '../models/new-branch-dropdown-list.interface';
import { IPhoneNumber } from '../models/phone-number.model';
import { PrinterTemplate } from '../models/printer-dropdown-list.interface';
import { IRequest } from '../models/request-interface';
import { ITemplateList } from '../models/template-list.interface';
import { ITemplate } from '../models/template-request.interface';
import { IWorkFlowUsedInBranchList } from '../models/workflow-used-in-branch-list.interface';
import { IWorkFlowUsedInBranch } from '../models/workflow-used-in-branch.interface';
const cityTimezones = require('city-timezones');

@Injectable()
export class AddNewBranchService extends AbstractComponentService {
  /* #region  Property Declarations */

  TemplateDetails: ITemplateList;

  BranchForm: FormGroup;
  TemplateForm: FormGroup;
  MobileForm: FormGroup;
  LinkDeviceForm: FormGroup;
  MessageForm: FormGroup;
  DeskForm: FormGroup;
  LiveForm: FormGroup;
  WorkflowUsedInBranchForm: FormGroup;
  MonitorForm: FormGroup;


  private SubjectNewBranchDropdownListData: BehaviorSubject<INewBranchDropdownList>;
  public NewBranchDropdownListData$: Observable<INewBranchDropdownList>;
  private SubjectStates: Subject<IStateDropdownList[]>;
  public States$: Observable<IStateDropdownList[]>;
  private SubjectCities: Subject<ICityDropDownList[]>;
  public Cities$: Observable<ICityDropDownList[]>;
  private SubjectKioskList: BehaviorSubject<ITemplate[]>;
  public KioskList$: Observable<ITemplate[]>;
  private SubjectMonitorList: BehaviorSubject<ITemplate[]>;
  public MonitorList$: Observable<ITemplate[]>;
  private SubjectMobileInterfaceList: BehaviorSubject<IMobileInterface[]>;
  public MobileInterfaceList$: Observable<IMobileInterface[]>;
  public SelectedMobileTemplates$: Observable<ILayoutTemplate[]>;
  private SubjectDefaultLanguageList: Subject<ILanguageDropdownList[]>;
  public DefaultLanguageList$: Observable<ILanguageDropdownList[]>;
  private SubjectWorkflowName: BehaviorSubject<string>;
  public WorkflowName$: Observable<string>;
  private SubjectMobileInterfacesByKioskWorkflowId: BehaviorSubject<
    ILayoutTemplate[]
  >;
  public MobileInterfacesByKioskWorkflowId$: Observable<ILayoutTemplate[]>;
  private SubjectDeskList: Subject<IDropdownList[]>;
  public DeskList$: Observable<IDropdownList[]>;
  DropdownData: INewBranchDropdownList = {
    branchTimeZone: [],
    countries: [],
    exceptionHoursOfOperations: [],
    hoursOfOperation: [],
    languages: [],
    numberList: [],
    phoneNumberList: [],
    tags: [],
    timeIntervals: [],
    locationPrinters:[]
  };
  public States: IStateDropdownList[];
  public SubjectIsEditMode: BehaviorSubject<boolean>;
  public IsEditMode$: Observable<boolean>;
  SubjectWorkFlowUsedInBranchList: BehaviorSubject<
    IWorkFlowUsedInBranchList[]
  >;
  public WorkflowUsedInBranchList$: Observable<IWorkFlowUsedInBranchList[]>;
  SubjectWorkflows: BehaviorSubject<IWorkFlowDropdown[]>;
  public Workflows$: Observable<IWorkFlowDropdown[]>;
  private SubjectServices: BehaviorSubject<IServiceDropdown[]>;
  public Services$: Observable<IServiceDropdown[]>;
  private SubjectOpenWorkFlowUsedInBranchDialog: BehaviorSubject<boolean>;
  public OpenWorkFlowUsedInBranchDialog$: Observable<boolean>;
  private SubjectKioskLayoutTemplate: BehaviorSubject<ILayoutTemplate[]>;
  public KioskLayoutTemplate$: Observable<ILayoutTemplate[]>;
  private SubjectLocationPrinters: BehaviorSubject<PrinterTemplate[]>;
  public LocationPrinters$: Observable<PrinterTemplate[]>;
  private SubjectKioskPrinters: BehaviorSubject<PrinterTemplate[]>;
  public KioskPrinters$: Observable<PrinterTemplate[]>;
  private SubjectMonitorLayoutTemplate: BehaviorSubject<ILayoutTemplate[]>;
  public MonitorLayoutTemplate$: Observable<ILayoutTemplate[]>;
  private SubjectTags: BehaviorSubject<string[]>;
  public Tags$: Observable<string[]>;
  public IsEditMode: boolean;
  public IsWorkflowEditMode: boolean;
  private SubjectIsShutdownSuccessFully: BehaviorSubject<boolean>;
  public IsShutdownSuccessFully$: Observable<boolean>;
  private SubjectMobileInterfaceLayoutTemplate: BehaviorSubject<
    ILayoutTemplate[]
  >;
  private ContactListSubject : BehaviorSubject<IContactPerson[]>
  public ContactList$ : Observable<IContactPerson[]>
  public MobileInterfaceLayoutTemplate$: Observable<ILayoutTemplate[]>;
  public DeviceIdStatus: string;
  public BranchId = this.browserStorageService.BranchId;
  public ImageUrl: string;
  public CompanyId: string;
  private DefaultLanguage: ILanguageDropdownList;
  private mobileInterfaceId:string;
  WorldCityList: any;
  /* #endregion */

  get ServicesControl() {
    return this.WorkflowUsedInBranchForm.get('services');
  }

  get BranchNameControl() {
    return this.BranchForm.get('generalSettings.name');
  }

  get TagControl() {
    return this.BranchForm.get('generalSettings.tags');
  }

  get SupportedLanguageControl() {
    return this.BranchForm.get('generalSettings.supportedLanguages');
  }

  get DefaultLanguageControl() {
    return this.BranchForm.get('generalSettings.defaultLanguage');
  }

  get browserIdFormControl() {
    return this.TemplateForm.get('browserId');
  }

  get deviceIdFormControl() {
    return this.TemplateForm.get('deviceId');
  }

  /* #endregion */

  /* #region  Initial life cycle */

  constructor(
    private router: ActivatedRoute,
    private readonly hoursOfOperationAPIService: HoursOfOperationAPIService,
    private readonly companyAPIService: CompanyAPIService,
    private readonly branchAPIService: BranchAPIService,
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly locationAPIService: LocationAPIService,
    private readonly kioskAPIService: KioskAPIService,
    private readonly monitorAPIService: MonitorAPIService,
    private readonly mobileAPIService: MobileAPIService,
    private readonly messagingAPIService: MessagingAPIService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly branchValidatorService: BranchValidatorService,
  ) {
    super();
    this.SetObservables();
    this.InitializeProperties();
    this.SetBranchFormGroup(this.GetDefaultBranchDetails());
    this.SubscribeFormEvents();
    this.WorldCityList = cityTimezones.cityMapping;
  }

  SubscribeFormEvents() {
   this.subs.sink = this.BranchForm.get('advanceSettings.enableTextToJoin').valueChanges.subscribe(data=>{
     if(data){
      this.BranchForm.get('advanceSettings.textToJoinMobileInterface').setValidators(CustomRequiredDropDownValidator('templateId'))
     }else{
      this.BranchForm.get('advanceSettings.textToJoinMobileInterface').setValidators(null)
     }
     this.BranchForm.get('advanceSettings.textToJoinMobileInterface').markAsDirty();
     this.BranchForm.get('advanceSettings.textToJoinMobileInterface').updateValueAndValidity();
   })
  }

  public SetObservables() {
    this.SubjectNewBranchDropdownListData =
      new BehaviorSubject<INewBranchDropdownList>(this.DropdownData);
    this.NewBranchDropdownListData$ =
      this.SubjectNewBranchDropdownListData.asObservable();
    this.SubjectStates = new Subject<IStateDropdownList[]>();
    this.States$ = this.SubjectStates.asObservable();
    this.SubjectCities = new Subject<ICityDropDownList[]>();
    this.Cities$ = this.SubjectCities.asObservable();
    this.SubjectKioskList = new BehaviorSubject<ITemplate[]>([]);
    this.KioskList$ = this.SubjectKioskList.asObservable();
    this.SubjectMonitorList = new BehaviorSubject<ITemplate[]>([]);
    this.MonitorList$ = this.SubjectMonitorList.asObservable();
    this.SubjectMobileInterfaceList = new BehaviorSubject<IMobileInterface[]>(
      []
    );
    this.MobileInterfaceList$ = this.SubjectMobileInterfaceList.asObservable();
    this.SelectedMobileTemplates$ = this.MobileInterfaceList$.pipe(
      map((mobileTemplates) => {
        const textToJoinMobileInterface = this.BranchForm.get('advanceSettings.textToJoinMobileInterface').value;

        if(this.mobileInterfaceId && !textToJoinMobileInterface){
          this.BranchForm.get('advanceSettings.textToJoinMobileInterface').setValue(
            this.GetMobileInterfaceObj(this.mobileInterfaceId)
          );
        }
        const selectedTemplates: ILayoutTemplate[] = mobileTemplates.map(
          (template) => {
            return {
              templateId: template.id,
              templateName: template.name.templateName,
            };
          }
        );
        return selectedTemplates;
      })
    );
    this.SubjectDefaultLanguageList = new Subject<ILanguageDropdownList[]>();
    this.DefaultLanguageList$ = this.SubjectDefaultLanguageList.asObservable();
    this.SubjectWorkflowName = new BehaviorSubject<string>(null);
    this.WorkflowName$ = this.SubjectWorkflowName.asObservable();
    this.SubjectMobileInterfacesByKioskWorkflowId = new BehaviorSubject<
      ILayoutTemplate[]
    >([]);
    this.MobileInterfacesByKioskWorkflowId$ =
      this.SubjectMobileInterfacesByKioskWorkflowId.asObservable();
    this.SubjectDeskList = new Subject<IDropdownList[]>();
    this.DeskList$ = this.SubjectDeskList.asObservable();
    this.SubjectIsEditMode = new BehaviorSubject<boolean>(false);
    this.IsEditMode$ = this.SubjectIsEditMode.asObservable();
    this.SubjectWorkflows = new BehaviorSubject<IWorkFlowDropdown[]>([]);
    this.Workflows$ = this.SubjectWorkflows.asObservable();
    this.SubjectServices = new BehaviorSubject<IServiceDropdown[]>([]);
    this.Services$ = this.SubjectServices.asObservable();
    this.SubjectWorkFlowUsedInBranchList = new BehaviorSubject<
      IWorkFlowUsedInBranchList[]
    >([]);
    this.WorkflowUsedInBranchList$ =
      this.SubjectWorkFlowUsedInBranchList.asObservable();
    this.SubjectOpenWorkFlowUsedInBranchDialog = new BehaviorSubject<boolean>(
      false
    );
    this.OpenWorkFlowUsedInBranchDialog$ =
      this.SubjectOpenWorkFlowUsedInBranchDialog.asObservable();


    this.SubjectKioskLayoutTemplate = new BehaviorSubject<ILayoutTemplate[]>(
      []
    );
    this.KioskLayoutTemplate$ = this.SubjectKioskLayoutTemplate.asObservable();
    this.SubjectLocationPrinters = new BehaviorSubject<PrinterTemplate[]>([]);
    this.LocationPrinters$ = this.SubjectLocationPrinters.asObservable();
    this.SubjectKioskPrinters = new BehaviorSubject<PrinterTemplate[]>([]);
    this.KioskPrinters$ = this.SubjectKioskPrinters.asObservable();
    this.SubjectMonitorLayoutTemplate = new BehaviorSubject<ILayoutTemplate[]>(
      []
    );
    this.MonitorLayoutTemplate$ =
      this.SubjectMonitorLayoutTemplate.asObservable();
    this.SubjectTags = new BehaviorSubject<string[]>([]);
    this.Tags$ = this.SubjectTags.asObservable();
    this.SubjectIsShutdownSuccessFully = new BehaviorSubject<boolean>(false);
    this.IsShutdownSuccessFully$ =
      this.SubjectIsShutdownSuccessFully.asObservable();
    this.SubjectMobileInterfaceLayoutTemplate = new BehaviorSubject<
      ILayoutTemplate[]
    >([]);
    this.MobileInterfaceLayoutTemplate$ =
      this.SubjectMobileInterfaceLayoutTemplate.asObservable();
      this.ContactListSubject = new BehaviorSubject<IContactPerson[]>([]);
      this.ContactList$ = this.ContactListSubject.asObservable();

    this.SetWorkFlowDropdownList();
  }

  public InitializeProperties() {
    this.CompanyId = this.authService.CompanyId;
    this.TemplateDetails = {
      kioskList: [],
      monitorList: [],
      mobileInterfaceList: [],
      deskList: [],
    };
    this.GetKioskTemplate();
    this.GetMonitorTemplate();
    this.GetMobileInterfaceTemplate();
    this.SetLocationPrintersToSubject();
    // this.SetKioskPrintersToSubject();
  }

  public SetBranchFormGroup(branchDetailsData: IBranch) {
    this.BranchForm = this.formBuilder.group({
      generalSettings: this.GetGeneralSettingFormGroup(
        branchDetailsData.generalSettings
      ),
      additionalSettings: this.GetAdditionalSettingsFormGroup(
        branchDetailsData.additionalSettings
      ),
      advanceSettings: this.GetAdvanceSettingsFormGroup(
        branchDetailsData.advanceSettings
      ),
    });
  }

  private GetAdditionalSettingsFormGroup(
    additionalSettings: IAdditionalSettings
  ) {
    return this.formBuilder.group({
      hoursOfOperation: [additionalSettings.hoursOfOperation],
      branchTimezone: [additionalSettings.branchTimezone, Validators.required],
    });
  }

  private GetAdvanceSettingsFormGroup(advanceSettings: IAdvanceSettings) {
    return this.formBuilder.group({
      hoursOfOperationException: [advanceSettings.hoursOfOperationException],
      hideBranchFromScheduler: [
        advanceSettings.hideBranchFromScheduler || false,
      ],
      enableTextToJoin: [advanceSettings.enableTextToJoin || false],
      textToJoinMobileInterface: [
        advanceSettings.textToJoinMobileInterface],
        overridetwilioServiceId:[advanceSettings.overridetwilioServiceId]
    }
    );
  }

  private GetGeneralSettingFormGroup(generalSettings: IGeneralSettings): any {
    const generalSettingForm = this.formBuilder.group({
      id: [generalSettings.id, []],
      name: [
        generalSettings.name,
        {
          updateOn: 'change',
          validators: [Validators.required],
          asyncValidators: [
            this.branchValidatorService.BranchNameAlreadyExistValidator(
              this.CompanyId,
              this.BranchId,
              generalSettings.name
            ),
          ],
        },
      ],
      address: [generalSettings.address],
      country: [generalSettings.country],
      state: [generalSettings.state],
      city: [generalSettings.city],
      branchImg: [
        generalSettings.branchImg,
        [requiredFileType(['png', 'jpg', 'jpeg'], 4000000)],
      ],
      phoneNumber: [
        generalSettings.phoneNumber,
        [Validators.pattern(Validations.PhoneNoRegx2),Validators.maxLength(16)],
      ],
      zip: [generalSettings.zip],
      defaultLanguage: [
        generalSettings.defaultLanguage,
        CustomRequiredDropDownValidator('languageCode'),
      ],
      supportedLanguages: [
        generalSettings.supportedLanguages,
        [Validators.required],
      ],
      branchSmsNumber: [generalSettings.branchSmsNumber],
      isCompanyGeneralSetting: [generalSettings.isCompanyGeneralSetting],
      tags: [generalSettings.tags],
      isActive: [generalSettings.isActive],
      friendlyBranchName: [generalSettings.friendlyBranchName],
      laviAddress: [generalSettings.laviAddress, [AddressValidate()]],
      defaultPrinter: [generalSettings.defaultPrinter],
    });

    return generalSettingForm;
  }

  public GetDefaultBranchDetails(): IBranch {
    return {
      generalSettings: this.GetDefaultGeneralSettings(),
      additionalSettings: this.GetDefaultAdditionalSettings(),
      advanceSettings: this.GetDefaultAdvancedSettings(),
    };
  }

  private GetDefaultGeneralSettings(): IGeneralSettings {
    return {
      branchId: '',
      id: '',
      name: '',
      address: '',
      country: null,
      state: null,
      city: null,
      branchImg: '',
      isDeleted: false,
      phoneNumber: '',
      latitude: null,
      longitude: null,
      zip: '',
      defaultLanguage: null,
      branchSmsNumber: null,
      supportedLanguages: [],
      isCompanyGeneralSetting: false,
      tags: null,
      isActive: true,
      friendlyBranchName: '',
      laviAddress: null,
      defaultPrinter: null,
    };
  }

  private GetDefaultAdditionalSettings(): IAdditionalSettings {
    return {
      hoursOfOperation: null,
      branchTimezone: null,
    };
  }

  private GetDefaultAdvancedSettings(): IAdvanceSettings {
    return {
      hoursOfOperationException: null,
      hideBranchFromScheduler: false,
      textToJoinMobileInterface: DefaultAddNewBranchValues.textToJoinMobileInterface,
      enableTextToJoin:false
    };
  }

  public GetCustomRequiredDropDownValidatorForDefaultLanguage(
    control: AbstractControl
  ) {
    if (!control.value) {
      return { required: true };
    }
    return control.value.languageCode && control.value.languageCode !== '0'
      ? null
      : { required: true };
  }

  public SetMode() {
    if (this.BranchId) {
      this.SetEditMode();
      this.InitializeEditableData();
    } else {
      this.SetAddMode();
    }
    this.SubjectIsEditMode.next(this.IsEditMode);
  }

  private SetAddMode() {
    this.IsEditMode = false;
  }

  private InitializeEditableData() {
    this.GetBranchDetails();
  }

  private SetEditMode() {
    this.IsEditMode = true;
  }

  public GetBranchDetails(): void {
    this.branchAPIService
      .Get(this.CompanyId, this.BranchId)
      .subscribe((branchData: IRequest) => {
        this.SetBranchEditDataAndBreadCrumbValue(branchData);
      });
  }

  private SetBranchEditDataAndBreadCrumbValue(branchData: IRequest) {
    if (branchData) {
      this.SetBranchEditableData(branchData);
      this.SubjectTags.next(branchData.tags ? branchData.tags : []);
      this.AddTagToSuggestionList(branchData.tags ? branchData.tags : []);
    }
  }

  private SetBranchEditableData(branchData: IRequest) {
    this.UpdateBranchFormGroupValues(
      this.GetBranchMappedResponseDataToSetInFormData(branchData)
    );

    this.SetDefaultLanguageFromSupportedLanguages(
      branchData.supportedLanguages
    );
    if (branchData.sameAsCompany) {
      this.GetCompanyGeneralSettings().subscribe((res: IRequest) => {
        if (res !== undefined && res !== null && res.laviAddress) {
          const CompanyGeneralSetting: IGeneralSettings =
            this.SetGeneralResponseData(res);
          this.SetCompanyDataInBranchGeneralSettingsForm(CompanyGeneralSetting);
          this.DisableGeneralSettingControl();
        }
      });
    }
  }

  // TODO: Remove after implementation in cosmos db
  public AddTagToSuggestionList(tags: string[]) {
    const notFoundIndex = -1;
    if (tags && this.DropdownData) {
      for (const tag of tags) {
        if (this.DropdownData.tags.indexOf(tag) === notFoundIndex) {
          this.DropdownData.tags.push(tag);
        }
      }
    }
  }

  public UpdateBranchFormGroupValues(branchInfo: IBranch) {
    this.BranchForm.get('generalSettings.address').setValue(
      branchInfo.generalSettings.address ??
        branchInfo.generalSettings.laviAddress?.formattedAddress
    );

    this.BranchForm.get('generalSettings.laviAddress').setValue(
      branchInfo.generalSettings.laviAddress
    );

    this.BranchForm.get('generalSettings.country').setValue(
      branchInfo.generalSettings.country
    );
    this.BranchForm.get('generalSettings.zip').setValue(
      branchInfo.generalSettings.zip
    );
    this.BranchForm.get('generalSettings.branchImg').setValue(
      branchInfo.generalSettings.branchImg
    );
    this.BranchForm.get('generalSettings.supportedLanguages').setValue(
      branchInfo.generalSettings.supportedLanguages
    );

    this.BranchForm.get('generalSettings.phoneNumber').setValue(
      branchInfo.generalSettings.phoneNumber
    );
    this.BranchForm.get('generalSettings.state').setValue(
      branchInfo.generalSettings.state
    );
    this.BranchForm.get('generalSettings.isActive').setValue(
      branchInfo.generalSettings.isActive
    );
    this.BranchForm.get('generalSettings.friendlyBranchName').setValue(
      branchInfo.generalSettings.friendlyBranchName
    );
    this.BranchForm.get('additionalSettings.hoursOfOperation').setValue(
      branchInfo.additionalSettings.hoursOfOperation
    );
    this.BranchForm.get('additionalSettings.branchTimezone').setValue(
      branchInfo.additionalSettings.branchTimezone
    );
    if (
      branchInfo.generalSettings.laviAddress &&
      branchInfo.additionalSettings.branchTimezone
    ) {
      this.BranchForm.get('additionalSettings.branchTimezone').disable();
    }
    this.BranchForm.get('generalSettings.branchSmsNumber').setValue(
      branchInfo.generalSettings.branchSmsNumber
    );
    this.BranchForm.get('generalSettings.isCompanyGeneralSetting').setValue(
      branchInfo.generalSettings.isCompanyGeneralSetting
    );
    this.BranchForm.get('generalSettings.id').setValue(
      branchInfo.generalSettings.id
    );
    this.BranchNameControl.clearAsyncValidators();
    this.BranchForm.get('generalSettings.name').setValue(
      branchInfo.generalSettings.name
    );
    this.BranchNameControl.setAsyncValidators(
      this.branchValidatorService.BranchNameAlreadyExistValidator(
        this.CompanyId,
        this.BranchId,
        branchInfo.generalSettings.name
      )
    );
    this.BranchForm.get('advanceSettings.hoursOfOperationException').setValue(
      branchInfo.advanceSettings.hoursOfOperationException
    );
    this.BranchForm.get('advanceSettings.hideBranchFromScheduler').setValue(
      branchInfo.advanceSettings.hideBranchFromScheduler || false
    );
    this.BranchForm.get('advanceSettings.textToJoinMobileInterface').setValue(
      branchInfo.advanceSettings.textToJoinMobileInterface
    );
    this.BranchForm.get('advanceSettings.enableTextToJoin').setValue(
      branchInfo.advanceSettings.enableTextToJoin || false
    );

    this.BranchForm.get('advanceSettings.overridetwilioServiceId').setValue(
      branchInfo.advanceSettings.overridetwilioServiceId || ""
    );
    this.BranchForm.get('generalSettings.isCompanyGeneralSetting').value
      ? this.DisableGeneralSettingControl()
      : '';
      this.BranchForm.get('generalSettings.defaultPrinter').setValue(
        branchInfo.generalSettings.defaultPrinter
      );
  }

  private GetBranchMappedResponseDataToSetInFormData(res: any): IBranch {
    const branchDetails: IBranch = {
      generalSettings:
        this.GetGeneralSettingshMappedResponseDataToSetInFormData(res),
      additionalSettings: {
        hoursOfOperation:
          res.additionalSettings === null
            ? null
            : this.GetHoursOfOperationObj(
                res.additionalSettings.hoursOfOperationId
              ),
        branchTimezone: res.additionalSettings
          ? this.GetTimeZoneObj(res.additionalSettings?.timeZone?.id)
          : null,
      },
      advanceSettings: {
        hoursOfOperationException: this.GetExceptionHoursOfOperationObj(
          res.advanceSettings
            ? res.advanceSettings.hoursOfOperationExceptionId
            : null
        ), // do later
        hideBranchFromScheduler:
          res.advanceSettings.hideBranchFromScheduler || false,
        textToJoinMobileInterface: this.GetMobileInterfaceObj(
          res.advanceSettings
            ? res.advanceSettings.textToJoinMobileInterfaceId
            : null
        ),
        enableTextToJoin:res.advanceSettings?.enableTextToJoin || false,
        overridetwilioServiceId:res.advanceSettings?.overridetwilioServiceId || "",
      },
      kiosks: res.kiosks,
      monitors: res.monitors,
    };
    this.mobileInterfaceId = res.advanceSettings.textToJoinMobileInterfaceId;
    return branchDetails;
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

  public SetDefaultLanguageFromSupportedLanguages(
    dropdownData: ILanguageDropdownList[]
  ) {
    this.DefaultLanguageControl.setValue(null);
    dropdownData.forEach((x) => {
      if (x.isDefault) {
        const defaultLanguage = {
          language: x.language,
          languageCode: x.languageCode,
        };
        this.BranchForm.get('generalSettings.defaultLanguage').setValue(
          defaultLanguage
        );
        this.DefaultLanguage = defaultLanguage;
      }
    });
    this.SubjectDefaultLanguageList.next(dropdownData);
  }

  private GetGeneralSettingshMappedResponseDataToSetInFormData(
    branch: IRequest
  ) {
    return {
      id: branch.externalBranchId,
      branchId: this.SetDefaultValueToNullIfUndefined(branch.branchId),
      name: this.SetDefaultValueToNullIfUndefined(branch.branchName),
      branchImg: this.SetDefaultValueToNullIfUndefined(branch?.logoUrlPath),
      address: this.SetDefaultValueToNullIfUndefined(branch.address),
      country: this.GetCountryObj(branch.countryCode)
        ? this.GetCountryObj(branch.countryCode)
        : DefaultAddNewBranchValues.CountryListDefaultValue,
      state: null,
      latitude: branch.latitude,
      longitude: branch.longitude,
      city: null,
      zip: this.SetDefaultValueToNullIfUndefined(branch.zip),
      phoneNumber: this.SetDefaultValueToNullIfUndefined(branch.phoneNumber),
      supportedLanguages: this.SetDefaultValueToNullIfUndefined(
        branch.supportedLanguages
      ),
      isCompanyGeneralSetting: branch.sameAsCompany,
      tags: branch.tags,
      friendlyBranchName: this.SetDefaultValueToNullIfUndefined(
        branch.friendlyBranchName
      ),
      isActive: branch.isActive,
      isDeleted: false,
      branchSmsNumber:
        branch.smsPhoneNumber === null
          ? null
          : {
              value: branch.smsPhoneNumber.id,
              text: branch.smsPhoneNumber.phoneNumber,
            },
      laviAddress: branch.laviAddress,
      defaultPrinter: this.GetLocationPrinterObj(branch.defaultPrinterId),
    };
  }



  private SetDefaultValueToNullIfUndefined(value) {
    return value === undefined ? (value = null) : value;
  }

  public InitializeTemplateForm() {
    this.SetTemplateForm(this.GetInitialTemplateData());
  }

  private SetTemplateForm(templateDetails: ITemplate) {
    this.TemplateForm = this.formBuilder.group({
      title: [templateDetails.title, Validators.required],
      name: [
        templateDetails.name,
        CustomRequiredDropDownValidator('templateId'),
      ],
      deviceId: [
        templateDetails.deviceId,
        [],
        this.deviceIdValidator(templateDetails.deviceId),
      ],
      id: [templateDetails.id],
      browserId: [],
      language: [templateDetails.languageCode],
      mobileInterface: [templateDetails.mobileInterface],
      assignedPrinter:[templateDetails.assignedPrinter]
    });
    this.TemplateForm.controls.deviceId.statusChanges.subscribe((x) => {
      this.changeDetectorRef.detectChanges();
    });
  }

  private deviceIdValidator(editValue: string = ''): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<{ [key: string]: any } | null>
      | Observable<{ [key: string]: any } | null> => {
      if (
        this.isEmptyInputValue(control.value) ||
        control.value.trim() === editValue
      ) {
        return of(null);
      }

      return control.valueChanges.pipe(
        debounceTime(500),
        take(1),
        switchMap((_) =>
          this.IsDeviceIdExists(control.value).pipe(
            map((device) => {
              if (device) {
                this.browserIdFormControl.setValue(device.browserId);
                this.LinkDeviceForm.get('browserId').setValue(device.browserId);
                return null;
              } else {
                return { isExists: true };
              }
            })
          )
        )
      );
    };
  }

  private isEmptyInputValue(value: any): boolean {
    return value === null || value === undefined || value === '';
  }

  public IsDeviceIdExists(value: string): Observable<any> {
    return this.branchAPIService.DeviceExists(
      this.CompanyId,
      this.BranchId,
      value
    );
  }

  public GetInitialTemplateData(): ITemplate {
    return {
      id: '',
      title: '',
      name: null,
      deviceId: null,
      status: 3,
      browserId: '',
      languageCode: null,
      mobileInterface: null,
      assignedPrinter:undefined
    };
  }

  public UpdateTemplateFormData(data: ITemplate) {
    this.TemplateForm.get('title').setValue(data.title);
    this.TemplateForm.get('name').setValue(data.name);
    this.TemplateForm.get('deviceId').setValue(data.deviceId);
    this.TemplateForm.get('id').setValue(data.id);
    this.TemplateForm.get('browserId').setValue(data.browserId);
    this.TemplateForm.get('language').setValue(
      this.GetLanguageObj(
        data.languageCode ? data.languageCode : data.defaultLanguageCode
      )
    );
    this.TemplateForm.get('mobileInterface').setValue(data.mobileInterface);
    // this.TemplateForm.get('assignedPrinter').setValue(data.assignedPrinter);
  }

  public InitializeMobileForm() {
    this.SetMobileForm(this.SetInitialMobileData());
  }

  public SetMobileForm(mobTemplateDetails: IMobileInterface) {
    this.MobileForm = this.formBuilder.group({
      title: [mobTemplateDetails.title, Validators.required],
      name: [
        mobTemplateDetails.name,
        CustomRequiredDropDownValidator('templateId'),
      ],
      smsInterfaceKey: [mobTemplateDetails.smsInterfaceKey],
      id: [mobTemplateDetails.id],
      isEnableText: [mobTemplateDetails.isEnableText],
    });
  }

  public SetInitialMobileData(): IMobileInterface {
    return {
      id: '',
      title: '',
      name: null,
      smsInterfaceKey: '',
      isEnableText: false,
    };
  }

  public UpdateMobileFormData(data: IMobileInterface) {
    this.MobileForm.get('title').setValue(data.title);
    this.MobileForm.get('name').setValue(data.name);
    this.MobileForm.get('smsInterfaceKey').setValue(data.smsInterfaceKey);
    this.MobileForm.get('id').setValue(data.id);
    this.MobileForm.get('isEnableText').setValue(
      data ? data.isEnableText : false
    );
  }

  public InitializeLinkDeviceForm() {
    this.LinkDeviceForm = this.formBuilder.group({
      id: [''],
      deviceId: ['', Validators.required, this.deviceIdValidator()],
      browserId: [],
    });

    this.subs.sink =
      this.LinkDeviceForm.controls.deviceId.statusChanges.subscribe(() => {
        this.changeDetectorRef.detectChanges();
      });
  }

  get LinkDeviceIdFormControl() {
    return this.LinkDeviceForm.controls.deviceId;
  }

  public InitializeMessageForm() {
    this.MessageForm = this.formBuilder.group({
      message: [null, Validators.required],
      browserId: [],
      branchId: [],
      kioskId: [],
    });
  }

  public InitializeDeskForm() {
    this.DeskForm = this.formBuilder.group({
      text: ['', Validators.required],
      value: [''],
    });
  }

  public DeskDeskFormData(data: IDropdownList) {
    this.DeskForm.get('text').setValue(data.text);
    this.DeskForm.get('value').setValue(data.value);
  }

  public InitializeLiveForm() {
    this.LiveForm = this.formBuilder.group({
      shutDownTime: [1],
      shutDownTimeInterval: [
        DefaultAddNewBranchValues.ShutDownTimeIntervalValue,
      ],
      message: ['', [Validators.required]],
    });
  }

  public InitializeWorkflowUsedInBranchForm() {
    this.WorkflowUsedInBranchForm = this.formBuilder.group({
      id: '',
      workFlow: [null, [CustomRequiredDropDownValidator('workFlowId')]],
      services: [null, [Validators.required]],
      isAllServices: [false],
    });

    this.subs.sink =
      this.WorkflowUsedInBranchForm?.controls.workFlow?.valueChanges?.subscribe(
        (x) => {
          if (x && x.workFlowId) {
            const workflowInUse = this.CheckWorkflowIsInUse(x.workFlowId);
            if (
              workflowInUse.byKiosk ||
              workflowInUse.byMobileInterface ||
              workflowInUse.byMonitor
            ) {
              if (
                this.WorkflowUsedInBranchForm.controls.workFlow.status !=
                  'DISABLED' &&
                this.IsWorkflowEditMode
              ) {
                this.WorkflowUsedInBranchForm.controls.workFlow.disable();
              }
            } else {
              if (
                this.WorkflowUsedInBranchForm.controls.workFlow.status ==
                'DISABLED'
              ) {
                this.WorkflowUsedInBranchForm.controls.workFlow.enable();
              }
            }
          } else {
            if (
              this.WorkflowUsedInBranchForm.controls.workFlow.status ==
              'DISABLED'
            ) {
              this.WorkflowUsedInBranchForm.controls.workFlow.enable();
            }
          }
        }
      );
  }

  public OpenWorkFlowUsedInBranchModal(openModal: boolean) {
    this.SubjectOpenWorkFlowUsedInBranchDialog.next(openModal);
  }



  public SetWorkflowUsedInBranchForm(
    workFlowUsedInBranch: IWorkFlowUsedInBranchList
  ) {
    this.WorkflowUsedInBranchForm.setValue({
      id: workFlowUsedInBranch?.id,
      workFlow: this.GetWorkFlowObj(workFlowUsedInBranch?.workFlowId),
      services: this.GetServicesObj(workFlowUsedInBranch?.serviceIds),
      isAllServices: workFlowUsedInBranch?.isAllServices,
    });
  }

  GetWorkFlowObj(workFlowId: string) {
    const workflow =
      workFlowId && this.SubjectWorkflows.value
        ? this.SubjectWorkflows.value.find((x) => x.workFlowId === workFlowId)
        : null;
    return workflow;
  }

  GetMobileInterfaceObj(mobileInterfaceId: string): ILayoutTemplate {
    if (mobileInterfaceId && this.SubjectMobileInterfaceList.value) {
      let mobileInterface = this.SubjectMobileInterfaceList.value.find(
        (x) => x.id === mobileInterfaceId
      );
      if (!mobileInterface) {
        return null;
      }
      return {
        templateId: mobileInterface.id,
        templateName: mobileInterface.name.templateName,
      };
    }
    return null;
  }

  GetServicesObj(serviceIds: string[]) {
    let services = [];
    if (serviceIds && serviceIds.length > 0) {
      services = this.SubjectServices.value.filter((x) =>
        serviceIds.includes(x.id)
      );
    }
    return services;
  }

  GetLocationPrinterObj(printerId: string): PrinterTemplate {
    const locationPrinter = this.SubjectLocationPrinters.value?.find(printer=> printer.printerId === printerId);
    if(!locationPrinter) {
      return null;
    }
    return locationPrinter;
  }

  GetKioskPrinterObj(printerId: string): PrinterTemplate {

    const kioskPrinter = this.SubjectKioskPrinters.value?.find(printer=> printer.printerId === printerId);
    if(!kioskPrinter) {
      return null;
    }
    return kioskPrinter;
  }

  public CallMultipleApi(): any {
    this.formService
      .CombineAPICall(...this.GetMultipleAPIs())
      .subscribe(
        ([
          countryList,
          languageList,
          hoursOfOperations,
          branchTimeZones,
          numbersList,
          timeIntervalList,
          phoneNumbersList,
          tags,
          locationPrinters,
          // kioskPrinters,
          exceptionHoursOfOperations,
        ]) => {
          this.DropdownData = this.GetMappedBranchDropDownList(
            countryList,
            languageList,
            hoursOfOperations.filter((x) => !x.isExceptionTemplate),
            branchTimeZones,
            numbersList,
            timeIntervalList,
            phoneNumbersList,
            tags,
            (exceptionHoursOfOperations = hoursOfOperations.filter(
              (x) => x.isExceptionTemplate
            )),
            locationPrinters?.printerTemplate
          );
          this.SubjectLocationPrinters.next(locationPrinters?.printerTemplate);
          // this.SubjectKioskPrinters.next(kioskPrinters?.printerTemplate);
          if (!this.IsEditMode) {
            this.SupportedLanguageControl.setValue([
              this.DropdownData.languages[0],
            ]);
            this.SetDefaultLanguageFromSupportedLanguages([
              this.DropdownData.languages[0],
            ]);
          }
          this.SubjectNewBranchDropdownListData.next(this.DropdownData);
          this.SetMode();
        }
      );
  }

  /* #endregion */

  /* #region  Dropdowns */

  public GetMultipleAPIs(): Observable<any>[] {
    return [
      this.GetCountryList(),
      this.GetLanguageList(),
      this.SetHoursOfOperationList(),
      this.GetBranchTimeZoneList(),
      this.GetNumbersList(),
      this.GetTimeIntervalList(),
      this.GetPhoneNumberList(),
      this.GetTags(),
      this.GetLocationPrinters(),
      // this.GeKioskPrinters()
    ];
  }

  private GetMappedBranchDropDownList(
    countryList,
    languageList,
    hoursOfOperations,
    branchTimeZones,
    numbersList,
    timeIntervalList,
    phoneNumbersList,
    tags,
    exceptionHoursOfOperations,
    locationPrinters
  ): INewBranchDropdownList {
    return {
      countries: countryList,
      languages: languageList,
      hoursOfOperation: hoursOfOperations,
      branchTimeZone: branchTimeZones,
      numberList: numbersList,
      timeIntervals: timeIntervalList,
      phoneNumberList: phoneNumbersList,
      tags,
      exceptionHoursOfOperations,
      locationPrinters
    };
  }

  // Start of dropdown binding code
  private GetCountryList(): Observable<ICountryDropdownList[]> {
    return this.locationAPIService.GetCountries();
  }

  private GetLanguageList(): Observable<ILanguageDropdownList[]> {
    return this.companyAPIService.GetLanguages<ILanguageDropdownList>(
      this.CompanyId
    );
  }

  public SetKioskTemplate(template: ITemplate) {
    const workflowIds: string[] = this.GetSelectedWorkflowIds();
    this.SetKioskPrintersToSubject(template);
    this.subs.sink = this.kioskAPIService
      .GetDropdownList(this.CompanyId)
      .subscribe((x: ILayoutTemplate[]) => {
        this.SubjectKioskLayoutTemplate.next(cloneObject(x));
        this.SubjectKioskLayoutTemplate.next(
          this.SubjectKioskLayoutTemplate.value.filter((x) =>
            workflowIds.includes(x.workFlowId)
          )
        );

        if (template) {
          this.GetMobileInterfaceByKioskWorkflowId(template?.name?.workFlowId);
          this.TemplateForm.get('id').setValue(template.id);
          this.UpdateTemplateFormData(template);
          this.DisableEnableDeviceIdControl();
          this.GetWorkflowName(template?.name?.workFlowId);
        }
      });
  }

  private GetKioskTemplateName(templateId: string): string {
    return this.SubjectKioskLayoutTemplate.value.length > 0
      ? this.SubjectKioskLayoutTemplate.value.find(
          (x) => x.templateId === templateId
        )?.templateName
      : '';
  }

  private GetMonitorTemplateName(templateId: string): string {
    return this.SubjectMonitorLayoutTemplate.value.length > 0
      ? this.SubjectMonitorLayoutTemplate.value.find(
          (x) => x.templateId === templateId
        )?.templateName
      : '';
  }

  private GetKioskTemplate() {
    this.subs.sink = this.kioskAPIService
      .GetDropdownList(this.CompanyId)
      .subscribe((x: ILayoutTemplate[]) => {
        this.SubjectKioskLayoutTemplate.next(cloneObject(x));
      });
  }

  public SetMonitorTemplate(template: ITemplate) {
    const workflowIds: string[] =
      this.SubjectWorkFlowUsedInBranchList.value.map((x) => x.workFlowId);
    this.subs.sink = this.monitorAPIService
      .GetDropdownList(this.CompanyId)
      .subscribe((monitor: ILayoutTemplate[]) => {
        this.SubjectMonitorLayoutTemplate.next(monitor);
        this.SubjectMonitorLayoutTemplate.next(
          this.SubjectMonitorLayoutTemplate.value.filter((x) =>
            workflowIds.includes(x.workFlowId)
          )
        );
        if (template) {
          this.TemplateForm.get('id').setValue(template.id);
          this.UpdateTemplateFormData(template);
          this.DisableEnableDeviceIdControl();
          this.GetWorkflowName(template?.name?.workFlowId);
        }
      });
  }

  private DisableEnableDeviceIdControl() {
    if (this.browserIdFormControl.value) {
      this.deviceIdFormControl.disable();
    } else {
      this.deviceIdFormControl.enable();
    }
  }

  private GetMonitorTemplate() {
    this.subs.sink = this.monitorAPIService
      .GetDropdownList(this.CompanyId)
      .subscribe((monitor: ILayoutTemplate[]) => {
        this.SubjectMonitorLayoutTemplate.next(monitor);
      });
  }

  public SetLocationPrintersToSubject() {
    this.subs.sink = this.GetLocationPrinters()
      .subscribe((x: any) => {
        this.SubjectLocationPrinters.next(x?.printerTemplate);
      });
  }

  public SetKioskPrintersToSubject(template: ITemplate) {
    if(template){
      this.subs.sink = this.GeKioskPrinters(template.id)
      .subscribe((x: any) => {
        this.SubjectKioskPrinters.next(x?.printerTemplate);
        this.TemplateForm.get('assignedPrinter').setValue(this.GetKioskPrinterObj(template?.assignedPrinterId));
      });
    }
  }

  public GetMobileInterfaceTemplate() {
    this.subs.sink = this.mobileAPIService
      .GetDropdownList(this.CompanyId)
      .subscribe((x: ILayoutTemplate[]) => {
        this.SubjectMobileInterfaceLayoutTemplate.next(x);
      });
  }

  public SetMobileInterfaceTemplate(template: IMobileInterface) {
    const workflowIds: string[] =
      this.SubjectWorkFlowUsedInBranchList.value.map((x) => x.workFlowId);
    this.subs.sink = this.mobileAPIService
      .GetDropdownList(this.CompanyId)
      .subscribe((x: ILayoutTemplate[]) => {
        this.SubjectMobileInterfaceLayoutTemplate.next(x);
        this.SubjectMobileInterfaceLayoutTemplate.next(
          this.SubjectMobileInterfaceLayoutTemplate.value.filter((x) =>
            workflowIds.includes(x.workFlowId)
          )
        );
        if (template) {
          this.MobileForm.get('id').setValue(template.id);
          this.UpdateMobileFormData(template);
          this.GetWorkflowName(template?.name?.workFlowId);
          this.DisableTextBox();
        } else {
          this.DisableTextBox();
        }
      });
  }

  public SetHoursOfOperationList(): Observable<IHoursOfOperationDropdown[]> {
    return this.hoursOfOperationAPIService.GetDropdownList(this.CompanyId);
  }

  public GetBranchTimeZoneList(): Observable<IDropdownList[]> {
    const branchTimeZone: IDropdownList[] = [];

    const timeZones = timezoneNames();
    for (const i in timeZones) {
      const tz = { value: timeZones[i], text: timeZones[i] };
      branchTimeZone.push(tz);
    }

    return of(branchTimeZone);
  }

  public GetTimeIntervalList(): Observable<IDropdownList[]> {
    return of([
      { value: 'HR', text: 'Hours' },
      { value: 'MIN', text: 'Minutes' },
    ]);
  }

  private GetNumbersList(): Observable<number[]> {
    const numbersList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return of(numbersList);
  }

  public GetLocationPrinters(): Observable<any> {

    return this.branchAPIService.GetPrinters(this.CompanyId, this.BranchId, 'Branch_Printers');
  }

  public GeKioskPrinters(kioskId: string): Observable<any> {

    return this.branchAPIService.GetKioskPrinters(this.CompanyId, this.BranchId, kioskId)
  }

  PhoneNumberModelToDropdown(model: IPhoneNumber[]): IDropdownList[] {
    if (model && model.length > 0) {
      return model.map((x) => {
        return {
          text: this.FormatNumberText(x),
          value: this.FormatNumberId(x),
        };
      });
    } else {
      return [];
    }
  }

  FormatNumberId(number: IPhoneNumber) {
    return number.phone_number;
  }

  FormatNumberText(number: IPhoneNumber) {
    return number.phone_number.split('+1').pop();
  }

  private GetPhoneNumberList(): Observable<IDropdownList[]> {
    return this.messagingAPIService
      .GetAvailableNumbersForBranch(this.CompanyId, this.BranchId)
      .pipe(
        map((numbers: IPhoneNumber[]) =>
          this.PhoneNumberModelToDropdown(numbers)
        )
      );
  }

  private GetTags(): Observable<string[]> {
    return this.branchAPIService.GetTags(this.CompanyId);
  }

  private GetSelectedWorkflowIds() {
    return this.SubjectWorkFlowUsedInBranchList.value.map((x) => x.workFlowId);
  }

  public BindState(countryId: string, fn: Function): void {
    this.ResetCountryRelatedData(countryId);
    this.SetStateDropdownData(countryId, fn);
  }

  BindCity(locationDetail: any, fn?: Function) {
    this.ResetZipCity();
    this.SetCityDropDownData(locationDetail, fn);
  }

  SetCityDropDownData(locationDetail: any, fn: Function) {
    const cities = this.WorldCityList.filter(
      (x) =>
        x.iso3 == locationDetail.countryCode &&
        x.province == locationDetail.state
    )?.map((x) => {
      return {
        cityCode: x?.city,
        city: x?.city,
        timeZone: x?.timezone,
        lat: x?.lat,
        lng: x?.lng,
      };
    });
    this.SubjectCities.next(cities);
    if (fn) {
      fn();
    }
  }

  private SetStateDropdownData(countryId: string, fn: any) {
    this.locationAPIService
      .GetStates(countryId)
      .subscribe((stateDropDownList) => {
        this.States = stateDropDownList;
        this.SubjectStates.next(stateDropDownList);
        this.SubjectCities.next([]);
        if (fn) {
          fn();
        }
      });
  }

  GetWorkflowName(templateId: string) {
    this.SubjectWorkflowName.next(
      templateId ? this.GetWorkFlowObj(templateId).name : null
    );
  }

  GetMobileInterfaceByKioskWorkflowId(workflowId: string) {
    this.TemplateForm.get('mobileInterface').setValue(null);
    this.SubjectMobileInterfacesByKioskWorkflowId.next(
      workflowId && this.SubjectMobileInterfaceLayoutTemplate.value
        ? this.SubjectMobileInterfaceLayoutTemplate.value.filter(
            (x) => x.workFlowId === workflowId
          )
        : []
    );
  }

  // End of dropdown binding code

  public SetWorkFlowDropdownList() {
    this.workflowAPIService
      .GetDropdownList(this.authService.CompanyId)
      .subscribe((workflow: IWorkFlowDropdown[]) => {
        this.SubjectWorkflows.next(workflow);
      });
  }

  public SetServices(workflowId: string) {
    this.ServicesControl.setValue(null);
    if (workflowId) {
      const services = this.GetServices(workflowId);
      this.SubjectServices.next(services);
    } else {
      this.SubjectServices.next(null);
    }
  }

  public GetServices(workflowId: string) {
    const workflowServices: IServiceDropdown[] = [];
    const services: any = this.SubjectWorkflows.value.find(
      (x) => x.workFlowId === workflowId
    )?.services;
    if (services) {
      for (const service of services) {
        workflowServices.push({
          id: service.id,
          serviceName: service.serviceNames.find((x) => x.isDefault)
            .serviceName,
        });
      }
    }
    return workflowServices;
  }

  // End of dropdown binding code

  private ResetCountryRelatedData(countryId: string) {
    if (countryId === '0') {
      this.BranchForm.get('generalSettings.country').setValue(null);
    }
    this.BranchForm.get('generalSettings.state').setValue(null);
    this.ResetZipCity();
  }

  public ResetZipCity() {
    if (this.BranchForm.get('generalSettings.state').value === '0') {
      this.BranchForm.get('generalSettings.state').setValue(
        DefaultAddNewBranchValues.StateListDefaultValue
      );
    }
    this.BranchForm.get('generalSettings.city').setValue(
      DefaultAddNewBranchValues.CityListDefaultValue
    );
    this.ResetZip();
  }

  ResetZip() {
    const city = this.BranchForm.get('generalSettings.city').value;
    this.BranchForm.get('additionalSettings.branchTimezone').enable();
    this.BranchForm.get('additionalSettings.branchTimezone').setValue(
      this.GetTimeZoneObj(city?.timeZone)
    );
    if (city?.cityCode != null) {
      this.BranchForm.get('additionalSettings.branchTimezone').disable();
    }
    this.BranchForm.get('generalSettings.zip').setValue('');
  }
  public GetHoursOfOperationObj(id: string) {
    return this.DropdownData === undefined
      ? null
      : this.DropdownData.hoursOfOperation.find((x) => x.id === id);
  }

  public GetTimeZoneObj(id: string) {
    return this.DropdownData === undefined
      ? null
      : this.DropdownData.branchTimeZone.find((x) => x.value === id);
  }

  public GetExceptionHoursOfOperationObj(id: string) {
    return this.DropdownData === undefined
      ? null
      : this.DropdownData.exceptionHoursOfOperations.find((x) => x.id === id);
  }

  /* #region  Same as company general settings */

  public GetCompanyGeneralSettingsInfo(isGeneralCompanyDetails: boolean) {
    this.loadingService.showLoading();
    setTimeout(() => {
      if (isGeneralCompanyDetails) {
        this.GetCompanyGeneralSettings().subscribe((res: IRequest) => {
          if (res !== undefined && res !== null && res.laviAddress) {
            const CompanyGeneralSetting: IGeneralSettings =
              this.SetGeneralResponseData(res);
            this.SetCompanyDataInBranchGeneralSettingsForm(
              CompanyGeneralSetting
            );
            this.DisableGeneralSettingControl();
          }
        });
      } else {
        this.EnableGeneralSettingControl();
        this.BranchForm.get('generalSettings.address').setValue('');
        this.BranchForm.get('generalSettings.country').setValue(null);
        this.BranchForm.get('generalSettings.zip').setValue('');
        this.BranchForm.get('generalSettings.supportedLanguages').setValue('');
        this.BranchForm.get('generalSettings.branchImg').setValue('');
        this.BranchForm.get('generalSettings.defaultLanguage').setValue(null);
        this.SubjectDefaultLanguageList.next(null);
        this.BranchForm.get('generalSettings.city').setValue(
          DefaultAddNewBranchValues.CityListDefaultValue
        );
        this.BranchForm.get('generalSettings.phoneNumber').setValue('');
        this.BranchForm.get('generalSettings.state').setValue(
          DefaultAddNewBranchValues.StateListDefaultValue
        );
      }
      this.loadingService.hideLoading();
    }, 2000);
  }

  private GetCompanyGeneralSettings() {
    return this.companyAPIService.Get(this.CompanyId);
  }

  private SetCompanyDataInBranchGeneralSettingsForm(
    CompanyGeneralSetting: IGeneralSettings
  ) {
    this.BranchForm.get('generalSettings.address').setValue(
      CompanyGeneralSetting.address
    );
    this.BranchForm.get('generalSettings.laviAddress').setValue(
      CompanyGeneralSetting.laviAddress
    );
    this.BranchForm.get('generalSettings.country').setValue(
      CompanyGeneralSetting.country
    );
    this.BranchForm.get('generalSettings.state').setValue(
      CompanyGeneralSetting.state
    );

    this.BranchForm.get('generalSettings.zip').setValue(
      CompanyGeneralSetting.zip
    );
    CompanyGeneralSetting.branchImg === null
      ? this.BranchForm.get('generalSettings.branchImg').setValue('')
      : this.BranchForm.get('generalSettings.branchImg').setValue(
          CompanyGeneralSetting.branchImg
        );
    this.BranchForm.get('generalSettings.supportedLanguages').setValue(
      CompanyGeneralSetting.supportedLanguages
    );
    this.DefaultLanguageControl.setValue(CompanyGeneralSetting.defaultLanguage);

    this.BranchForm.get('additionalSettings.branchTimezone').setValue(
      CompanyGeneralSetting?.laviAddress
        ? this.GetTimeZoneObj(CompanyGeneralSetting.laviAddress.timeZoneId)
        : DefaultAddNewBranchValues.BranchTimezoneValue
    );
    if (CompanyGeneralSetting?.laviAddress) {
      this.BranchForm.get('additionalSettings.branchTimezone').disable();
    }
    this.BranchForm.get('generalSettings.phoneNumber').setValue(
      CompanyGeneralSetting.phoneNumber
    );
  }

  public SetGeneralResponseData(res: IRequest) {
    const branchDetails: any = {
      branchImg: this.SetDefaultValueToNullIfUndefined(res?.logoUrlPath),
      address: this.SetDefaultValueToNullIfUndefined(res.address),
      laviAddress: this.SetDefaultValueToNullIfUndefined(res.laviAddress),
      country: this.SetDefaultValueToNullIfUndefined(
        this.GetCountryObj(res.countryCode)
      ),
      state: this.SetDefaultValueToNullIfUndefined(null),
      city: null,
      zip: this.SetDefaultValueToNullIfUndefined(res.zip),
      phoneNumber: this.SetDefaultValueToNullIfUndefined(res.phoneNumber),
      supportedLanguages: this.SetDefaultValueToNullIfUndefined(
        res.supportedLanguages
      ),
      defaultLanguage: res.defaultLanguage,
      tags: res.tags,
      isActive: res.isActive,
    };
    return branchDetails;
  }

  public DisableGeneralSettingControl() {
    this.BranchForm.get('generalSettings.address').disable();
    this.BranchForm.get('generalSettings.country').disable();
    this.BranchForm.get('generalSettings.zip').disable();
    this.BranchForm.get('generalSettings.supportedLanguages').disable();
    this.BranchForm.get('generalSettings.branchImg').disable();
    this.BranchForm.get('generalSettings.defaultLanguage').disable();
    this.BranchForm.get('generalSettings.city').disable();
    this.BranchForm.get('generalSettings.phoneNumber').disable();
    this.BranchForm.get('generalSettings.state').disable();
  }

  public EnableGeneralSettingControl() {
    this.BranchForm.get('generalSettings.address').enable();
    this.BranchForm.get('generalSettings.country').enable();
    this.BranchForm.get('generalSettings.zip').enable();
    this.BranchForm.get('generalSettings.branchImg').enable();
    this.BranchForm.get('generalSettings.supportedLanguages').enable();
    this.BranchForm.get('generalSettings.defaultLanguage').enable();
    this.BranchForm.get('generalSettings.city').enable();
    this.BranchForm.get('generalSettings.phoneNumber').enable();
    this.BranchForm.get('generalSettings.state').enable();
  }
  /* #endregion */


  /* #region  Save & Update Branch */

  public SaveOrUpdateBranch(req: FormGroup) {
    if (!this.IsEditMode) {
      this.Save(req);
    } else {
      this.Update(req);
    }
  }

  public DisableServiceDropDown() {
    const isAllServices =
      this.WorkflowUsedInBranchForm.get('isAllServices').value;
    if (isAllServices) {
      this.ServicesControl.setValue(null);
      this.ServicesControl.disable();
    } else {
      this.ServicesControl.enable();
    }
  }

  private Update(req: FormGroup) {
    this.formService.CallFormMethod<IBranch>(req).then((response) => {
      this.AfterUpdateSuccessful(response);
    });
  }

  private AfterUpdateSuccessful(response: IBranch) {
  response.contactPerson = this.ContactListSubject.value
        const branchImg: any = response.generalSettings.branchImg;
    if (branchImg) {
      if (branchImg.name !== undefined) {
        this.formService.GetImageUrl(branchImg).subscribe((x) => {
          this.ImageUrl = x;
          this.PutBranchDetails(response);
        });
      } else {
        this.ImageUrl = branchImg;
        this.PutBranchDetails(response);
      }
    } else {
      this.PutBranchDetails(response);
    }
  }

  private Save(req: FormGroup) {
    this.formService.CallFormMethod<IBranch>(req).then((response) => {
      this.AfterSaveSuccessful(response);
    });
  }

  private AfterSaveSuccessful(response: IBranch) {
    response.contactPerson = this.ContactListSubject.value
    const branchImg: any = response.generalSettings.branchImg;
    if (branchImg) {
      if (branchImg.name !== undefined) {
        this.formService.GetImageUrl(branchImg).subscribe((x) => {
          this.ImageUrl = x;
          this.PostBranchDetails(response);
        });
      } else {
        this.ImageUrl = branchImg;
        this.PostBranchDetails(response);
      }
    } else {
      this.PostBranchDetails(response);
    }
  }

  private updateSMSNumberIfNull(response: IBranch) {
    if (
      !(
        response.generalSettings.branchSmsNumber &&
        response.generalSettings.branchSmsNumber.value
      )
    ) {
      response.generalSettings.branchSmsNumber = null;
    }
  }

  private PutBranchDetails(response: IBranch) {
    this.updateSMSNumberIfNull(response);
    const data = this.GetResponseData(response);
    this.branchAPIService.Update(this.CompanyId, data).subscribe((result) => {
      if (result) {
        this.AppNotificationService.Notify('Branch updated.');
        this.routeHandlerService.RedirectToBranchList();
      } else {
        this.AppNotificationService.NotifyError('Something went wrong.');
      }
    });
  }

  private PostBranchDetails(response: IBranch) {
    this.updateSMSNumberIfNull(response);
    const data = this.GetResponseData(response);
    this.branchAPIService
      .Create(this.CompanyId, data)
      .subscribe((result: any) => {
        if (result) {
          this.browserStorageService.SetBranchId(result.branchId); // TODO: need to remove after list creation
          this.AppNotificationService.Notify('Branch created.');
          this.routeHandlerService.RedirectToBranchList();
        } else {
          this.AppNotificationService.NotifyError('Something went wrong.');
        }
      });
  }

  /* #endregion */

  /* #region  Kiosk */

  public SetKioskList() {
    this.branchAPIService
      .GetKiosks(this.CompanyId, this.BranchId)
      .subscribe((result) => {
        if (result) {
          this.SubjectKioskList.next(this.GetKioskUpdatedList(result));
        }
      });
  }

  public GetKioskUpdatedList(res) {
    const kioskList = [];
    for (let i = 0; i <= res.length - 1; i++) {
      const workflow = this.GetWorkFlowObj(res[i].layoutTemplate.workFlowId);
      res[i].layoutTemplate.workFlowName = workflow ? workflow.name : '';
      res[i].layoutTemplate.templateName = this.GetKioskTemplateName(
        res[i].layoutTemplate.templateId
      );
      res[i].mobileInterface = this.GetMobileInterfaceObj(
        res[i].mobileInterfaceId
      );
      const template: ITemplate = {
        title: res[i]?.title,
        status: res[i]?.status,
        name: res[i]?.layoutTemplate,
        id: res[i]?.id,
        deviceId: res[i]?.device?.deviceId,
        deviceName: res[i]?.device?.deviceName,
        browserId: res[i]?.device?.browserId,
        mobileInterface: res[i]?.mobileInterface,
        assignedPrinter: this.GetKioskPrinterObj(res[i]?.assignedPrinterId),
        assignedPrinterId: res[i]?.assignedPrinterId,
      };
      kioskList.push(template);
    }
    this.TemplateDetails.kioskList = kioskList;
    return kioskList;
  }

  public AddKiosk(req: FormGroup) {
    this.formService.CallFormMethod<ITemplate>(req).then((res) => {
      const request = this.GetKioskResponseData(res, false);
      this.branchAPIService
        .CreateKiosk(this.CompanyId, request.branchId, request)
        .subscribe((result) => {
          if (result) {
            this.SetKioskList();
          }
        });
    });
  }

  ResetWorkFlowName() {
    this.SubjectWorkflowName.next(null);
  }

  ResetMobileInterfacesOfKiosk() {
    this.SubjectMobileInterfacesByKioskWorkflowId.next([]);
  }

  public UpdateKioskData(req: FormGroup) {
    this.formService.CallFormMethod<ITemplate>(req).then((response) => {
      const data = this.GetKioskResponseData(response, true);
      this.branchAPIService
        .UpdateKiosk(this.CompanyId, data.branchId, data)
        .subscribe((x: IRequest) => {
          this.SetKioskList();
        });
    });
  }

  public DeleteKiosk(id: string) {
    this.branchAPIService
      .DeleteKiosk(this.CompanyId, this.BranchId, id)
      .subscribe((x: IRequest) => {
        this.SetKioskList();
      });
  }

  public GetKioskResponseData(res: ITemplate, isEdit: boolean) {
    const data: IKioskList = {
      branchId: this.BranchId,
      id: isEdit ? res.id : this.uuid,
      title: res.title,
      isDeleted: false,
      status: this.GetKioskStatus(isEdit, res),
      layoutTemplate: res.name,
      mobileInterfaceId: res.mobileInterface
        ? res.mobileInterface.templateId
        : '',
      device: this.GetDeviceObject(res),
      assignedPrinterId: res?.assignedPrinter?.printerId
    };
    return data;
  }

  private GetDeviceObject(res: ITemplate): {
    deviceId: string;
    deviceName: string;
    browserId: string;
  } {
    if (!res.deviceId) {
      return null;
    } else {
      return {
        deviceId: res.deviceId,
        deviceName: res.deviceId,
        browserId: res.browserId,
      };
    }
  }

  private GetKioskStatus(isEdit: boolean, res: ITemplate): number {
    if ((!isEdit && !res.deviceId) || !res.browserId) {
      return DeviceStatus.NotRegistered;
    } else {
      return DeviceStatus.Live;
    }
  }

  public RefreshDevice(kioskId: string = null, browserId: string = null) {
    this.branchAPIService
      .RefreshKiosk(this.CompanyId, this.BranchId, kioskId, browserId)
      .subscribe(() => {
        this.AppNotificationService.Notify('Device refreshed successfully.');
      });
  }

  public RefreshKioskGrid(template: string) {
    this.SetKioskList();
  }

  public SendMessageKioskDevice(req: FormGroup) {
    this.formService
      .CallFormMethod<IKioskSendMessageRequest>(req)
      .then((response) => {
        const data = { message: response.message };
        this.branchAPIService
          .SendMessageKiosk(
            this.CompanyId,
            this.BranchId,
            response.kioskId,
            response.browserId,
            data
          )
          .subscribe(() => {
            this.AppNotificationService.Notify('Message sent successfully.');
          });
      });
  }

  public SendMessageToAllKioskDevice(req: FormGroup) {
    this.formService
      .CallFormMethod<IKioskSendMessageRequest>(req)
      .then((response) => {
        const data = {
          message: response.message,
          kioskType: KioskType.Kiosk,
        };
        this.branchAPIService
          .SendMessageAllKiosk(this.CompanyId, this.BranchId, data)
          .subscribe(() => {
            this.AppNotificationService.Notify('Message sent successfully.');
          });
      });
  }

  public StandByKioskDevice(id: string, browserId: string = null) {
    const data = { kioskId: id, IsStandByMode: true };
    this.branchAPIService
      .StandByKiosk(this.CompanyId, this.BranchId, id, browserId, data)
      .subscribe(() => {
        this.SetKioskList();
        this.AppNotificationService.Notify('Device standby successfully.');
      });
  }

  public ResumeKioskDevice(
    template: string,
    id: string,
    browserId: string = null
  ) {
    this.branchAPIService
      .ResumeKiosk(this.CompanyId, this.BranchId, id, browserId)
      .subscribe(() => {
        this.SetKioskList();
        this.AppNotificationService.Notify('Device resumed successfully.');
      });
  }

  public DeRegisterKioskDevice(
    template: string,
    id: string,
    browserId: string = null
  ) {
    this.branchAPIService
      .DeRegisterKiosk(this.CompanyId, this.BranchId, id, browserId)
      .subscribe(() => {
        this.SetKioskList();
        this.AppNotificationService.Notify('Deregistered device successfully.');
      });
      this.browserStorageService.SetDeRegisterSource('add-new-branch.service')

  }

  public LinkKioskDevice(template: string, req: FormGroup) {
    this.formService.CallFormMethod<ITemplate>(req).then((response) => {
      const data = {
        deviceId: response.deviceId,
        kioskType: KioskType.Kiosk,
      };
      this.branchAPIService
        .LinkKiosk(
          this.CompanyId,
          this.BranchId,
          response.id,
          response.browserId,
          data
        )
        .subscribe(() => {
          this.SetKioskList();
          this.AppNotificationService.Notify('Device Linked successfully.');
        });
    });
    this.browserStorageService.RemoveDeRegisterSource();

  }

  public SendMsgToKioskDevice() {
    this.loadingService.showLoading();
    const isSuccess = true;
    setTimeout(() => {
      this.loadingService.hideLoading();
      if (isSuccess) {
        this.AppNotificationService.Notify('Message sent successfully.');
      } else {
        this.AppNotificationService.NotifyError('Something went wrong.');
      }
    }, 2000);
  }

  public ShutDownKioskDevice(
    template: string,
    id: string,
    browserId: string,
    req: FormGroup
  ) {
    this.formService.CallFormMethod<IBranch>(req).then((response) => {
      this.branchAPIService
        .ShutdownKiosk(this.CompanyId, this.BranchId, id, browserId, response)
        .subscribe(() => {
          this.SubjectIsShutdownSuccessFully.next(true);
          this.SetKioskList();
          this.AppNotificationService.Notify('Device Shutdown successfully.');
        });
    });
  }

  public ShowKioskDeleteMessage() {
    this.AppNotificationService.NotifyError(
      'You need to de-register your device to delete the kiosk.'
    );
  }

  /* #endregion */

  /* #region  Monitor */

  public SetMonitorList() {
    this.branchAPIService
      .GetMonitors(this.CompanyId, this.BranchId)
      .subscribe((result) => {
        if (result) {
          this.SubjectMonitorList.next(this.GetMonitorUpdatedList(result));
        }
      });
  }

  public GetMonitorUpdatedList(res) {
    const monitorList = [];
    for (let i = 0; i <= res.length - 1; i++) {
      const workflow = this.GetWorkFlowObj(res[i].layoutTemplate.workFlowId);
      res[i].layoutTemplate.workFlowName = workflow ? workflow.name : '';
      res[i].layoutTemplate.templateName = this.GetMonitorTemplateName(
        res[i].layoutTemplate.templateId
      );
      const template: ITemplate = {
        title: res[i]?.title,
        status: res[i]?.status,
        name: res[i]?.layoutTemplate,
        id: res[i]?.id,
        deviceId: res[i]?.device?.deviceId,
        deviceName: res[i]?.device?.deviceName,
        browserId: res[i]?.device?.browserId,
        languageCode: res[i]?.languageCode,
        mobileInterface: res[i]?.mobileInterface,
      };
      monitorList.push(template);
    }
    this.TemplateDetails.monitorList = monitorList;
    return monitorList;
  }

  public AddMonitor(req: FormGroup) {
    this.formService.CallFormMethod<ITemplate>(req).then((response) => {
      const data = this.GetMonitorResponseData(response, false);
      this.branchAPIService
        .CreateMonitor(this.CompanyId, data.branchId, data)
        .subscribe((result: IRequest) => {
          if (result) {
            this.SetMonitorList();
          }
        });
    });
  }

  public UpdateMonitorData(req: FormGroup) {
    this.formService.CallFormMethod<ITemplate>(req).then((response) => {
      const data = this.GetMonitorResponseData(response, true);
      this.branchAPIService
        .UpdateMonitor(this.CompanyId, data.branchId, data)
        .subscribe((x: IRequest) => {
          this.SetMonitorList();
        });
    });
  }

  public DeleteMonitor(id: string) {
    this.branchAPIService
      .DeleteMonitor(this.CompanyId, this.BranchId, id)
      .subscribe((x: IRequest) => {
        this.SetMonitorList();
      });
  }

  public GetMonitorResponseData(res: any, isEdit: boolean) {
    const data = {
      branchId: this.BranchId,
      id: isEdit ? res.id : this.uuid,
      title: res.title,
      status: this.GetKioskStatus(isEdit, res),
      layoutTemplate: res.name,
      isDeleted: false,
      device: this.GetDeviceObject(res),
      languageCode: res && res.language ? res.language.languageCode : null,
      branchDefaultLanguageCode: this.DefaultLanguageControl.value.languageCode,
    };
    return data;
  }

  public RefreshMonitorDevice() {
    this.loadingService.showLoading();
    const isSuccess = true;
    setTimeout(() => {
      this.loadingService.hideLoading();
      if (isSuccess) {
        this.AppNotificationService.Notify('Device refreshed successfully.');
      } else {
        this.AppNotificationService.NotifyError('Something went wrong.');
      }
    }, 2000);
  }

  public RefreshMonitorGrid(template: string) {
    this.SetMonitorList();
  }

  public SendMessageToMonitor(template: string, req: FormGroup) {
    const isSuccess = true;
    this.formService.CallFormMethod<IBranch>(req).then((response) => {
      this.loadingService.showLoading();
      setTimeout(() => {
        this.loadingService.hideLoading();
        if (response) {
          if (isSuccess) {
            this.AppNotificationService.Notify('Message sent successfully.');
          } else {
            this.AppNotificationService.NotifyError('Something went wrong.');
          }
        }
      }, 2000);
    });
  }

  public SendMessageToAllMonitorDevice(req: FormGroup) {
    this.formService
      .CallFormMethod<IKioskSendMessageRequest>(req)
      .then((response) => {
        const data = {
          message: response.message,
          kioskType: KioskType.Monitor,
        };
        this.branchAPIService
          .SendMessageAllKiosk(this.CompanyId, this.BranchId, data)
          .subscribe(() => {
            this.AppNotificationService.Notify('Message sent successfully.');
          });
      });
  }

  public StandByMonitorDevice(template: string, id: string) {
    const isSuccess = true;
    this.loadingService.showLoading();
    setTimeout(() => {
      this.loadingService.hideLoading();
      if (isSuccess) {
        this.SetMonitorList();
        this.AppNotificationService.Notify('Device standby successfully.');
      } else {
        this.AppNotificationService.NotifyError('Something went wrong.');
      }
    }, 2000);
  }

  public DeRegisterMonitorDevice(
    template: string,
    id: string,
    browserId: string
  ) {
    this.branchAPIService
      .DeRegisterKiosk(this.CompanyId, this.BranchId, id, browserId)
      .subscribe(() => {
        this.SetMonitorList();
        this.AppNotificationService.Notify('Deregistered device successfully.');
      });
  }

  public LinkMonitorDevice(template: string, req: FormGroup) {
    this.formService.CallFormMethod<ITemplate>(req).then((response) => {
      const data = {
        deviceId: response.deviceId,
        kioskType: KioskType.Monitor,
      };
      this.branchAPIService
        .LinkKiosk(
          this.CompanyId,
          this.BranchId,
          response.id,
          response.browserId,
          data
        )
        .subscribe(() => {
          this.SetMonitorList();
          this.AppNotificationService.Notify('Device Linked successfully.');
        });
    });
  }

  public SendMsgToMonitorDevice() {
    this.loadingService.showLoading();
    const isSuccess = true;
    setTimeout(() => {
      this.loadingService.hideLoading();
      if (isSuccess) {
        this.AppNotificationService.Notify('Message sent successfully.');
      } else {
        this.AppNotificationService.NotifyError('Something went wrong.');
      }
    }, 2000);
  }

  public ShutDownMonitorDevice(
    template: string,
    id: string,
    browserId: string,
    req: FormGroup
  ) {
    this.formService.CallFormMethod<IBranch>(req).then((response) => {
      this.branchAPIService
        .ShutdownKiosk(this.CompanyId, this.BranchId, id, browserId, response)
        .subscribe(() => {
          this.SubjectIsShutdownSuccessFully.next(true);
          this.SetMonitorList();
          this.AppNotificationService.Notify('Device Shutdown successfully.');
        });
    });
  }

  public ResumeMonitorDevice(
    template: string,
    id: string,
    browserId: string = null
  ) {
    this.branchAPIService
      .ResumeKiosk(this.CompanyId, this.BranchId, id, browserId)
      .subscribe(() => {
        this.SetMonitorList();
        this.AppNotificationService.Notify('Device resumed successfully.');
      });
  }

  public ShowMonitorDeleteMessage() {
    this.AppNotificationService.NotifyError(
      'You need to de-register your device to delete the monitor.'
    );
  }

  /* #endregion */

  /* #region  Mobile Interface */

  public GetMobiles() {
    this.branchAPIService
      .GetMobileInterfaces(this.CompanyId, this.BranchId)
      .subscribe((result) => {
        if (result) {
          this.SubjectMobileInterfaceList.next(
            this.GetMobileUpdatedList(result)
          );
        }
      });
  }

  public GetMobileUpdatedList(res) {
    const mobileList = [];
    let i;
    for (i = 0; i <= res.length - 1; i++) {
      const template: IMobileInterface = {
        title: res[i]?.title,
        name: res[i]?.layoutTemplate,
        id: res[i]?.id,
        isEnableText: res[i]?.enableTextToRegister,
        smsInterfaceKey: res[i]?.smsKeywordUsedForTextToRegister,
      };
      mobileList.push(template);
    }
    this.TemplateDetails.mobileInterfaceList = mobileList;
    return mobileList;
  }

  public AddMobileInterface(req: FormGroup) {
    this.formService.CallFormMethod<IMobileInterface>(req).then((res) => {
      const data = this.GetMobileInterfaceResponse(res, false);
      this.branchAPIService
        .CreateMobileInterface(this.CompanyId, data.branchId, data)
        .subscribe((result: IRequest) => {
          if (result) {
            this.GetMobileInterfaceDetails(result);
          }
        });
    });
  }

  public UpdateMobileData(req) {
    this.formService.CallFormMethod<IMobileInterface>(req).then((response) => {
      const data = this.GetMobileInterfaceResponse(response, true);
      this.branchAPIService
        .UpdateMobileInterface(this.CompanyId, data.branchId, data)
        .subscribe((result: IRequest) => {
          if (result) {
            this.GetMobileInterfaceDetails(result);
          }
        });
    });
  }

  public DeleteMobile(id: string) {
    this.branchAPIService
      .DeleteMobileInterface(this.CompanyId, this.BranchId, id)
      .subscribe((x: IRequest) => {
        this.GetMobiles();
      });
  }

  public GetMobileInterfaceResponse(res: IMobileInterface, isEdit: boolean) {
    const data = {
      branchId: this.BranchId,
      id: isEdit ? res.id : this.uuid,
      title: res.title,
      isDeleted: false,
      smsKeywordUsedForTextToRegister: res.smsInterfaceKey,
      layoutTemplate: res.name,
      enableTextToRegister: res.isEnableText,
    };
    return data;
  }

  public GetMobileInterfaceDetails(mobileInterfaceObj) {
    this.loadingService.showLoading();
    if (mobileInterfaceObj) {
      const Id = this.TemplateDetails.mobileInterfaceList?.find(
        (x) => x.id === mobileInterfaceObj.id
      );
      if (!Id) {
        Object.assign(mobileInterfaceObj, {
          id: mobileInterfaceObj.id,
          name: mobileInterfaceObj.layoutTemplate,
          smsInterfaceKey: mobileInterfaceObj.smsKeywordUsedForTextToRegister,
          isEnableText: mobileInterfaceObj.enableTextToRegister,
        });
        this.TemplateDetails.mobileInterfaceList.push(mobileInterfaceObj);
      } else if (mobileInterfaceObj.id && mobileInterfaceObj.title) {
        this.TemplateDetails.mobileInterfaceList.find(
          (x) => x.id === mobileInterfaceObj.id
        ).name = mobileInterfaceObj.layoutTemplate;
        this.TemplateDetails.mobileInterfaceList.find(
          (x) => x.id === mobileInterfaceObj.id
        ).title = mobileInterfaceObj.title;
        this.TemplateDetails.mobileInterfaceList.find(
          (x) => x.id === mobileInterfaceObj.id
        ).smsInterfaceKey = mobileInterfaceObj.smsKeywordUsedForTextToRegister;
        this.TemplateDetails.mobileInterfaceList.find(
          (x) => x.id === mobileInterfaceObj.id
        ).isEnableText = mobileInterfaceObj.enableTextToRegister;
      } else {
        const mobile = this.TemplateDetails.mobileInterfaceList.filter(
          (x) => x.id !== mobileInterfaceObj.id
        );
        this.TemplateDetails.mobileInterfaceList = mobile;
      }
    }
    setTimeout(() => {
      this.loadingService.hideLoading();
      this.SubjectMobileInterfaceList.next(
        this.TemplateDetails.mobileInterfaceList
      );
    }, 2000);
  }

  public DisableTextBox() {
    const isEnableRegisterCheckbox = this.MobileForm.get('isEnableText').value;
    const smsInterfaceKeyFormControl = this.MobileForm.get('smsInterfaceKey');
    if (isEnableRegisterCheckbox) {
      smsInterfaceKeyFormControl.enable();
      smsInterfaceKeyFormControl.setValidators(Validators.required);
      smsInterfaceKeyFormControl.updateValueAndValidity();
    } else {
      smsInterfaceKeyFormControl.clearValidators();
      smsInterfaceKeyFormControl.setValue('');
      smsInterfaceKeyFormControl.updateValueAndValidity();
      smsInterfaceKeyFormControl.disable();
    }
  }
  /* #endregion */

  /* #region  Desk */

  public GetDesks() {
    this.branchAPIService
      .GetDesks(this.CompanyId, this.BranchId)
      .subscribe((result) => {
        if (result) {
          this.SubjectDeskList.next(this.GetDeskUpdatedList(result));
        }
      });
  }

  public GetDeskUpdatedList(res) {
    const deskList = [];
    let i;
    for (i = 0; i <= res.length - 1; i++) {
      const template: IDropdownList = {
        text: res[i]?.title,
        value: res[i]?.id,
      };
      deskList.push(template);
    }
    this.TemplateDetails.deskList = deskList;
    return deskList;
  }

  public AddDesk(req: FormGroup) {
    this.formService.CallFormMethod<IDropdownList>(req).then((response) => {
      const data = this.GetDeskResponseData(response, false);
      this.branchAPIService
        .CreateDesk(this.CompanyId, data.branchId, data)
        .subscribe((result: IRequest) => {
          if (result) {
            this.GetDeskDetails(result);
          }
        });
    });
  }

  public UpdateDeskData(req: FormGroup) {
    this.formService.CallFormMethod<IDropdownList>(req).then((response) => {
      const data = this.GetDeskResponseData(response, true);
      this.branchAPIService
        .UpdateDesk(this.CompanyId, data.branchId, data)
        .subscribe((x: IRequest) => {
          this.GetDeskDetails(x);
        });
    });
  }

  public DeleteDesk(id: string) {
    this.branchAPIService
      .DeleteDesk(this.CompanyId, this.BranchId, id)
      .subscribe((x: IRequest) => {
        this.GetDesks();
      });
  }

  public GetDeskResponseData(response: IDropdownList, isEdit: boolean) {
    const data = {
      branchId: this.BranchId,
      id: isEdit ? response.value : this.uuid,
      title: response.text,
      isDeleted: false,
    };
    return data;
  }

  public GetDeskDetails(deskObj) {
    if (deskObj) {
      const Id = this.TemplateDetails.deskList?.find(
        (x) => x.value === deskObj.id
      );
      if (!Id) {
        Object.assign(deskObj, {
          text: deskObj.title,
          value: deskObj.id,
        });
        this.TemplateDetails.deskList.push(deskObj);
      } else if (deskObj.id && deskObj.title) {
        this.TemplateDetails.deskList.find((x) => x.value === deskObj.id).text =
          deskObj.title;
      } else {
        const desk = this.TemplateDetails.deskList.filter(
          (x) => x.value !== deskObj.id
        );
        this.TemplateDetails.deskList = desk;
      }
    }
    this.SubjectDeskList.next(this.TemplateDetails.deskList);
  }
  /* #endregion */

  /* #region Common Functions */

  public GetResponseData(result: IBranch) {
    return {
      companyId: this.CompanyId,
      branchId: !this.IsEditMode ? this.uuid : this.BranchId,
      externalBranchId: result.generalSettings.id,
      branchName: result.generalSettings.name,
      logoUrlPath: this.ImageUrl,
      billingAddress: result.generalSettings.address,
      countryCode: result.generalSettings.country?.countryCode,
      stateCode: result.generalSettings.state?.stateCode,
      cityCode: result.generalSettings.city?.city,
      latitude: result.generalSettings.laviAddress.latitude,
      longitude: result.generalSettings.laviAddress.longitude,
      laviAddress: result.generalSettings.laviAddress,
      phoneNumber: result.generalSettings.phoneNumber
        ? result.generalSettings.phoneNumber
        : null,
      zip: result.generalSettings.zip,
      smsPhoneNumber: !result.generalSettings.branchSmsNumber
        ? null
        : result.generalSettings.branchSmsNumber.value === '0'
        ? null
        : {
            id: result.generalSettings.branchSmsNumber.value,
            phoneNumber: result.generalSettings.branchSmsNumber.text,
          },
      supportedLanguages: this.SetSupportedLanguageResponseObj(
        result.generalSettings.supportedLanguages
      ),
      tags: this.SubjectTags.value ? this.SubjectTags.value : [],
      friendlyBranchName: result.generalSettings.friendlyBranchName,
      isActive: result.generalSettings.isActive,
      additionalSettings: {
        hoursOfOperationId: result.additionalSettings.hoursOfOperation
          ? result.additionalSettings.hoursOfOperation.id
          : null,
        timeZone: (result.additionalSettings.branchTimezone as any)
          ? { id: result.additionalSettings.branchTimezone.value }
          : null,
      },
      advanceSettings: {
        hoursOfOperationExceptionId: result.advanceSettings
          .hoursOfOperationException
          ? result.advanceSettings.hoursOfOperationException.id
          : null,
        hideBranchFromScheduler:
          result.advanceSettings.hideBranchFromScheduler || false,
        textToJoinMobileInterfaceId: result.advanceSettings
          .textToJoinMobileInterface && result.advanceSettings.enableTextToJoin
          ? result.advanceSettings.textToJoinMobileInterface.templateId
          : null,
        enableTextToJoin:result.advanceSettings?.enableTextToJoin || false,
        overridetwilioServiceId:result.advanceSettings?.overridetwilioServiceId || "",

      },
      contactPerson: result.contactPerson,
      sameAsCompany: result.generalSettings.isCompanyGeneralSetting,
      contactPersonSameAsCompany: result.contactPerson.some(x=>x.isCompanyContact),
      isDeleted: false,
      defaultPrinterId: result?.generalSettings?.defaultPrinter?.printerId
    };
  }

  public SetSupportedLanguageResponseObj(
    supportedLanguage: ILanguageDropdownList[]
  ) {
    const defaultLanguage = this.DefaultLanguageControl.value;
    supportedLanguage.map((x) => (x.isDefault = false));
    const language = supportedLanguage.find(
      (x) => x.languageCode === defaultLanguage.languageCode
    );
    Object.assign(language, { isDefault: true });
    return supportedLanguage;
  }

  public RedirectToBranchList() {
    this.routeHandlerService.RedirectToBranchList();
  }

  public GetCountryObj(countryCode: string): ICountryDropdownList {
    return (
      (this.DropdownData === undefined
        ? null
        : this.DropdownData.countries.find(
            (x) => x.countryCode === countryCode
          )) ||
      (countryCode
        ? {
            country: countryCode,
            countryCode: countryCode,
          }
        : null)
    );
  }

  /* #endregion */

  /* #region  Additional / Unused Functions */

  public GetCompanyAdditionalSettingInfo() {
    if (this.BranchForm.get('isCompanyAdditionalSetting').value) {
      this.BranchForm.get('hoursOfOperation').disable();
      this.BranchForm.get('hoursOfOperation').setValue({
        value: '2',
        text: 'Default schedule  hours',
      });
    } else {
      this.BranchForm.get('hoursOfOperation').enable();
      this.BranchForm.get('hoursOfOperation').setValue(null);
    }
  }

  public SetWorkflowList() {
    this.branchAPIService
      .GetWorkflows<IWorkFlowUsedInBranchList>(this.CompanyId, this.BranchId)
      .subscribe((result) => {
        if (result) {
          this.SubjectWorkFlowUsedInBranchList.next(result);
        }
      });
  }

  public AddWorkflowUsedInBranch(form: FormGroup) {
    this.formService.CallFormMethod<IWorkFlowUsedInBranch>(form).then((res) => {
      if (!this.CheckIfWorkflowAlreadyExists(res)) {
        const workflow = this.GetWorkflowResponseData(res, false);
        this.branchAPIService
          .CreateWorkflow(this.CompanyId, this.BranchId, workflow)
          .subscribe((x) => {
            this.SetWorkflowList();
            this.ResetAndCloseWorkFlowModal(form);
          });
      } else {
        this.WorkflowExistNotification();
        return;
      }
    });
  }

  public ResetAndCloseWorkFlowModal(form: FormGroup) {
    form.reset();
    this.IsWorkflowEditMode = false;
    this.SubjectOpenWorkFlowUsedInBranchDialog.next(false);
  }

  private CheckIfWorkflowAlreadyExists(res: IWorkFlowUsedInBranch) {
    return this.SubjectWorkFlowUsedInBranchList.value.some(
      (x) => x?.workFlowId === res?.workFlow?.workFlowId && x?.id !== res?.id
    );
  }
  /* #endregion */

  /* #region  Additional / Unused Functions */

  public UpdateWorkflowUsedInBranch(form: FormGroup) {
    const notfoundIndex = -1;
    this.formService.CallFormMethod<IWorkFlowUsedInBranch>(form).then((res) => {
      if (!this.CheckIfWorkflowAlreadyExists(res)) {
        this.branchAPIService
          .UpdateWorkflow(
            this.CompanyId,
            this.BranchId,
            this.GetWorkflowResponseData(res, true)
          )
          .subscribe((x: IRequest) => {
            this.SetWorkflowList();
            this.ResetAndCloseWorkFlowModal(form);
          });
      }
    });
  }

  private WorkflowExistNotification() {
    this.AppNotificationService.NotifyError(
      BranchMessages.WorkflowAlreadyExistMessage
    );
  }

  public EnterTag() {
    const tag = this.TagControl.value;
    if (!this.IsValidTag(tag)) {
      return;
    }
    this.SubjectTags.value.push(tag);

    const notFoundIndex = -1;
    if (this.DropdownData.tags.indexOf(tag) === notFoundIndex) {
      this.DropdownData.tags.push(tag);
    }
    this.SubjectTags.next(this.SubjectTags.value);
    this.TagControl.reset();
  }

  private IsValidTag(tag: string) {
    return (
      tag !== null &&
      tag.trim() !== '' &&
      !this.SubjectTags.value.includes(tag.toLowerCase())
    );
  }

  public RemoveTags(e: ChipRemoveEvent) {
    const tags = this.SubjectTags.value;
    tags.splice(
      tags.findIndex((c) => c === e.sender.label),
      1
    );
    this.SubjectTags.next(tags);
  }

  public DeleteWorkflowUsedInBranch(id: string) {
    this.branchAPIService
      .DeleteWorkflow(this.CompanyId, this.BranchId, id)
      .subscribe((x: IRequest) => {
        this.SetWorkflowList();
      });
  }

  public CheckWorkflowIsInUse(workflowId: string) {
    const workflowInUse = {
      byKiosk: false,
      byMonitor: false,
      byMobileInterface: false,
    };
    if (workflowId) {
      this.SubjectKioskList.value.forEach((x) => {
        if (x.name.workFlowId == workflowId) {
          workflowInUse.byKiosk = true;
        }
      });
      this.SubjectMobileInterfaceList.value.forEach((x) => {
        if (x.name.workFlowId == workflowId) {
          workflowInUse.byMobileInterface = true;
        }
      });
      this.SubjectMonitorList.value.forEach((x) => {
        if (x.name.workFlowId == workflowId) {
          workflowInUse.byMonitor = true;
        }
      });
    }
    return workflowInUse;
  }

  getWorkflowIdFromListIfMatched(id: string) {
    let workflowId = '';
    this.SubjectWorkFlowUsedInBranchList.value.forEach((wf) => {
      if (wf.id == id) {
        workflowId = wf.workFlowId;
      }
    });
    return workflowId;
  }

  private GetWorkflowResponseData(
    res: IWorkFlowUsedInBranch,
    isUpdate: boolean
  ): IWorkFlowUsedInBranchList {
    return {
      id: isUpdate ? res.id : this.uuid,
      workFlowId: res.workFlow.workFlowId,
      serviceIds: res.isAllServices ? [] : res.services.map((x) => x.id),
      isAllServices: res.isAllServices,
      branchId: this.BranchId,
    };
  }

  public GetSMSNumberObj(id: string) {
    return this.DropdownData === undefined
      ? null
      : this.DropdownData.phoneNumberList.find((x) => x.value === id);
  }

  private GetLanguageObj(languageCode: string): ILanguageDropdownList {
    return this.DropdownData === undefined
      ? null
      : this.DropdownData.languages.find(
          (x) => x.languageCode === languageCode
        );
  }

  /* #endregion */

  public SetDefaultLanguage(defaultLanguage: ILanguageDropdownList) {
    if (this.DefaultLanguage?.languageCode && this.IsEditMode) {
      this.ConfirmDefaultLanguageChange(defaultLanguage);
    } else {
      this.DefaultLanguage = defaultLanguage;
    }
  }

  private ConfirmDefaultLanguageChange(defaultLanguage: ILanguageDropdownList) {
    if (!confirm(BranchMessages.DefaultLanguageChangeConfirmationMessage)) {
      this.DefaultLanguageControl.setValue(this.DefaultLanguage);
    } else {
      this.DefaultLanguage = defaultLanguage;
    }
  }

  PrintQRCode(id: string, printAll: boolean) {
    let printContents = '';
    if (printAll) {
      this.SubjectMobileInterfaceList.value.forEach((x) => {
        printContents += document.getElementById(x.id).innerHTML;
      });
    } else {
      printContents = document.getElementById(id).innerHTML;
    }
    const pageContent = `<!DOCTYPE html><html><head></head><body style="text-align:center;">
                        ${printContents}</html>`;
    let popupWindow: Window;
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      popupWindow = window.open(
        '',
        '_blank',
        'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
      );
      popupWindow.window.focus();
      popupWindow.document.write(pageContent);
      popupWindow.document.close();
      popupWindow.onbeforeunload = (event) => {
        popupWindow.close();
      };
      popupWindow.onabort = (event) => {
        popupWindow.document.close();
        popupWindow.close();
      };
    } else {
      popupWindow = window.open('', '_blank', 'width=600,height=600');
      popupWindow.document.open();
      popupWindow.document.write(pageContent);
      popupWindow.document.close();
    }
  }

  ShowURLCopied() {
    this.AppNotificationService.Notify(
      BranchMessages.DeviceRegistrationLinkCopied
    );
  }

  AddressChanged(address: ILaviAddress) {
    this.BranchForm.get('generalSettings.address').setValue(
      address.formattedAddress
    );

    this.BranchForm.get('generalSettings.laviAddress').setValue(address);

    let country = this.GetCountry(address.countryId);
    this.BranchForm.get('generalSettings.country').setValue(country);
    let zip = address.zipCode;
    this.BranchForm.get('generalSettings.zip').setValue(zip);
    let branchTimezone: IDropdownList = this.GetTimezone(address.timeZoneId);
    this.BranchForm.get('additionalSettings.branchTimezone').setValue(
      branchTimezone
    );
    this.BranchForm.get('additionalSettings.branchTimezone').disable();
  }

  GetTimezone(timeZoneId: string): IDropdownList {
    return {
      text: timeZoneId,
      value: timeZoneId,
    };
  }

  GetCountry(countryId: string) {
    let country = this.SubjectNewBranchDropdownListData.value.countries.find(
      (x) => x.countryCode == countryId
    );
    return (
      country ?? {
        country: countryId,
        countryCode: countryId,
      }
    );
  }
}
