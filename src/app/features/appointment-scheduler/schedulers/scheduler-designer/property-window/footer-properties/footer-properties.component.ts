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
import { FooterProperties } from 'src/app/features/appointment-scheduler/models/controls/footer.control';
import { PropertyWindowService } from '../property-window.service';

@Component({
  selector: 'lavi-scheduler-footer-properties',
  templateUrl: './footer-properties.component.html'
})
export class FooterPropertiesComponent extends AbstractComponent {

  @Input() FooterPropertiesPanel: FooterProperties;
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
    this.subs.sink = this.FooterPropertiesPanel.form.valueChanges
      .pipe(debounceTime(300))
      .subscribe((data) => {
        this.OnDataChanged.emit(this.FooterPropertiesPanel.form);
      });
  }

  private InitializeObservables() {
    this.OpenDialog$ = this.propertiesService.OpenFooterTranslateDialog$;
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
    this.propertiesService.OpenDialog(this.FooterPropertiesPanel, type);
  }

  CloseTranslateDialog(type) {
    this.propertiesService.CloseDialog(type);
  }

  UpdateFooterTranslatedTexts(event) {
    this.UpdateTextsWithoutTranslation(event);
    this.TranslatedTexts = this.IsTranslated ? this.TranslateTextsObj : this.TranslatedTexts;
    this.FooterPropertiesPanel.form.get('text').setValue(this.TranslatedTexts);
    this.OnDataChanged.emit(this.FooterPropertiesPanel.form);
    this.CloseTranslateDialog('footer');
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
