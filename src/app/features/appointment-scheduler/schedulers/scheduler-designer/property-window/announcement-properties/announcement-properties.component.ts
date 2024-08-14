import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Announcement } from '../../../../models/controls/announcement.control';
import { PropertyWindowService } from '../property-window.service';

@Component({
  selector: 'lavi-announcement-properties',
  templateUrl: './announcement-properties.component.html'
})
export class AnnouncementPropertiesComponent extends AbstractComponent {

  @Input() Announcement: Announcement;
  @Output() OnDataChanged: EventEmitter<FormGroup> = new EventEmitter<FormGroup>(); 

  TranslatedTexts: {}
  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  IsTranslated = false;
  modelHeaderText: string;
  updatedItem: string;
  
  constructor(
    private changeDetector: ChangeDetectorRef,
    private propertiesService: PropertyWindowService
  ) {
    super();
    this.InitializeObservables();
  }

  Init() {
    this.subs.sink = this.Announcement.form.valueChanges
      .pipe(debounceTime(300))
      .subscribe((data) => {
        this.OnDataChanged.emit(this.Announcement.form);
      });
  }

  private InitializeObservables() {
    this.OpenDialog$ = this.propertiesService.OpenAnnouncementTranslateDialog$;
    this.TextFormArray$ = this.propertiesService.LabelTextFormArray$;
    this.IsTranslated = this.propertiesService.isTranslated;
  }

  get TranslateTextsObj() {
    return this.propertiesService.TranslatedTexts;
  }

  ChangeColorPicker() {
    this.changeDetector.detectChanges();
  }

  OpenTranslateDialog(text, type) {
    this.modelHeaderText = text;
    this.propertiesService.OpenDialog(this.Announcement, type);
  }

  CloseTranslateDialog(type) {
    this.propertiesService.CloseDialog(type);
  }

  UpdateAnnouncementTranslatedTexts(event) {
    this.UpdateTextsWithoutTranslation(event);
    this.TranslatedTexts = this.IsTranslated ? this.TranslateTextsObj : this.TranslatedTexts;
    this.Announcement.form.get('text').setValue(this.TranslatedTexts);
    this.OnDataChanged.emit(this.Announcement.form);
    this.CloseTranslateDialog('announcement');
    this.IsTranslated = false;
  }

  private UpdateTextsWithoutTranslation(event: any) {
    if (event.length > 0 && (!this.IsTranslated)) {
      const labelTexts = [];
      for (const e of event) {
        labelTexts.push({
          languageId: e.value.languageCode,
          translatedText: e.value.text
        });
      }
      this.TranslatedTexts = this.propertiesService.GetConvertedLangArrayToObject(labelTexts)
    }
  }

  Translate(event) {
    this.propertiesService.TranslateText(event);
  }
}
