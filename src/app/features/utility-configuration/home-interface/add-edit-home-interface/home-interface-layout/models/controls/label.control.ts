import { FormBuilder, Validators } from '@angular/forms';
import { Control } from './control';

export class LabelControl extends Control {
  text: object;
  uniqueName: string;
  selected: boolean;
  alignment: string;
  constructor(
    formBuilder: FormBuilder,
    name: string,
    text: object,
    color: string,
    width: number,
    height: number,
    top: number,
    left: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    alignment: string,
    zindex: number
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      name,
      text,
      color,
      width,
      height,
      top,
      left,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      alignment,
      zindex
    );
    this.InitializeProperties(
      name,
      text,
      height,
      width,
      top,
      left,
      color,
      fontSize,
      font,
      fontStyle,
      fontWeight,
      alignment,
      zindex
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    name: string,
    text: object,
    color: string,
    width: number,
    height: number,
    top: number,
    left: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    alignment: string,
    zindex: number
  ) {
    this.form = formBuilder.group(
      {
        name: [name, Validators.required],
        text,
        color,
        width,
        height,
        top,
        left,
        font,
        fontStyle,
        fontSize,
        fontWeight,
        alignment:[alignment,{ updateOn: 'change' }],
        zindex:[zindex,{ updateOn: 'change' }]
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    name: string,
    text: object,
    height: number,
    width: number,
    top: number,
    left: number,
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    alignment: string,
    zindex: number
  ) {
    this.name = name;
    this.text = text;
    this.styles.height = height;
    this.styles.width = width;
    this.styles.top = top;
    this.styles.left = left;
    this.styles.color = color;
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.styles.fontStyle = fontStyle;
    this.uniqueName = 'Label Properties';
    this.styles.fontWeight = fontWeight;
    this.alignment = alignment;
    this.styles.zindex = zindex;
  }
}
