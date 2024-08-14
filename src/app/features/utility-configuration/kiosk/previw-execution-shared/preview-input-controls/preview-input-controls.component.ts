import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Validations } from 'src/app/models/constants/validation.constant';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { KeyboardVirtualService } from '../../keyboard-virtual.service';
import { IKioskPanelItemsData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';
import { takeWhile } from 'rxjs/operators';
import { ICommonDropdown } from '../../../../../models/common/common-dropdown.interface';

@Component({
  selector: 'lavi-preview-input-controls',
  templateUrl: './preview-input-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./preview-input-controls.component.scss'],
})
export class PreviewInputControlsComponent extends AbstractComponent {
  @Input() Item: IKioskPanelItemsData;
  @Input() IsSaveClick: boolean;
  @Input() BranchCountryCode: string;

  color: any;

  @Output() ControlClick: EventEmitter<void> = new EventEmitter();

  constructor(
    private keyboardVirtualService: KeyboardVirtualService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }
  ngOnInit(): void {
    this.keyboardVirtualService.nextButtonEvent.subscribe((response) => {
      if(('key'+this.Item.itemId) === response){ 

       let element = document.getElementById(response) as HTMLInputElement;
       this.setFocus(element); 

      }
    });
  }

  ngAfterViewInit():void{ 
  }

  setFocus(element: any) {
    if (element) {
      element.focus();
    }
  }

  Init(): void {
    this.Item.isValid = true;
  }

  //#region Virtual KeyBoard

  isInFocus: boolean = false;

  inputFocus = (event: any) => {
    this.isInFocus = true;
    this.keyboardVirtualService.inputFocus.next(event);
    this.keyboardVirtualService.InputValue.pipe(
      takeWhile((resp) => this.isInFocus)
    ).subscribe((response) => {
      if (response.id == event.target.id) { 
        this.Item.answer = response.value;
        this.changeDetectorRef.detectChanges();
      }
    });
  };

  inputFocusOut = (event: any) => {
    this.isInFocus = false;
    this.keyboardVirtualService.isEnableKeyBoard.next(false);
  };

  inputChange = (event: any) => {
    this.keyboardVirtualService.inputChange.next(event);
    this.changeDetectorRef.detectChanges();
  };

  //#endregion

  ValidationPatterns = Validations;
  ValidationMessage: string;
  QuestionType = QuestionType;

  RadioClick(value) {
    this.Item.answer = value;
  }

  PhoneNumberChanged(phoneNumber: string) {
    this.Item.answer = phoneNumber;
    this.Item.isValid = true;
    this.IsSaveClick = true;
  }
  InvalidPhoneNumberChanged(phoneNumber: string) {
    this.ValidationMessage = phoneNumber
      ? ValidationMessages.PhoneNumber.Invalid
      : this.Item.required
      ? ValidationMessages.PhoneNumber.Required
      : '';
    this.Item.answer = phoneNumber;
    this.Item.isValid = false;
  }

  MouseDownClick() {
    this.ControlClick.emit();
  }
}
export const ValidationMessages = {
  Email: {
    Required: 'Email Required.',
    Invalid: 'Invalid Email.',
  },
  PhoneNumber: {
    Required: 'Phone Number Required.',
    Invalid: 'Invalid Phone Number.',
  },
};
