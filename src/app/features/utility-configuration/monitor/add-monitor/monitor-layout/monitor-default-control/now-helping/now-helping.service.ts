import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { getTimeStampSplitedFileName, updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { TranslateService } from '../../../../../../../core/services/translate.service';
import { NowHelpingControl } from '../../Models/controls/now-helping.control';
import { IMoveEvent } from '../../Models/move-event.interface';
import { MonitorLayoutService } from '../../monitor-layout.service';

@Injectable()
export class NowHelpingService extends AbstractComponentService {

  private NowHelpingControlSubject: BehaviorSubject<NowHelpingControl>;
  NowHelpingControl$: Observable<NowHelpingControl>;
  NowHelpingControl: NowHelpingControl;
  private BackgroundImgFileNameSubject: BehaviorSubject<string>;
  BackgroundImgFileName$: Observable<string>;
  private NowHelpingTextFormArraySubject: BehaviorSubject<FormArray>;
  NowCallingTextFormArray$: Observable<FormArray>;
  private OpenTranslateDialogSubject: BehaviorSubject<boolean>;
  OpenTranslateDialog$: Observable<boolean>;
  SelectedLanguage$: Observable<string>;
  dynamicVariables$:Observable<any>;

  Languages = [];
  TranslatedTexts = {};
  isTranslated = false;

  constructor(private readonly layoutService: MonitorLayoutService, private readonly translateService: TranslateService) {
    super();
    this.InitializeSubjects();
    this.SubscribeObservables();
  }

  private InitializeSubjects() {
    this.NowHelpingControlSubject = new BehaviorSubject<NowHelpingControl>(
      null
    );
    this.NowHelpingControl$ = this.NowHelpingControlSubject.asObservable();
    this.BackgroundImgFileNameSubject = new BehaviorSubject<string>('');
    this.BackgroundImgFileName$ = this.BackgroundImgFileNameSubject.asObservable();
    this.NowHelpingTextFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.NowCallingTextFormArray$ = this.NowHelpingTextFormArraySubject.asObservable();
    this.OpenTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenTranslateDialog$ = this.OpenTranslateDialogSubject.asObservable();
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$;
    this.dynamicVariables$ = this.layoutService.DynamicVariables$ 
  }

  private SubscribeObservables() {
    this.subs.sink = this.layoutService.PageData$.subscribe((x) => {
      this.NowHelpingControl = x.nowHelpingControl;
      this.SendNowHelpingSubjectValue();
      this.SubscribeNowHelpingFormValueChanges();
    });
    this.subs.sink = this.layoutService.Languages$.subscribe(lang => {
      this.Languages = lang;
    });
  }

  private SubscribeNowHelpingFormValueChanges() {
    this.subs.sink = this.NowHelpingControl.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(
        this.NowHelpingControl,
        this.NowHelpingControl.form
      );
      this.SendNowHelpingSubjectValue();
    });
    this.UpdateBackgroundImgFileName();
  }

  private UpdateBackgroundImgFileName() {
    this.BackgroundImgFileNameSubject.next('');
    if (
      this.NowHelpingControl.src &&
      this.NowHelpingControl.src.includes('://')
    ) {
      this.BackgroundImgFileNameSubject.next(
        getTimeStampSplitedFileName(this.NowHelpingControl.src.split('//')[1].split('/')[2])
      );
    }
  }

  SetFileUrl(event) {
    if (event.target.files && event.target.files[0]) {
      if (this.formService.IsValidImageFile(event.target.files[0])) {
        const reader = new FileReader();
        reader.onload = (event1: any) => {
          this.UpdateNowHelpingData(
            event1.target.result,
            event.target.files[0]
          );
        };
        reader.readAsDataURL(event.target.files[0]);
        this.BackgroundImgFileNameSubject.next(event.target.files[0].name);
      }
    }
  }

  UpdateNowHelpingData(url: string, file: File) {
    if (url) {
      this.NowHelpingControl.form.patchValue({
        src: url,
        backgroundImage: file,
      });
    }
  }

  RemoveBackgroundImage() {
    this.NowHelpingControl.form.patchValue({
      src: null,
      backgroundImage: null,
    });
    this.BackgroundImgFileNameSubject.next('');
  }

  SendNowHelpingSubjectValue() {
    this.NowHelpingControlSubject.next(this.NowHelpingControl);
  }

  ResizeStop(event: IResizeEvent) {
    this.NowHelpingControl.form.controls.width.setValue(event.size.width);
    this.NowHelpingControl.form.controls.height.setValue(event.size.height);
  }

  MoveEnd(event: IMoveEvent) {
    this.NowHelpingControl.form.controls.left.setValue(event.x);
    this.NowHelpingControl.form.controls.top.setValue(event.y);
  }
  OnClick() {
   this.layoutService.OnNowHelpingControlClick()
  }
  OpenDialog(){
    this.TranslatedTexts = this.NowHelpingControl.text;
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
    this.NowHelpingTextFormArraySubject.next(this.formBuilder.array([]));
    const translatedTexts = this.TranslatedTexts;
    if (this.Languages) {
      this.Languages.forEach(ele => {
        this.NowHelpingTextFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          text: translatedTexts[ele.languageCode] || ''
        }));
      });
    }
  }

  UpdateTranslatedTextsInForm(event){
    this.UpdateTextsWithoutTranslation(event);
    this.NowHelpingControl.text = this.TranslatedTexts;
    this.NowHelpingControl.form.get('text').setValue(this.TranslatedTexts);
    this.SendNowHelpingSubjectValue();
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
