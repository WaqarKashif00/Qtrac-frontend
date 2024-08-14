import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChipRemoveEvent } from '@progress/kendo-angular-buttons';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { IBranchDropdownDetails } from 'src/app/models/common/branch-dropdown-interface';
import { ICityDropDownList } from 'src/app/models/common/city-dropdown-list.interface';
import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { IStateDropdownList } from 'src/app/models/common/state-dropdown-list.interface';
import { DefaultCompanyConfigValues } from 'src/app/models/constants/company-configuration.constants';
import { UserType } from 'src/app/models/enums/user-type.enum';
import { CompanyConfigurationMessages } from 'src/app/models/validation-message/company-configuration';
import { ILaviAddress } from 'src/app/shared/api-models/google-models/lavi-address.interface';
import { SharedCompanyConfigurationService } from 'src/app/shared/services/shared-company-configuration.service';
import { CompanyConfigurationService } from './company-configuration.service';
import { ICompanyConfigDropdownListData } from './models/company-configuration-dropdownlist-data.interface';
import { PhoneNumber } from './models/company-phone-number.interface';

@Component({
  selector: 'lavi-company-configuration',
  templateUrl: './company-configuration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CompanyConfigurationService,
    SharedCompanyConfigurationService
  ],
})
export class CompanyConfigurationComponent extends AbstractComponent {

  IsMultiQueueError$: Observable<boolean>;
  CompanyConfigMessages = CompanyConfigurationMessages;
  CompanyConfigDropdownListData$: Observable<ICompanyConfigDropdownListData>;
  StateList$: Observable<IStateDropdownList[]>;
  CityList$: Observable<ICityDropDownList[]>;
  DefaultValues = DefaultCompanyConfigValues;
  DefaultList$: Observable<ILanguageDropdownList[]>;
  TagList$: Observable<string[]>;
  BranchList: IBranchDropdownDetails[];
  ShowRetentionYears$: Observable<boolean>;
  IsEditMode$: Observable<boolean>;
  isValidSMTPSettings$: Observable<boolean>;

  AllTwilioActiveNumbers$: Observable<PhoneNumber[]>;
  AllAssignedToBranchNumbers$: Observable<PhoneNumber[]>;
  AllUnAssignedNumbers$: Observable<PhoneNumber[]>;
  IsSMSConfigAccountLinked$: Observable<boolean>;

  get IsLaviUserType() {
    return this.authStateService.UserType === UserType.Lavi;
  }

  get CompanyConfigForm() {
    return this.companyConfigurationService.CompanyConfigForm;
  }

  constructor(
    private companyConfigurationService: CompanyConfigurationService, private authStateService: AuthStateService
  ) {
    super();
  }

  Init() {
    this.SetInitialObservables();
    this.SetInitialData();
  }


  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }

  public SetInitialObservables() {
    this.CompanyConfigDropdownListData$ = this.companyConfigurationService.CompanyConfigDropdownListData$;
    this.StateList$ = this.companyConfigurationService.StateList$;
    this.CityList$ = this.companyConfigurationService.CityList$;
    this.DefaultList$ = this.companyConfigurationService.DefaultLanguageList$;
    this.ShowRetentionYears$ = this.companyConfigurationService.ShowRetentionYears$;
    this.TagList$ = this.companyConfigurationService.TagList$;
    this.IsEditMode$ = this.companyConfigurationService.IsEditMode$;
    this.IsMultiQueueError$ = this.companyConfigurationService.IsMultiQueueError$;
    this.AllTwilioActiveNumbers$ = this.companyConfigurationService.AllTwilioActiveNumbers$;
    this.AllAssignedToBranchNumbers$ = this.companyConfigurationService.AllAssignedToBranchNumbers$;
    this.AllUnAssignedNumbers$ = this.companyConfigurationService.AllUnAssignedNumbers$;
    this.isValidSMTPSettings$ = this.companyConfigurationService.isValidSMTPSettings$;
    this.IsSMSConfigAccountLinked$ = this.companyConfigurationService.IsSMSConfigAccountLinked$;

    this.subs.sink = this.CompanyConfigDropdownListData$.subscribe(CompanyConfigDropdownListData => {
      this.BranchList = CompanyConfigDropdownListData?.branchList?.concat([]);
    });
  }

  public SetInitialData() {
    this.companyConfigurationService.CallMultipleApi();
    this.companyConfigurationService.SetEditMode();
  }

  public SetCompanyConfigDetails() {
    this.companyConfigurationService.GetCompanyConfigurationDetails(
      this.authStateService.CompanyId
    );
  }

  public BindStateList(id: string) {
    this.companyConfigurationService.BindStateList(id, null);
  }

  public ResetCity(locationDetail: any) {
    this.companyConfigurationService.ResetZipCity(locationDetail);
  }

  public ResetZipCode() {
    this.companyConfigurationService.ResetZipCode();
  }

  public BindLanguageList(data) {
    this.companyConfigurationService.AddLanguage(data);
  }

  public SetDefaultLanguage(event) {
    this.companyConfigurationService.SetDefaultLanguage(event);
  }

  public AddTagOnEnter() {
    this.companyConfigurationService.EnterTag();
  }

  public RemoveTag(e: ChipRemoveEvent) {
    this.companyConfigurationService.RemoveTags(e);
  }

  public Save() {
    this.companyConfigurationService.SaveCompanyConfiguration(
      this.companyConfigurationService.CompanyConfigForm
    );
  }

  DeleteNumber(phoneNumber: PhoneNumber) {
    this.companyConfigurationService.DeleteNumber(phoneNumber);
  }

  Update(phoneNumber: PhoneNumber) {
    this.companyConfigurationService.UpdateNumber(phoneNumber);
  }

  BindSMSConfigurations() {
    this.companyConfigurationService.BindSMSConfigurations();
  }


  LinkAccount() {
    this.companyConfigurationService.UpdateTwilioConfigurations();
  }

  UpdateAll(phoneNumber: PhoneNumber[]) {
    phoneNumber.forEach(PhoneNo => {
      this.companyConfigurationService.UpdateNumber(PhoneNo);
    });
  }

  public AddressChange(address:ILaviAddress){
    this.companyConfigurationService.AddressChanged(address);
  }

}