import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import Keyboard from 'simple-keyboard/build/components/Keyboard';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';

@Injectable({
  providedIn: 'root',
})
export class KeyboardVirtualService extends AbstractComponentService{
 
  inputFocus = new Subject<any>();
  inputChange =  new Subject<any>();
  isEnableKeyBoard = new BehaviorSubject<boolean>(false);
  InputValue = new BehaviorSubject<any>('');
  nextButtonEvent = new Subject<any>();

  constructor() {
    super();
  }

  updateInputValue(key: String, value: String){
    var obj = {
      id: key,
      value: value,
    };
    this.InputValue.next(obj);
  }

  scrollToView(elementId: any) { 
    let element = (document.getElementsByClassName(elementId) )[0]as HTMLInputElement;
    if(element)
      element.scrollIntoView(true);
  }

  hideCurser(elementId: string){
    let element: HTMLInputElement =  document.querySelector(`#${elementId}`) as HTMLInputElement;  
    if(element)
      element.classList.add('hide-cursor');
  }

  showCurser(elementId: string){
    let element: HTMLInputElement =  document.querySelector(`#${elementId}`) as HTMLInputElement;  
    if(element)
      element.classList.remove('hide-cursor');
  }

  setInputCaretPosition(keyboard:Keyboard, elementId: string, isShowCurser: boolean ) { 
    let elem: HTMLInputElement =  document.querySelector(`#${elementId}`) as HTMLInputElement;
    if((keyboard.caretPosition == null || keyboard.caretPositionEnd == null) && elem.selectionStart != null && elem.selectionEnd != null ){
      keyboard.caretPosition = elem.selectionStart;
      keyboard.caretPositionEnd = elem.selectionEnd;
     }
    else{
      if(elem.selectionStart)
        elem.selectionStart = keyboard.caretPosition;
      if(elem.selectionEnd)
        elem.selectionEnd = keyboard.caretPositionEnd;
     }
    if(isShowCurser){
      this.showCurser(elementId);
    }
    else{
      this.hideCurser(elementId);
    }
  }; 

  // consoleCurserPosition( eventName: string, elementId: string, keyboard: Keyboard){
  //   let element: HTMLInputElement =  document.querySelector(`#${elementId}`) as HTMLInputElement;
  //   console.log('Event Name', eventName);
  //   console.log('element.selectionStart', element.selectionStart);
  //   // console.log('element.selectionEnd', element.selectionEnd);
  //   console.log('keyboard.caretPosition', keyboard.caretPosition);
  //   // console.log('keyboard.caretPositionEnd', keyboard.caretPositionEnd);
  // }

}
