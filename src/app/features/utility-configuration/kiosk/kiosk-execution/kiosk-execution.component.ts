import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import Keyboard from 'simple-keyboard';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { KeyboardVirtualService } from '../keyboard-virtual.service';
import { IKioskPreviewData } from '../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';
import { IPage } from '../kiosk-add/kiosk-layout/Models/pages.interface';
import { KioskExecutionService } from './kiosk-execution.service'; 

@Component({
  selector: 'lavi-kiosk-execution',
  templateUrl: './kiosk-execution.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [KioskExecutionService],
})
export class KioskExecutionComponent extends AbstractComponent {
  kioskData$: Observable<IKioskPreviewData>;
  Page$: Observable<IPage>;
  IsOpened$: Observable<boolean>;
  LanguageList$: Observable<ILanguageDropdownList[]>;
  IsKioskDeviceStandByMode$: Observable<boolean>;
  showBackButton$: Observable<boolean>;
  SelectedValue: ILanguageDropdownList;
  ExecutionWaitingTime$:Observable<number>;
  ExecutionWaitingTime : number;
  IsKeyBoardAllowed : boolean;
  userActivity;
  BranchCountryCode:string;
  userInactive: Subject<any> = new Subject();

  get LanguageId(){
    return this.service.CurrentLanguageId;
  }
  get DefaultLanguageId() {
    return this.service.DefaultLanguageId;
  }

  get ShutDownMessage() {
    return this.service.browserStorageService.KioskShutDownDetails?.message;
  }

  get IsLanguageModalVisible$() {
    return combineLatest(
      this.IsOpened$,
      this.IsKioskDeviceStandByMode$,
      (IsOpened, IsKioskDeviceStandByMode) =>
        IsOpened && !IsKioskDeviceStandByMode
    );
  }

  constructor(private service: KioskExecutionService,
    private keyboardVirtualService: KeyboardVirtualService,
    private changeDetector: ChangeDetectorRef,) {
    super();
    this.kioskData$ = this.service.KioskLayoutData$;
    this.Page$ = this.service.Page$;
    this.IsOpened$ = this.service.IsOpened$;
    this.IsKioskDeviceStandByMode$ = this.service.IsKioskDeviceStandByMode$;
    this.showBackButton$ = this.service.showBackButton$;
    this.LanguageList$ = this.service.LanguageList$;
    this.ExecutionWaitingTime$ = this.service.ExecutionWaitingTime$;
    this.subs.sink = this.ExecutionWaitingTime$.subscribe((waitingTime) => {
      this.ExecutionWaitingTime = waitingTime;
    });
    
    this.subs.sink = this.service.IsKeyBoardAllowed$.subscribe((IsKeyBoardAllowed) => {

      this.IsKeyBoardAllowed = IsKeyBoardAllowed;
    });
 
  this.subs.sink = this.service.Branch$.subscribe((branch) => {
    this.BranchCountryCode = branch?.countryCode;
  });
    this.setTimeoutIfNotFirstPage();
    this.subs.sink = this.userInactive.subscribe(() => {
      if (!this.service.Page?.IsLanguagePage && !this.service.Page?.IsThankYouPage)
        window.location.reload();
    });
  }

  ngOnInit(): void {
    this.keyboardVirtualService.inputFocus.subscribe((response) => {
      this.onInputFocus(response);
    });

    this.keyboardVirtualService.inputChange.subscribe((response) => {
      this.onInputChange(response);
    });

    this.keyboardVirtualService.isEnableKeyBoard.subscribe((response) => {
      this.isEnableKeyboard = response;
     this.changeDetector.detectChanges();
    });

  }

   
  //#region Simple-Keyboard

  keyboard: Keyboard;
  inputName = 'firstName';

  isEnableKeyboard: boolean = false;
  isNumericKeyBoard: boolean = false;
  isShiftEnable: boolean = false;
  isShiftUsed: boolean = false;

