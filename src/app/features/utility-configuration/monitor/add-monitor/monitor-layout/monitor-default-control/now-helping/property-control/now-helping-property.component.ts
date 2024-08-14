import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { NowHelpingControl } from '../../../Models/controls/now-helping.control';
import { MonitorPropertyService } from '../../../monitor-template/monitor-property/monitor-property.service';
import { NowHelpingService } from '../now-helping.service';

@Component({
  selector: 'lavi-now-helping-property',
  templateUrl: './now-helping-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MonitorPropertyService],
})
export class NowHelpingPropertyComponent extends AbstractComponent {
  NowHelpingControl$: Observable<NowHelpingControl>;
  FileName = '';
  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  dynamicVariables$:Observable<any>;
  dynamicVariablesSubject:BehaviorSubject<any>;
  
  constructor(
    private service: NowHelpingService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
    this.NowHelpingControl$ = this.service.NowHelpingControl$;
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
  Translate(event){
    this.service.TranslateText(event);
  }

  UpdateTranslatedTextsInForm(event){
    this.service.UpdateTranslatedTextsInForm(event);
  }

}
