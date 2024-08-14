import { FormBuilder } from '@angular/forms';
import { Control } from './controls/control';

export class ILanguageItemControl extends Control {
  text: string;
  value: string;
  visible: boolean;
  selected: boolean;
  constructor(
    formBuilder: FormBuilder,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    text: string,
    value: string,
    visible: boolean,
    selected: boolean
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      text
    );
    this.InitializeProperties(
      font,
      fontStyle,
      fontSize,
      fontWeight,
      text,
      value,
      visible,
      selected
    );
  }
  private InitializeForm(
    formBuilder: FormBuilder,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    text: string
  ) {
    this.form = formBuilder.group(
      {
        font,
        fontStyle,
        fontSize,
        fontWeight,
        text,
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    text: string,
    value: string,
    visible: boolean,
    selected: boolean
  ) {
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.text = text;
    this.value = value;
    this.visible = visible;
    this.styles.fontStyle = fontStyle;
    this.styles.fontWeight = fontWeight;
    this.selected = selected;
  }
}
