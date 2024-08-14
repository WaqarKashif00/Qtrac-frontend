import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter, Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ChipRemoveEvent } from '@progress/kendo-angular-buttons';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ResolveAddress } from 'src/app/core/utilities/google-address-common';
import { ICityDropDownList } from 'src/app/models/common/city-dropdown-list.interface';
import { ICountryDropdownList } from 'src/app/models/common/country-dropdown-list.interface';
import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { IStateDropdownList } from 'src/app/models/common/state-dropdown-list.interface';
import { DefaultCompanyConfigValues } from 'src/app/models/constants/company-configuration.constants';
import { Validations } from 'src/app/models/constants/validation.constant';
import { CompanyConfigurationMessages } from 'src/app/models/validation-message/company-configuration';
import { ILaviAddress } from 'src/app/shared/api-models/google-models/lavi-address.interface';
import { LocationAPIService } from 'src/app/shared/api-services/location-api.service';
import { Address } from 'src/app/shared/directives/google-address-auto-complete/objects/address';

@Component({
  selector: 'lavi-company-general-configuration',
  templateUrl: './company-general-configuration.component.html',
  styleUrls: ['./company-general-configuration.component.scss']
})
export class CompanyGeneralConfigurationComponent extends AbstractComponent implements AfterViewInit {

  @Input() CountryList: ICountryDropdownList[];
  @Input() StateList: IStateDropdownList[];
  @Input() CityList: ICityDropDownList[];
  @Input() DefaultLangList: ILanguageDropdownList[];
  @Input() SupportedLangList: ILanguageDropdownList[];
  @Input() CompanyGeneralConfigForm: FormGroup;
  @Input() TagList: string[];
  @Input() TagSuggestionList: string[];

  @Output() BindState = new EventEmitter();
  @Output() ResetZip = new EventEmitter();
  @Output() ResetCityName = new EventEmitter();
  @Output() BindLanguageList = new EventEmitter();
  @Output() SetDefaultLanguage = new EventEmitter();
  @Output() EnterTag = new EventEmitter();
  @Output() AddressChange = new EventEmitter<ILaviAddress>();
  @Output() DiscardTag = new EventEmitter();

  @ViewChild('tag') private tag;

  CompanyConfigMessages = CompanyConfigurationMessages;
  maxLength = 200;
  DefaultData = DefaultCompanyConfigValues;
  Validation = Validations;
  AddressField: any = '';


  get CompanyNameFormControl() {
    return this.CompanyGeneralConfigForm.get('companyName');
  }

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly locationAPIService: LocationAPIService
    ) {
    super();
  }

  Init() {
    this.subs.sink = this.CompanyNameFormControl.statusChanges.subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });
  }

  Destroy() {}

  ngAfterViewInit() {
    this.tag.searchbar.input.nativeElement.setAttribute('maxlength', this.maxLength);
  }

  public BindStateList(event: ICountryDropdownList) {

      this.BindState.emit(event.countryCode);
  }

  public ResetCity(countryId: string, state: IStateDropdownList) {
    this.ResetCityName.emit({
      countryId,
      stateId: state.state
    });
  }

  public ResetZipCode(){
    this.ResetZip.emit();
  }

  public AddLanguages(event){
    this.BindLanguageList.emit(event);
  }

  public OnChangeDefaultLanguage(event: ILanguageDropdownList){
    this.SetDefaultLanguage.emit(event);
  }

  public AddTagOnEnter() {
    this.EnterTag.emit();
  }

  public RemoveTag(e: ChipRemoveEvent) {
    this.DiscardTag.emit(e);
  }

  async handleAddressChange(address: Address) {
    const laviAddress: ILaviAddress = await ResolveAddress(
      address,
      this.locationAPIService
    );
    this.AddressField = address.formatted_address;
    
    this.AddressChange.emit(laviAddress);
  }

  blur(event): void { 
    this.CompanyGeneralConfigForm.get('address').setValue(
      event.target.value
    );
    this.CompanyGeneralConfigForm.get('laviAddress').setValue(this.CompanyGeneralConfigForm.get('laviAddress').value);
    this.CompanyGeneralConfigForm.get('address').setErrors({'required': this.CompanyGeneralConfigForm.controls.laviAddress.hasError('required')});
    this.CompanyGeneralConfigForm.get('address').setErrors({'mismatched': this.CompanyGeneralConfigForm.controls.laviAddress.hasError('mismatched')});
  }
}