import { FormBuilder, Validators } from '@angular/forms';
import { Control } from './control';

export class LabelControl extends Control {
  text: any;
  uniqueName: string;
  selected: boolean;
  alignment: string;
  constructor(
    formBuilder: FormBuilder,
    name: string,
    text: any,
    color: string,
    width: number,
    height: number,
    top: number,
    left: number,
    zindex: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    alignment: string,
    backgroundColor:string
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
      zindex,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      alignment,
      backgroundColor
    );
    this.InitializeProperties(
      name,
      text,
      height,
      width,
      top,
      left,
      zindex,
      color,
      fontSize,
      font,
      fontStyle,
      fontWeight,
      alignment,
      backgroundColor
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    name: string,
    text: any,
    color: string,
    width: number,
    height: number,
    top: number,
    left: number,
    zindex: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    alignment: string,
    backgroundColor:string
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
        zindex: [zindex, {updateOn: 'change'}],
        font,
        fontStyle,
        fontSize,
        fontWeight,
        alignment:[alignment,{ updateOn: 'change' }],
        backgroundColor
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    name: string,
    text: any,
    height: number,
    width: number,
    top: number,
    left: number,
    zindex: number,
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    alignment: string,
    backgroundColor:string
  ) {
    this.name = name;
    this.text = text;
    this.styles.height = height;
    this.styles.width = width;
    this.styles.top = top;
    this.styles.left = left;
    this.styles.zindex = zindex;
    this.styles.color = color;
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.styles.fontStyle = fontStyle;
    this.styles.fontWeight = fontWeight;
    this.uniqueName = 'Label Properties';
    this.alignment = alignment;
    this.styles.backgroundColor=backgroundColor;
  }
}
