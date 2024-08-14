import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { getTimeStampSplitedFileName, updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { TranslateService } from '../../../../../../../core/services/translate.service';
import { NowCallingControl } from '../../Models/controls/now-calling.control';
import { IMoveEvent } from '../../Models/move-event.interface';
import { MonitorLayoutService } from '../../monitor-layout.service';

@Injectable()
export class NowCallingService extends AbstractComponentService {

  private NowCallingControlSubject: BehaviorSubject<NowCallingControl>;
  NowCallingControl$: Observable<NowCallingControl>;
  NowCallingControl: NowCallingControl;
  private BackgroundImgFileNameSubject: BehaviorSubject<string>;
  BackgroundImgFileName$: Observable<string>;
  private NowCallingTextFormArraySubject: BehaviorSubject<FormArray>;
  NowCallingTextFormArray$: Observable<FormArray>;
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
    this.NowCallingControlSubject = new BehaviorSubject<NowCallingControl>(
      null
    );
    this.NowCallingControl$ = this.NowCallingControlSubject.asObservable();
    this.BackgroundImgFileNameSubject = new BehaviorSubject<string>('');
    this.BackgroundImgFileName$ = this.BackgroundImgFileNameSubject.asObservable();
    this.NowCallingTextFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.NowCallingTextFormArray$ = this.NowCallingTextFormArraySubject.asObservable();
    this.OpenTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenTranslateDialog$ = this.OpenTranslateDialogSubject.asObservable();
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$;
    this.dynamicVariables$ = this.layoutService.DynamicVariables$ 

  }

  private SubscribeObservables() {
    this.subs.sink = this.layoutService.PageData$.subscribe((x) => {
      this.NowCallingControl = x.nowCallingControl;
      this.SendNowCallingSubjectValue();
      this.SubscribeNowCallingValueChanges();
    });
    this.subs.sink = this.layoutService.Languages$.subscribe(lang =>{
      this.Languages = lang;
    });
  }

  private SubscribeNowCallingValueChanges() {
    this.subs.sink = this.NowCallingControl.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(
        this.NowCallingControl,
        this.NowCallingControl.form
      );
      this.SendNowCallingSubjectValue();
    });
    this.UpdateBackgroundImgFileName();
  }

  private UpdateBackgroundImgFileName() {
    this.BackgroundImgFileNameSubject.next('');
    if (
      this.NowCallingControl.src &&
      this.NowCallingControl.src.includes('://')
    ) {
      this.BackgroundImgFileNameSubject.next(
        getTimeStampSplitedFileName(this.NowCallingControl.src.split('//')[1].split('/')[2])
      );
    }
  }

  SetFileUrl(event) {
    if (event.target.files && event.target.files[0]) {
      if (this.formService.IsValidImageFile(event.target.files[0])) {
        const reader = new FileReader();
        reader.onload = (event1: any) => {
          this.UpdateNowCallingData(
            event1.target.result,
            event.target.files[0]
          );
        };
        reader.readAsDataURL(event.target.files[0]);
        this.BackgroundImgFileNameSubject.next(event.target.files[0].name);
      }
    }
  }

  UpdateNowCallingData(url: string, file: File) {
    if (url) {
      this.NowCallingControl.form.patchValue({
        src: url,
        backgroundImage: file,
      });
    }
  }

  RemoveBackgroundImage() {
    this.NowCallingControl.form.patchValue({
      src: null,
      backgroundImage: null,
    });
    this.BackgroundImgFileNameSubject.next('');
  }

  SendNowCallingSubjectValue() {
    this.NowCallingControlSubject.next(this.NowCallingControl);
  }

  ResizeStop(event: IResizeEvent) {
    this.NowCallingControl.form.controls.width.setValue(event.size.width);
    this.NowCallingControl.form.controls.height.setValue(event.size.height);
  }

  MoveEnd(event: IMoveEvent) {
    this.NowCallingControl.form.controls.left.setValue(event.x);
    this.NowCallingControl.form.controls.top.setValue(event.y);
  }
  OnClick() {
    this.layoutService.OnNowCallingControlClick()
  }
  OpenDialog(){
    this.TranslatedTexts = this.NowCallingControl.text;
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
    this.NowCallingTextFormArraySubject.next(this.formBuilder.array([]));
    const translatedTexts = this.TranslatedTexts;
    if (this.Languages) {
      this.Languages.forEach(ele => {
        this.NowCallingTextFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          text: translatedTexts[ele.languageCode] || ''
        }));
      });
    }
  }

  UpdateTranslatedTextsInForm(event){
    this.UpdateTextsWithoutTranslation(event);
    this.NowCallingControl.text = this.TranslatedTexts;
    this.NowCallingControl.form.get('text').setValue(this.TranslatedTexts);
    this.SendNowCallingSubjectValue();
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
