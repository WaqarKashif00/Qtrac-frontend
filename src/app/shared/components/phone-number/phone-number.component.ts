import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { KeyboardVirtualService } from 'src/app/features/utility-configuration/kiosk/keyboard-virtual.service';
import { v4 as uuidv4 } from 'uuid';
const cityTimezones = require('city-timezones');
@Component({
  selector: 'lavi-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaviPhoneNumberComponent {
  @Input() ItemId: string;
  @Input() Invalid: boolean = false;
  @Input() PhoneNumber: string;
  @Input() DefaultCountry: string;
  @Input() IsDisabled: boolean;
  @Input() TextColor = 'unset';

  @Output() OnValidPhoneNumber: EventEmitter<string>;
  @Output() OnInvalidPhoneNumber: EventEmitter<string>;

  @ViewChild('inputfield') inputField: ElementRef;

  public dialCode = null;
  
  constructor(
    private keyboardVirtualService: KeyboardVirtualService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.InitializeOutputs();
  }

  ngOnInit(): void {
    // this.keyboardVirtualService.nextButtonEvent.subscribe((response) => {
    //   if (this.ItemId == response) {
    //     let element = <HTMLInputElement>(
    //       document.getElementById(response)
    //     );
    //     this.setfoucs(element); 
    //   }
    // });
  }

  // setfoucs(element: any) { 
  //   if (element) {
  //     element.focus();
  //   }
  // }

  //#region Virtual KeyBoard

  isInFoucs: boolean = false;

  inputFocus = (event: any) => {
    this.isInFoucs = true;
    this.keyboardVirtualService.inputFocus.next(event);

    this.keyboardVirtualService.InputValue.pipe(
      takeWhile((resp) => this.isInFoucs)
    ).subscribe((response) => {
      if (response.id == event.target.id) {
        this.PhoneNumber = response.value;
        this.changeDetectorRef.detectChanges();
      }
    });
  };

  inputFocusOut = (event: any) => {
    this.isInFoucs = false;
    this.keyboardVirtualService.isEnableKeyBoard.next(false); 
  };

  inputChange = (event: any) => {
    this.keyboardVirtualService.inputChange.next(event);
    this.changeDetectorRef.detectChanges();
  };
  //#endregion

  InitializeOutputs() {
    this.OnValidPhoneNumber = new EventEmitter<string>();
    this.OnInvalidPhoneNumber = new EventEmitter<string>();
  }

  onCountryChange(data) {
    this.dialCode = data.dialCode;
  }

  hasError(data) {
    if (this.dialCode) {
      let isExists = this.inputField.nativeElement.value.indexOf('+' + this.dialCode);
      if (isExists != -1) {
        this.inputField.nativeElement.value = this.inputField.nativeElement.value.replace('+' + this.dialCode, '')
      }
    }
    if (this.inputField.nativeElement.value.match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/) == null) {
      const inputValue = this.inputField.nativeElement.value.toString();
      this.OnInvalidPhoneNumber.emit(inputValue);
    } else {
      if(this.dialCode){
        this.inputField.nativeElement.value =  '+' + this.dialCode + this.inputField.nativeElement.value
        //this.getNumber('+' + this.dialCode + this.inputField.nativeElement.value);
        this.getNumber(this.inputField.nativeElement.value);
      }

    }
  }

  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  getNumber(data) {
    this.OnValidPhoneNumber.emit(data);
  }

  telInputObject(obj) {
    this.dialCode = obj.s.dialCode;
   }
  GetInitialDetails(): any {
    if (this.PhoneNumber && this.PhoneNumber.length > 0) {
      return {};
    }
    return {
      initialCountry: (this.DefaultCountry) ? cityTimezones.cityMapping.find((cityMap) => cityMap.iso3 === this.DefaultCountry).iso2 : 'US',
    };
  }
}
