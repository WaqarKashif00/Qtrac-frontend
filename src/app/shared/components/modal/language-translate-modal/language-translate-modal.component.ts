import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-language-translate-modal',
  templateUrl: './language-translate-modal.component.html',
  styleUrls: ['./language-translate-modal.component.scss']
})
export class LanguageTranslateModalComponent extends AbstractComponent {
  @Input() OpenDialog: boolean;
  @Input() TextFormArray: FormArray = this.formBuilder.array([]);
  @Input() Title: string;
  @Input() MaxLength = 50;
  @Input() ConditionsName;
  @Input() comingFrom: string;

  @Output() CloseTranslateTextDialog = new EventEmitter<void>();
  @Output() TranslateText = new EventEmitter<string>();
  @Output() Save = new EventEmitter<any>();
  @Output() SaveAnnouncementText = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder) {

    super();

  }
  Init(): void {
  }
  CloseTranslateDialog() {
    this.CloseTranslateTextDialog.emit();
  }

  Translate(text: string) {
    this.TranslateText.emit(text);
  }

  SaveTranslatedTexts(event) {
   
    if (this.comingFrom === 'announcement') {
      this.SaveAnnouncementText.emit(event.length > 0 ? event : []);
    } else {
      this.Save.emit(event.length > 0 ? event : []);
    }

  }

  findChoices = (searchText: string) => {
    const choices = this.ConditionsName?.filter(variables =>
      variables.shortName.toLowerCase().includes(searchText.toLowerCase()))?.map(x => {
        return x.shortName;
      });
    return choices;
  }

  getChoiceLabel = (choice: string) => {
    const displayText = (this.ConditionsName as any)?.find((variable: any) => variable.shortName === choice)?.fieldName;
    return `%${displayText}%`;
  }
}
