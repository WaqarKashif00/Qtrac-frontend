import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { NextUpControl } from '../../../Models/controls/next-up.control';
import { NextUpService } from '../next-up.service';

@Component({
  selector: 'lavi-next-up-property',
  templateUrl: './next-up-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextUpPropertyComponent extends AbstractComponent {
  NextUpControl$: Observable<NextUpControl>;
  FileName = '';
  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  dynamicVariables$:Observable<any>;
  dynamicVariablesSubject:BehaviorSubject<any>;


  constructor(
    private service: NextUpService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
    this.NextUpControl$ = this.service.NextUpControl$;
    this.subs.sink = this.service.BackgroundImgFileName$.subscribe(x => {      
      this.FileName = x;
    });
    this.OpenDialog$ = this.service.OpenTranslateDialog$;
    this.TextFormArray$ = this.service.NextUpTextFormArray$;
    this.dynamicVariables$ =  this.service.dynamicVariables$;
    this.dynamicVariablesSubject = new BehaviorSubject<any>([]);
    this.dynamicVariables$.subscribe((data)=> {
      if(data) {
        this.dynamicVariablesSubject.next(data)
      }
    })

  }


  SetFileURL(event) {
    this.service.SetFileUrl(event);
  }

  Remove() {
    this.service.RemoveBackGroundImage();
    this.changeDetector.detectChanges();
  }

  OpenTranslateDialog(){
    this.service.OpenDialog();
  }

  CloseTranslateDialog(){
    this.service.CloseDialog();
  }

  Translate(event){
    this.service.TranslateText(event);
  }

  UpdateTranslatedTextsInForm(event){
    this.service.UpdateTranslatedTextsInForm(event);
  }

  getChoiceLabel = (choice: string) => {
    const displayText = (this.dynamicVariablesSubject.value)?.find((variable: any) => variable.shortName == choice)?.fieldName;
    return `%${displayText}%`;
  }


  findChoices = (searchText: string):any => {
    const choices = this.dynamicVariablesSubject.value?.filter((variables) =>
      variables.shortName.toLowerCase().includes(searchText.toLowerCase())
    )?.map((x) => {
      return x.shortName;
    });
    return choices;
  }


}
