import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input,
  Output, ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ChipRemoveEvent } from '@progress/kendo-angular-buttons';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ResolveAddress } from 'src/app/core/utilities/google-address-common';
import { ICityDropDownList } from 'src/app/models/common/city-dropdown-list.interface';
import { ICountryDropdownList } from 'src/app/models/common/country-dropdown-list.interface';
import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { IStateDropdownList } from 'src/app/models/common/state-dropdown-list.interface';
import { DefaultAddNewBranchValues } from 'src/app/models/constants/add-new-branch.constant';
import { Validations } from 'src/app/models/constants/validation.constant';
import { AddNewBranchMessages } from 'src/app/models/validation-message/add-new-branch';
import { ILaviAddress } from 'src/app/shared/api-models/google-models/lavi-address.interface';
import { LocationAPIService } from 'src/app/shared/api-services/location-api.service';
import { FilterModelWithTags } from 'src/app/shared/components/search/models/filter-model-with-tags';
import { Address } from 'src/app/shared/directives/google-address-auto-complete/objects/address';
import { IDropdownList } from '../../../models/dropdown-list.interface';
import { PrinterTemplate } from '../../../models/printer-dropdown-list.interface';

@Component({
  selector: 'lavi-general-configuration',
  templateUrl: './general-configuration.component.html',
  styleUrls: ['../../add-new-branch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralConfigurationComponent
  extends AbstractComponent
  implements AfterViewInit
{
  @Input() Countries: IDropdownList[];
  @Input() States: IDropdownList[];
  @Input() Cities: ICityDropDownList[];
  @Input() SmsNumbers: IDropdownList[];
  @Input() LocationPrinters: PrinterTemplate[];
  @Input() SupportedLanguages: ILanguageDropdownList[];
  @Input() DefaultLanguage: ILanguageDropdownList[];
  @Input() GeneralConfigForm: FormGroup;
  @Input() Tags: string[];
  @Input() TagSuggestions: string[];
  @Input() EditMode: boolean;

  @Output() StateList = new EventEmitter();
  @Output() CityListOnStateChange = new EventEmitter();
  @Output() DefaultLanguageList = new EventEmitter();
  @Output() ResetZipCity = new EventEmitter();
  @Output() ResetZip = new EventEmitter();
  @Output() GetCompanyGeneralSettingsInfo = new EventEmitter();
  @Output() EnterTag = new EventEmitter();
  @Output() DiscardTag = new EventEmitter();
  @Output() SetDefaultLanguage = new EventEmitter();
  @Output() AddressChange = new EventEmitter<ILaviAddress>();

  maxLength = 200;
  DefaultData = DefaultAddNewBranchValues;
  ValidationMessages = AddNewBranchMessages;
  Validation = Validations;
  public firstTime: boolean = true;
  public backUpNumbers: any;
  public searchModel: FilterModelWithTags = new FilterModelWithTags();




  AddressField: any = '';

  get BranchNameFormControl() {
    return this.GeneralConfigForm.get('name');
  }

  get CityFormControl() {
    return this.GeneralConfigForm.get('city');
  }
  @ViewChild('combo') private combo;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly locationAPIService: LocationAPIService
  ) {
    super();
  }

  Init() {
    this.subs.sink = this.BranchNameFormControl.statusChanges.subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });
    // Inherited from AbstractComponent to initialize component life cycle.
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }

  public ngAfterViewInit() {
    if (this.combo) {
      this.combo.searchbar.input.nativeElement.setAttribute(
        'maxlength',
        this.maxLength
      );
    }
  }

  public GetCompanyGeneralDetails() {
    this.GetCompanyGeneralSettingsInfo.emit(
      this.GeneralConfigForm.get('isCompanyGeneralSetting').value
    );
  }

  public BindState(event: ICountryDropdownList) {
    this.StateList.emit(event.countryCode);
  }

  public BindCity(countryCode: string, event: IStateDropdownList) {
    this.CityListOnStateChange.emit({
      countryCode: countryCode,
      state: event.state,
    });
  }

  public ResetCity() {
    this.ResetZipCity.emit();
  }

  public ResetPinCode() {
    this.ResetZip.emit();
    this.changeDetectorRef.detectChanges();
  }
  public AddDefaultLanguage(event: IDropdownList[]) {
    this.DefaultLanguageList.emit(event);
  }

  public AddTagOnEnter() {
    this.EnterTag.emit();
  }

  public RemoveTag(e: ChipRemoveEvent) {
    this.DiscardTag.emit(e);
  }

  public SetLanguage(event) {
    this.SetDefaultLanguage.emit(event);
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
    this.GeneralConfigForm.get('address').setValue(
      event.target.value
    );
    this.GeneralConfigForm.get('laviAddress').setValue(this.GeneralConfigForm.get('laviAddress').value);
    this.GeneralConfigForm.get('address').setErrors({'required': this.GeneralConfigForm.controls.laviAddress.hasError('required')});
    this.GeneralConfigForm.get('address').setErrors({'mismatched': this.GeneralConfigForm.controls.laviAddress.hasError('mismatched')});
  }

  handleFilter(value: string) {
    this.firstTime = false;
    if(value.length > 0){
      this.SmsNumbers = this.SmsNumbers.filter(
        (s) => s.text.indexOf(value) !== -1
      );
    }else{
      this.SmsNumbers = this.backUpNumbers;
    }
  }
  onOpen(value){
    if(this.firstTime){
      this.backUpNumbers = this.SmsNumbers;
    }else{
      this.SmsNumbers = this.backUpNumbers;
    }
  }
}
