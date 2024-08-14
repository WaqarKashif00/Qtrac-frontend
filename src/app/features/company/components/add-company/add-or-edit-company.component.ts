import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChipRemoveEvent } from '@progress/kendo-angular-buttons';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IBranchDropdownDetails } from 'src/app/models/common/branch-dropdown-interface';
import { ICityDropDownList } from 'src/app/models/common/city-dropdown-list.interface';
import { DefaultCompanyConfigValues } from 'src/app/models/constants/company-configuration.constants';
import { UserType } from 'src/app/models/enums/user-type.enum';
import { CompanyMessages } from 'src/app/models/validation-message/company';
import { ILaviAddress } from 'src/app/shared/api-models/google-models/lavi-address.interface';
import { SharedCompanyConfigurationService } from 'src/app/shared/services/shared-company-configuration.service';
import { AddOrEditCompanyService } from './add-or-edit-company.service';
import { ICompanyConfigDropdownListData } from './models/company-configuration-dropdownlist-data.interface';
import { PhoneNumber } from './models/company-phone-number.interface';
import { ILanguageDropdownList } from './models/language-dropdownlist.interface';
import { IStateDropdownList } from './models/state-dropdown-list.interface';

@Component({
  selector: 'lavi-add-company',
  templateUrl: './add-or-edit-company.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AddOrEditCompanyService,
    SharedCompanyConfigurationService
  ],
})
export class AddOrEditCompanyComponent extends AbstractComponent {

  CompanyConfigMessages = CompanyMessages;

  CompanyConfigDropdownListData$: Observable<ICompanyConfigDropdownListData>;
  StateList$: Observable<IStateDropdownList[]>;
  CityList$: Observable<ICityDropDownList[]>;
  DefaultValues = DefaultCompanyConfigValues;
  DefaultList$: Observable<ILanguageDropdownList[]>;
  TagList$: Observable<string[]>;
  BranchList: IBranchDropdownDetails[];
  ShowRetentionYears$: Observable<boolean>;
  IsAddMode$: Observable<boolean>;
  IsClicked: boolean;
  IsValidSMTPSettings$: Observable<boolean>;
  IsMultiQueueError$: Observable<boolean>;

  AllTwilioActiveNumbers$: Observable<PhoneNumber[]>;
  AllAssignedToBranchNumbers$: Observable<PhoneNumber[]>;
  AllUnAssignedNumbers$: Observable<PhoneNumber[]>;
  IsSMSConfigAccountLinked$: Observable<boolean>;

  get IsLaviUserType() {
    return this.addOrEditCompanyService.authService.UserType === UserType.Lavi;
  }

  get CompanyConfigForm() {
    return this.addOrEditCompanyService.CompanyConfigForm;
  }

  constructor(private addOrEditCompanyService: AddOrEditCompanyService) {
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
    this.CompanyConfigDropdownListData$ = this.addOrEditCompanyService.CompanyConfigDropdownListData$;
    this.StateList$ = this.addOrEditCompanyService.StateList$;
    this.CityList$ = this.addOrEditCompanyService.CityList$;
    this.DefaultList$ = this.addOrEditCompanyService.DefaultLanguageList$;
    this.ShowRetentionYears$ = this.addOrEditCompanyService.ShowRetentionYears$;
    this.TagList$ = this.addOrEditCompanyService.TagList$;
    this.IsAddMode$ = this.addOrEditCompanyService.IsAddMode$;
    this.IsValidSMTPSettings$ = this.addOrEditCompanyService.IsValidSMTPSettings$;
    this.IsMultiQueueError$ = this.addOrEditCompanyService.IsMultiQueueError$;

    this.subs.sink = this.CompanyConfigDropdownListData$.subscribe(data => {
      this.BranchList = data.branchList.concat([]);
    });

    this.AllTwilioActiveNumbers$ = this.addOrEditCompanyService.AllTwilioActiveNumbers$;
    this.AllAssignedToBranchNumbers$ = this.addOrEditCompanyService.AllAssignedToBranchNumbers$;
    this.AllUnAssignedNumbers$ = this.addOrEditCompanyService.AllUnAssignedNumbers$;
    this.IsSMSConfigAccountLinked$ = this.addOrEditCompanyService.IsSMSConfigAccountLinked$;
  }

  public SetInitialData() {
    this.addOrEditCompanyService.CallMultipleApi();
    this.addOrEditCompanyService.SetMode();
  }

  public SetCompanyConfigDetails() {
    this.addOrEditCompanyService.GetCompanyConfigurationDetails();
  }

  public BindStateList(id: string) {

    this.addOrEditCompanyService.BindStateList(id, null);
  }

  public ResetCity(locationDetail:any) {
    this.addOrEditCompanyService.ResetZipCity(locationDetail);
  }

  public ResetZipCode() {
    this.addOrEditCompanyService.ResetZipCode();
  }

  public BindLanguageList(data) {
    this.addOrEditCompanyService.AddLanguage(data);
  }

  public SetDefaultLanguage(data) {
    this.addOrEditCompanyService.SetDefaultLanguage(data);
  }

  public AddTagOnEnter() {
    this.addOrEditCompanyService.EnterTag();
  }

  public RemoveTag(e: ChipRemoveEvent) {
    this.addOrEditCompanyService.RemoveTags(e);
  }

  public Save() {
    this.addOrEditCompanyService.SaveCompanyConfiguration(
      this.addOrEditCompanyService.CompanyConfigForm
    );
  }

  public Cancel() {
    this.addOrEditCompanyService.Cancel();
  }

  DeleteNumber(phoneNumber: PhoneNumber) {
    this.addOrEditCompanyService.DeleteNumber(phoneNumber);
  }

  IsAccountLinked(): boolean {
    return this.addOrEditCompanyService.IsAccountLinked();
  }

  Update(phoneNumber: PhoneNumber) {
    this.addOrEditCompanyService.UpdateNumber(phoneNumber);
  }

  BindSMSConfigurations() {
    this.addOrEditCompanyService.BindSMSConfigurations();
  }

  LinkAccount() {
    this.addOrEditCompanyService.UpdateTwilioConfigurations();
  }

  UpdateAll(phoneNumber: PhoneNumber[]) {
    phoneNumber.forEach(PhoneNo => {
      this.addOrEditCompanyService.UpdateNumber(PhoneNo);
    });
  }

  public AddressChange(address:ILaviAddress){
    this.addOrEditCompanyService.AddressChanged(address);
  }

}