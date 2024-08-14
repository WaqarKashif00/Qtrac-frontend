import { FormBuilder } from '@angular/forms';
import { Language } from 'src/app/models/enums/language-enum';
import { Control } from './control';

export class ServiceBoxControl extends Control {
  text: any;
  selectedLanguageId: string;
  questionId: string;
  questionSetId: string;
  selected: boolean;
  isVisible: boolean;
  kioskSelected: boolean;
  icons: object;
  constructor(
    formBuilder: FormBuilder,
    text: string,
    backgroundColor: string,
    color: string,
    questionId: string,
    questionSetId: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    isVisible: boolean = true,
    selected: boolean = true,
    icons: object,
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      text,
      backgroundColor,
      color,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      isVisible,
      selected,
      icons
    );
    this.InitializeProperties(
      text,
      backgroundColor,
      color,
      font,
      fontStyle,
      fontSize,
      questionId,
      questionSetId,
      fontWeight,
      isVisible,
      selected,
      icons
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    text: any,
    backgroundColor: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    isVisible: boolean,
    selected: boolean,
    icons: object
  ) {
    this.form = formBuilder.group(
      {
        backgroundColor,
        color,
        font,
        fontStyle,
        fontSize,
        fontWeight,
        isVisible:[isVisible,{ updateOn:'change'}],
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    text: any,
    backgroundColor: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    questionId: string,
    questionSetId: string,
    fontWeight: number | string,
    isVisible: boolean,
    selected: boolean,
    icons: object
  ) {
    this.styles.backgroundColor = backgroundColor;
    this.text = text;
    this.styles.color = color;
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.styles.fontStyle = fontStyle;
    this.questionId = questionId;
    this.questionSetId = questionSetId;
    this.styles.fontWeight = fontWeight;
    this.selectedLanguageId = Language.English;
    this.kioskSelected = selected;
    this.isVisible = isVisible,
    this.icons = icons;
  }
}
