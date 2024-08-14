import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { getTimeStampSplitedFileName, updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { TranslateService } from '../../../../../../../core/services/translate.service';
import { NextUpControl } from '../../Models/controls/next-up.control';
import { IMoveEvent } from '../../Models/move-event.interface';
import { MonitorLayoutService } from '../../monitor-layout.service';

@Injectable()
export class NextUpService extends AbstractComponentService {

  private NextUpControlSubject: BehaviorSubject<NextUpControl>;
  NextUpControl$: Observable<NextUpControl>;
  NextUpControl: NextUpControl;
  private BackgroundImgFileNameSubject: BehaviorSubject<string>;
  BackgroundImgFileName$: Observable<string>;
  private NextUpTextFormArraySubject: BehaviorSubject<FormArray>;
  NextUpTextFormArray$: Observable<FormArray>;
  private OpenTranslateDialogSubject: BehaviorSubject<boolean>;
  OpenTranslateDialog$: Observable<boolean>;
  SelectedLanguage$: Observable<string>;
  dynamicVariables$:Observable<any>;


  Languages = [];
  TranslatedTexts = {};
  isTranslated = false;

  constructor(private layoutService: MonitorLayoutService, private translateService: TranslateService) {
    super();
    this.InitializeSubjects();
    this.SubscribeObservables();
  }

  private InitializeSubjects() {
    this.NextUpControlSubject = new BehaviorSubject<NextUpControl>(null);
    this.NextUpControl$ = this.NextUpControlSubject.asObservable();
    this.BackgroundImgFileNameSubject = new BehaviorSubject<string>('');
    this.BackgroundImgFileName$ = this.BackgroundImgFileNameSubject.asObservable();
    this.NextUpTextFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.NextUpTextFormArray$ = this.NextUpTextFormArraySubject.asObservable();
    this.OpenTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenTranslateDialog$ = this.OpenTranslateDialogSubject.asObservable();
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$;
    this.dynamicVariables$ = this.layoutService.DynamicVariables$ 

  }

  private SubscribeObservables() {
    this.subs.sink = this.layoutService.PageData$.subscribe((x) => {
      this.NextUpControl = x.nextUpControl;
      this.SendNextUpSubjectValue();
      this.SubscribeNextUpControlsFormValueChanges();
    });
    this.subs.sink = this.layoutService.Languages$.subscribe(lang => {
      this.Languages = lang;
    });
  }

  private SubscribeNextUpControlsFormValueChanges() {
    this.subs.sink = this.NextUpControl.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.NextUpControl, this.NextUpControl.form);
      this.SendNextUpSubjectValue();
    });
    this.UpdateBackgroundImgFileName();
  }

  private UpdateBackgroundImgFileName() {
    this.BackgroundImgFileNameSubject.next('');
    if (this.NextUpControl.src && this.NextUpControl.src.includes('://')) {
      this.BackgroundImgFileNameSubject.next(
        getTimeStampSplitedFileName(this.NextUpControl.src.split('//')[1].split('/')[2])
      );
    }
  }

  SetFileUrl(event) {
    if (event.target.files && event.target.files[0]) {
      if (this.formService.IsValidImageFile(event.target.files[0])) {
        const reader = new FileReader();
        reader.onload = (event1: any) => {
          this.UpdateNextUpData(event1.target.result, event.target.files[0]);
        };
        reader.readAsDataURL(event.target.files[0]);
        this.BackgroundImgFileNameSubject.next(event.target.files[0].name);
      }
    }
  }

  UpdateNextUpData(url: string, file: File) {
    if (url) {
      this.NextUpControl.form.patchValue({
        src: url,
        backgroundImage: file,
      });
    }
  }

  RemoveBackGroundImage() {
    this.NextUpControl.form.patchValue({
      src: null,
      backgroundImage: null,
    });
    this.BackgroundImgFileNameSubject.next('');
  }

  SendNextUpSubjectValue() {
    this.NextUpControlSubject.next(this.NextUpControl);
  }

  ResizeStop(event: IResizeEvent) {
    this.NextUpControl.form.controls.width.setValue(event.size.width);
    this.NextUpControl.form.controls.height.setValue(event.size.height);
  }

  MoveEnd(event: IMoveEvent) {
    this.NextUpControl.form.controls.left.setValue(event.x);
    this.NextUpControl.form.controls.top.setValue(event.y);
  }
  OnClick() {
    this.layoutService.OnNextUpControlClick()
  }
  OpenDialog(){
    this.TranslatedTexts = this.NextUpControl.text;
    this.SetTextFormArray();
    this.OpenTranslateDialogSubject.next(true);
  }

  CloseDialog(){
    this.OpenTranslateDialogSubject.next(false);

  }

  TranslateText(textToTranslate: string) {
    if (textToTranslate) {
      this.subs.sink = this.translateService
        .GetTranslatedTexts(textToTranslate)
        .subscribe((TranslateResponses) => {
          if (TranslateResponses && TranslateResponses.length !== 0) {
            this.isTranslated = true;
            this.TranslatedTexts = this.layoutService.ConvertTranslatedLanguageArrayToObject(TranslateResponses);
            this.SetTextFormArray();
          }
        });
    }
  }

  private SetTextFormArray() {
    this.NextUpTextFormArraySubject.next(this.formBuilder.array([]));
    const translatedTexts = this.TranslatedTexts;
    if (this.Languages) {
      this.Languages.forEach(ele => {
        this.NextUpTextFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          text: translatedTexts[ele.languageCode] || ''
        }));
      });
    }
  }

  UpdateTranslatedTextsInForm(event){
    this.UpdateTextsWithoutTranslation(event);
    this.NextUpControl.text = this.TranslatedTexts;
    this.NextUpControl.form.get('text').setValue(this.TranslatedTexts);
    this.SendNextUpSubjectValue();
    this.CloseDialog();
    this.isTranslated = false;
  }

  private UpdateTextsWithoutTranslation(event: any) {
    if (event.length > 0 && (!this.isTranslated)) {
      const headerTexts = [];
      for (const e of event) {
        headerTexts.push({
          languageId: e.value.languageCode,
          translatedText: e.value.text
        });
      }
      this.TranslatedTexts = this.layoutService.ConvertTranslatedLanguageArrayToObject(headerTexts);
    }
  }
}
