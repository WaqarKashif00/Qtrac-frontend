import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { NowCallingControl } from '../../../Models/controls/now-calling.control';
import { IMonitorExecutionQueue } from '../../../Models/monitor-execution-queue.interface';
import { NowCallingService } from '../now-calling.service';

@Component({
  selector: 'lavi-now-calling-property',
  templateUrl: './now-calling-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowCallingPropertyComponent extends AbstractComponent {
  NowCallingControl$: Observable<NowCallingControl>;
  FileName = '';
  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  dynamicVariables$:Observable<any>;
  dynamicVariablesSubject:BehaviorSubject<any>;  

  constructor(
    private service: NowCallingService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
    this.NowCallingControl$ = this.service.NowCallingControl$;
    this.subs.sink = this.service.BackgroundImgFileName$.subscribe(x => {
      this.FileName = x;
    });
    this.OpenDialog$ = this.service.OpenTranslateDialog$;
    this.TextFormArray$ = this.service.NowCallingTextFormArray$;
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
    this.service.RemoveBackgroundImage();
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