  inputs: { [key: string]: any } = {
    firstName: '',
    //lastName: '',
    // mobile: '',
  };

  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      debug: false, // Enable to debug keyboard 
      inputName: this.inputName,
      onChange: (input) => this.onChange(input),
      onKeyPress: (button: any) => this.onKeyPress(button),
      onKeyReleased: (button : any) => this.keyReleased(button),
      tabCharOnTab: false,
      preventMouseDownDefault: true, // If you want to keep focus on input
      disableCaretPositioning: false, //Disables caret positioning, meaning that characters will always be added/removed at the end of the string.
      disableButtonHold: true,  //this option disables the button hold action
      syncInstanceInputs: true, // this option synchronizes the internal input of every simple-keyboard instance.
      layout: {
        default: [
          '1 2 3 4 5 6 7 8 9 0 {bksp}',
          'q w e r t y u i o p',
          '{lock} a s d f g h j k l',
          '{shift} z x c v b n m . {next}',
          '@ {space} .com',
        ],
        shift: [
          '! # _ - ? {bksp}',
          'Q W E R T Y U I O P',
          '{lock} A S D F G H J K L',
          '{shift} Z X C V B N M . {next}',
          '@ {space} .com',
        ],
        numPad: ['1 2 3', '4 5 6', '7 8 9', '{bksp} 0 {next}'],
      },
      display: {
        '{bksp}': 'backspace',
        '{shift}': 'Shift',
        '{lock}': 'Caps',
        '{next}': 'Next',
        '{space}': ' ',
      },
      buttonTheme: [
        {
          class: 'sk-extraButton',
          buttons: '@ .com', 
        }
      ],
    });

    /**
     * Since we have default values for our inputs,
     * we must sync them with simple-keyboard
     */
    this.keyboard.replaceInput(this.inputs);
  }

  onInputFocus = (event: any) => {
    this.inputName = event.target.id;
    this.inputs[event.target.id] = event.target.value;

    this.enableKeyboard(true);

    this.keyboard.setOptions({
      inputName: event.target.id,
    });
    if (event.target.tagName === 'INPUT' && event.target.type === 'number' || event.target.type === 'tel' ) {
      this.keyboard.setOptions({
        layoutName: 'numPad',
        buttonTheme: [
          {
            class: 'hg-standardBtn',
            buttons: '{bksp} {next}',
          },
          // {
          //   class: 'col-md-3',
          //   buttons: '1 2 3 4 5 6 7 8 9 {bksp} 0 {next}',
          // },
        ],
      });
      this.isNumericKeyBoard = true;
    } else {
      this.keyboard.setOptions({
        layoutName: 'default', buttonTheme: [
          {
          class: 'hg-functionBtn',
          buttons: '{bksp} {next}',
          },
          {
            class: 'sk-extraButton',
            buttons: '@ .com', 
          }, 
        ],
      });
      this.isNumericKeyBoard = false;
    }
    //Scroll to View Element
    this.keyboardVirtualService.scrollToView(event.target.id);

    this.enableKeyboard(true);
  };

  // setInputCaretPosition = (elem: any, pos: number) => {
  //   console.log('Element ' + elem);
  //   console.log('Element elem.setSelectionRange' + elem.setSelectionRange);

  //   if (elem.setSelectionRange) {
  //     elem.focus();
  //     elem.setSelectionRange(pos, pos);
  //   }

  //   console.log('Element Done');
  // };

  onInputChange = (event: any) => { 
    this.keyboard.setInput(event.target.value, event.target.id);
    this.onChange(event.target.value);
    this.changeDetector.detectChanges();
  };

  onChange = (input: string) => { 
    this.inputs[this.inputName] = input; 
    this.keyboardVirtualService.updateInputValue(this.inputName, input);  
  };

  onKeyPress = (button: string) => {
    /*** If you want to handle the shift and caps lock buttons ***/
    if (button != '{shift}' && this.isShiftEnable ) {
      this.isShiftEnable = false;
      this.SetDefaultLayout();
    }
    else if (button === '{shift}') this.handleShift(true);
    else if (button === '{lock}') this.handleShift(false);
    else if (button === '{next}') this.handleNext();
    else{
      this.keyboardVirtualService.setInputCaretPosition(this.keyboard, this.inputName, false);
    }
  };

  keyReleased = (button : any) =>{
    this.keyboardVirtualService.setInputCaretPosition(this.keyboard, this.inputName, true);
  }

  handleShift = (isShift: boolean) => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

    this.keyboard.setOptions({
      layoutName: shiftToggle,
    });
    if (isShift)
      this.isShiftEnable = currentLayout === 'default' ? true : false;
  };

  SetDefaultLayout = () => {
    this.keyboard.setOptions({
      layoutName: 'default',
    });
  };

  handleNext = () => {
    let options = this.keyboard.getOptions();
    if (options.display?.['{next}'] === 'Done') {
      this.enableKeyboard(false);
    } else {
      this.focusNextElement();
    }
  };

  focusNextElement = () => {
    let nextInputElement: string;
    let elementFoundById: boolean = false;
    let elementsList : NodeListOf<HTMLEmbedElement> = document.querySelectorAll('input, textarea');
    if (elementsList == null) return null;

    for (let i = 0; i < elementsList.length; i++) {
      if ( elementsList[i].type === 'text' ||  elementsList[i].type === 'number' ||  elementsList[i].type === 'tel' ||  elementsList[i].type === 'textarea' ) {
        if (elementFoundById) {
          nextInputElement = elementsList[i].id;
          break;
        }
        if (elementsList[i].id === this.inputName) {
          elementFoundById = true;
        }
      }
    }

    this.keyboardVirtualService.nextButtonEvent.next(nextInputElement);

  };

  updateKeyBoardDisplay = (isDone: Boolean) => {
    if (isDone) {
      this.keyboard.setOptions({
        display: {
          '{bksp}': 'backspace',
          '{shift}': 'Shift',
          '{lock}': 'Caps',
          '{next}': 'Done',
          '{space}': ' ',
        },
      });
    } else {
      this.keyboard.setOptions({
        display: {
          '{bksp}': 'backspace',
          '{shift}': 'Shift',
          '{lock}': 'Caps',
          '{next}': 'Next',
          '{space}': ' ',
        },
      });
    }
  };

  enableKeyboard = (isEnable: boolean) => {
    
    //If Allow Touch Screen Keyboard For Users from Designer Screen
    if(this.IsKeyBoardAllowed){
      this.isEnableKeyboard = isEnable;
      this.changeDetector.detectChanges();
      if(isEnable){
        let nextElement: boolean = this.IsHaveNextInputElement(this.inputName);
        if (nextElement == null || !nextElement) {
          this.updateKeyBoardDisplay(true);
        } else {
          this.updateKeyBoardDisplay(false);
        }
      }
    }
  };

  IsHaveNextInputElement = (inputId: string) => {
    let isNextInputElement: boolean = false;
    let elementFoundById: boolean = false;
    let elementsList : NodeListOf<HTMLEmbedElement> = document.querySelectorAll('input, textarea');
    if (elementsList == null) return null;

    for (let i = 0; i < elementsList.length; i++) {
      if (
        elementsList[i].type === 'text' ||
        elementsList[i].type === 'number'||
        elementsList[i].type === 'tel'||
        elementsList[i].type === 'textarea'
      ) {
        if (elementFoundById) {
          isNextInputElement = true;
          break;
        }
        if (elementsList[i].id === inputId) {
          elementFoundById = true;
        }
      }
    }
    return isNextInputElement;
  };

  //#endregion

  


  setTimeoutIfNotFirstPage() {
    this.userActivity = setTimeout(() => {
      if (this.IsFirstPage()) {
        this.checkServiceActiveOrNot();
        return;
      }
        this.userInactive.next(undefined);
    }, (this.ExecutionWaitingTime*1000));
  }


  checkServiceActiveOrNot() {
    setTimeout(() => {
      if(!this.service.AllServicesOffLineOrNot() && this.service.Page?.IsOffLinePage) {
        window.location.reload();
        return;
      }
      if(this.service.AllServicesOffLineOrNot() && !this.service.Page?.IsOffLinePage) {
        window.location.reload();
        return;
      }
        this.checkServiceActiveOrNot();
    }, (this.ExecutionWaitingTime*1000));
  }

  private IsFirstPage(): boolean {
    const keys = Object.keys(this.service.PageNames);
    return this.service.PageNames[keys[this.service.CurrentPageIndex]] === this.service.HomePageName;
  }

  @HostListener('window:mousemove')
  @HostListener('window:resize')
  @HostListener('document:keydown')
  @HostListener('document:touchstart')
  @HostListener('document:touchend')
  @HostListener('window:scroll')
  refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeoutIfNotFirstPage();
  }

  Init() {
    this.service.InitAzureSignalRService();
    this.service.CheckIsKioskInStandBy();
    this.service.SetTimerToNavigateBackAfterShutDownHour();
  }

  ShowNextPage(data) {
    this.service.ShowNextPage(data);
  }

  HaveAppointment(appointmentId: string): void {
    this.service.HaveAppointment(appointmentId);
  }

  ExitButton(){
    this.service.OnExitButton();
  }

  BackButton(){
    this.service.OnClickBackButton();
  }


  /* #endregion */
}
