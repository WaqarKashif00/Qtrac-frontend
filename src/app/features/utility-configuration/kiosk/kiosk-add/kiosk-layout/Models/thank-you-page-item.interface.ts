import { FormBuilder } from '@angular/forms';
import { Control } from './controls/control';

export class IThankYouItemControl extends Control {
  type: string;
  text: object;
  value: string;
  visible: boolean;
  selected: boolean;
  constructor(
    formBuilder: FormBuilder,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    type: string,
    text: object,
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
      type,
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
    text: object
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
    type: string,
    text: object,
    value: string,
    visible: boolean,
    selected: boolean
  ) {
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.type = type;
    this.text = text;
    this.value = value;
    this.visible = visible;
    this.styles.fontStyle = fontStyle;
    this.styles.fontWeight = fontWeight;
    this.selected = selected;
  }
}
